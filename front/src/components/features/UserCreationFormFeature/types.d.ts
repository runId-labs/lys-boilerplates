/**
 * Role option for checkbox display
 */
export interface RoleOption {
    code: string;
    label: string;
}

/**
 * User creation form data
 */
export interface UserCreationFormData {
    email: string;
    password: string;
    languageCode: string;
    firstName?: string;
    lastName?: string;
    genderCode?: string;
    roleCodes?: string[];
}

/**
 * UserCreationFormFeature props
 */
export interface UserCreationFormFeatureProps {
    /**
     * Callback when form is submitted with valid data
     */
    onSubmit: (data: UserCreationFormData) => void;

    /**
     * Whether the form is in loading state
     */
    isLoading?: boolean;

    /**
     * Whether the form is disabled
     */
    disabled?: boolean;

    /**
     * Optional role options for role selection
     * When provided, displays a role selection section with checkboxes
     */
    roleOptions?: RoleOption[];
}

/**
 * UserCreationFormFeature ref interface
 */
export interface UserCreationFormFeatureRef {
    /**
     * Reset form to initial state
     */
    reset: () => void;
}
