/**
 * Form data for user roles update
 */
export interface UpdateUserRolesFormData {
    roleCodes: string[];
}

/**
 * Props for UpdateUserRolesFormFeature component
 */
export interface UpdateUserRolesFormFeatureProps {
    /**
     * Available role options with codes and translated labels
     */
    roleOptions: Array<{ code: string; label: string }>;

    /**
     * Initial selected role codes
     */
    initialRoleCodes: string[];

    /**
     * Submit handler
     */
    onSubmit: (data: UpdateUserRolesFormData) => void;

    /**
     * Whether the form is currently submitting
     */
    isLoading?: boolean;

    /**
     * Whether the form is disabled
     */
    disabled?: boolean;
}

/**
 * Ref interface for UpdateUserRolesFormFeature
 */
export interface UpdateUserRolesFormFeatureRef {
    /**
     * Reset form to initial values
     */
    reset: () => void;
}