/**
 * Scroll to an element by ID
 * Used to scroll to first error in form validation
 */
export const scrollToId = (elementId: string, parentElementId?: string): void => {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (parentElementId) {
        const parentElement = document.getElementById(parentElementId);
        if (parentElement) {
            // Scroll within parent container
            const elementTop = element.offsetTop;
            const parentTop = parentElement.offsetTop;
            const scrollPosition = elementTop - parentTop - 20; // 20px offset

            parentElement.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
            });
            return;
        }
    }

    // Scroll in viewport
    element.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
};