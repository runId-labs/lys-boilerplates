import {useState, useCallback} from "react";

export const useFormEditMode = () => {
    const [isEditing, setIsEditing] = useState(false);

    const startEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEdit = useCallback((onCancel?: () => void) => {
        setIsEditing(false);
        onCancel?.();
    }, []);

    const submitEdit = useCallback(() => {
        setIsEditing(false);
    }, []);

    return {
        isEditing,
        disabled: !isEditing,
        startEdit,
        cancelEdit,
        submitEdit,
    };
};
