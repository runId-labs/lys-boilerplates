import {useCallback, useRef} from "react";
import {FrontendAction} from "lys-front/providers";

interface StreamingResult {
    conversationId: string | null;
    toolCallsCount: number;
    frontendActions: FrontendAction[] | null;
}

/** A tool the assistant is calling, surfaced so the UI can show progress while it works. */
export interface StreamingActivity {
    phase: "start" | "result";
    name: string;
}

/**
 * Error carrying the backend error code (a project-specific code) from an
 * SSE "error" event, so callers can translate it via isErrorKey instead of always
 * showing a generic message.
 */
export class StreamingChatError extends Error {
    code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = "StreamingChatError";
        this.code = code;
    }
}

interface UseStreamingChatReturn {
    sendStreamingMessage: (
        message: string,
        conversationId: string | null,
        context: {pageName: string; params: Record<string, unknown>} | null,
        onToken: (content: string) => void,
        onActivity?: (activity: StreamingActivity) => void,
        onReasoningProgress?: (characters: number) => void,
    ) => Promise<StreamingResult>;
    abortStreaming: () => void;
}

/**
 * Read the XSRF-TOKEN cookie value (Double Submit Cookie pattern).
 */
function getXsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Hook for streaming chat via SSE POST /sse/chat endpoint.
 *
 * @param handleSessionExpired - Callback from ConnectedUserProvider to refresh token on 401
 */
export function useStreamingChat(
    handleSessionExpired: (onRefreshSuccess?: () => void) => void
): UseStreamingChatReturn {
    const abortControllerRef = useRef<AbortController | null>(null);

    const abortStreaming = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
    }, []);

    const sendStreamingMessage = useCallback(async (
        message: string,
        conversationId: string | null,
        context: {pageName: string; params: Record<string, unknown>} | null,
        onToken: (content: string) => void,
        onActivity?: (activity: StreamingActivity) => void,
        onReasoningProgress?: (characters: number) => void,
    ): Promise<StreamingResult> => {
        // Abort any previous stream
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const buildHeaders = (): Record<string, string> => {
            const h: Record<string, string> = {"Content-Type": "application/json"};
            const xsrf = getXsrfToken();
            if (xsrf) h["X-XSRF-TOKEN"] = xsrf;
            return h;
        };

        const body = JSON.stringify({
            message,
            conversationId,
            context,
        });

        const makeRequest = () => fetch("/sse/chat", {
            method: "POST",
            headers: buildHeaders(),
            credentials: "include",
            body,
            signal: controller.signal,
        });

        let response = await makeRequest();

        // On 401, refresh token and retry once
        if (response.status === 401) {
            response = await new Promise<Response>((resolve, reject) => {
                handleSessionExpired(() => {
                    makeRequest().then(resolve).catch(reject);
                });
            });
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`SSE chat error ${response.status}: ${text}`);
        }

        if (!response.body) {
            throw new Error("No response body for SSE stream");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let result: StreamingResult = {
            conversationId: null,
            toolCallsCount: 0,
            frontendActions: null,
        };

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, {stream: true});

                // Process complete SSE events (separated by double newlines)
                const events = buffer.split("\n\n");
                // Keep the last incomplete chunk in the buffer
                buffer = events.pop() || "";

                for (const eventBlock of events) {
                    if (!eventBlock.trim()) continue;

                    let eventType = "";
                    let eventData = "";

                    for (const line of eventBlock.split("\n")) {
                        if (line.startsWith("event: ")) {
                            eventType = line.slice(7);
                        } else if (line.startsWith("data: ")) {
                            eventData = line.slice(6);
                        }
                    }

                    if (!eventType || !eventData) continue;

                    try {
                        const parsed = JSON.parse(eventData);

                        switch (eventType) {
                            case "token":
                                if (parsed.content) {
                                    onToken(parsed.content);
                                }
                                break;

                            case "done":
                                result = {
                                    conversationId: parsed.conversationId || null,
                                    toolCallsCount: parsed.toolCallsCount || 0,
                                    frontendActions: parsed.frontendActions || null,
                                };
                                break;

                            case "error":
                                throw new StreamingChatError(
                                    parsed.message || "Streaming error",
                                    parsed.code || "INTERNAL_ERROR",
                                );

                            // Tool events drive the progress list: the model can spend a long
                            // time between the question and the first token, and these are the
                            // only signals that something is happening during that gap.
                            // The model reasons for tens of seconds before its first answer
                            // token; this counter is the only thing moving meanwhile. It
                            // carries the size of the reasoning stream, never its content.
                            case "reasoning_progress":
                                if (typeof parsed.characters === "number") {
                                    onReasoningProgress?.(parsed.characters);
                                }
                                break;

                            case "tool_start":
                                onActivity?.({phase: "start", name: parsed.name});
                                break;

                            case "tool_result":
                                onActivity?.({phase: "result", name: parsed.name});
                                break;
                        }
                    } catch (e) {
                        if (e instanceof SyntaxError) {
                            console.warn("SSE: invalid JSON data", eventData);
                        } else {
                            throw e;
                        }
                    }
                }
            }
        } catch (e) {
            if (e instanceof DOMException && e.name === "AbortError") {
                // Stream was aborted by the user — not an error
            } else {
                throw e;
            }
        }

        return result;
    }, [handleSessionExpired]);

    return {sendStreamingMessage, abortStreaming};
}