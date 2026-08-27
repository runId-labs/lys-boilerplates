import React from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import {TransferListElementProps, TransferItem} from "./types";
import {cn} from "lys-front/tools";
import {Button, Form, Spinner} from "react-bootstrap";
import "./styles.scss";

/**
 * TransferListElement component
 *
 * Element component (Layer 1) that provides a dual-list drag-and-drop interface:
 * - Two columns: source (left) and target (right)
 * - Items can be dragged between columns
 * - Search input on the source column
 * - Loading and empty states
 */
const TransferListElement: React.FC<TransferListElementProps> = ({
    sourceItems,
    targetItems,
    onTransferToTarget,
    onTransferToSource,
    sourceTitle,
    targetTitle,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    isSourceLoading = false,
    isMutating = false,
    emptySourceMessage,
    emptyTargetMessage,
    onLoadMore,
    hasMoreSource = false,
    loadMoreLabel,
    className,
}) => {
    /**
     * Handle drag end — determine transfer direction based on source/destination droppable
     */
    const handleDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        if (source.droppableId === "transfer-source" && destination.droppableId === "transfer-target") {
            onTransferToTarget(draggableId);
        } else if (source.droppableId === "transfer-target" && destination.droppableId === "transfer-source") {
            onTransferToSource(draggableId);
        }
    };

    /**
     * Render a single draggable item, with optional remove button
     */
    const renderItem = (item: TransferItem, index: number, onRemove?: (id: string) => void) => (
        <Draggable
            key={item.id}
            draggableId={item.id}
            index={index}
            isDragDisabled={isMutating}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "transfer-list__item",
                        snapshot.isDragging && "transfer-list__item--dragging"
                    )}
                >
                    <span className="transfer-list__item-icon">
                        <i className="bi bi-grip-vertical" />
                    </span>
                    <div className="transfer-list__item-content">
                        <div className="transfer-list__item-label">{item.label}</div>
                        {item.subtitle && (
                            <div className="transfer-list__item-subtitle">{item.subtitle}</div>
                        )}
                    </div>
                    {onRemove && (
                        <button
                            type="button"
                            className="transfer-list__item-remove"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remove ${item.label}`}
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={cn("transfer-list", isMutating && "transfer-list--disabled", className)}>
                {/* Source column (left) */}
                <div className="transfer-list__column">
                    <div className="transfer-list__column-header">
                        <span>{sourceTitle}</span>
                        <span className="transfer-list__column-count">{sourceItems.length}</span>
                    </div>

                    <div className="transfer-list__search">
                        <Form.Control
                            type="text"
                            size="sm"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    <Droppable droppableId="transfer-source">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                    "transfer-list__droppable",
                                    snapshot.isDraggingOver && "transfer-list__droppable--dragging-over"
                                )}
                            >
                                {isSourceLoading ? (
                                    <div className="transfer-list__loading">
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                ) : sourceItems.length === 0 ? (
                                    <div className="transfer-list__empty">
                                        {emptySourceMessage}
                                    </div>
                                ) : (
                                    <>
                                        {sourceItems.map((item, index) => renderItem(item, index))}
                                        {hasMoreSource && onLoadMore && (
                                            <div className="transfer-list__load-more">
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={onLoadMore}
                                                >
                                                    {loadMoreLabel}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Target column (right) */}
                <div className="transfer-list__column">
                    <div className="transfer-list__column-header">
                        <span>{targetTitle}</span>
                        <span className="transfer-list__column-count">{targetItems.length}</span>
                    </div>

                    <Droppable droppableId="transfer-target">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={cn(
                                    "transfer-list__droppable",
                                    snapshot.isDraggingOver && "transfer-list__droppable--dragging-over"
                                )}
                            >
                                {targetItems.length === 0 ? (
                                    <div className="transfer-list__empty">
                                        {emptyTargetMessage}
                                    </div>
                                ) : (
                                    targetItems.map((item, index) => renderItem(item, index, onTransferToSource))
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
};

TransferListElement.displayName = "TransferListElement";

export default TransferListElement;
