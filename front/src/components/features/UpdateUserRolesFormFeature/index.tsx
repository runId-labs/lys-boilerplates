import {forwardRef, useImperativeHandle, useMemo, useRef} from "react";
import {UpdateUserRolesFormFeatureProps, UpdateUserRolesFormFeatureRef} from "./types";
import {useUpdateUserRolesFormFeatureTranslations} from "./translations";
import FormFeature from "@/components/features/FormFeature";
import {FormSection, FormFeatureRef} from "@/components/features/FormFeature/types";

/**
 * UpdateUserRolesFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - User roles update form with checkboxes
 * - Displays all available roles with translated labels
 * - Allows selection/deselection of multiple roles
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Provides role selection via checkboxes
 * - Handles role update submission
 * - Receives role options as props (no GraphQL here)
 */
const UpdateUserRolesFormFeature = forwardRef<UpdateUserRolesFormFeatureRef, UpdateUserRolesFormFeatureProps>(({
    roleOptions,
    initialRoleCodes,
    onSubmit,
    isLoading = false,
    disabled = false
}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUpdateUserRolesFormFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const formRef = useRef<FormFeatureRef>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Form sections configuration with checkboxes for each role
     */
    const formSections: FormSection[] = useMemo(() => [
        {
            uniqueKey: "roles-section",
            title: t("rolesLabel"),
            controls: roleOptions.map(role => ({
                label: role.label,
                type: "checkbox" as const,
                valueKey: `role_${role.code}`,
                xs: 12,
                md: 6
            }))
        }
    ], [roleOptions, t]);

    /**
     * Transform initial role codes to form parameters
     */
    const initialParameters = useMemo(() => {
        const params: Record<string, boolean> = {};
        roleOptions.forEach(role => {
            params[`role_${role.code}`] = initialRoleCodes.includes(role.code);
        });
        return params;
    }, [roleOptions, initialRoleCodes]);

    /**
     * Get list of selected roles for read-only display
     */
    const selectedRoles = useMemo(() => {
        return roleOptions.filter(role => initialRoleCodes.includes(role.code));
    }, [roleOptions, initialRoleCodes]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle form submission - transform checkbox values to roleCodes array
     */
    const handleSubmit = (params: Record<string, any>) => {
        const selectedRoleCodes: string[] = [];

        roleOptions.forEach(role => {
            if (params[`role_${role.code}`] === true) {
                selectedRoleCodes.push(role.code);
            }
        });

        onSubmit({ roleCodes: selectedRoleCodes });
    };

    /*******************************************************************************************************************
     *                                                  EFFECTS
     ******************************************************************************************************************/

    /**
     * Expose reset method via ref
     */
    useImperativeHandle(ref, () => ({
        reset: () => {
            formRef.current?.clear();
        }
    }), []);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <>
            {disabled ? (
                <div className="roles-display">
                    {selectedRoles.length > 0 ? (
                        <ul className="list-unstyled">
                            {selectedRoles.map(role => (
                                <li key={role.code} className="mb-2">
                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                    {role.label}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">
                            {t("noRoles")}
                        </p>
                    )}
                </div>
            ) : (
                <FormFeature
                    ref={formRef}
                    uniqueKey="update-user-roles-form"
                    sections={formSections}
                    submit={handleSubmit}
                    targetId=""
                    isInFlight={isLoading}
                    submitButtonText={t("submit")}
                    showSectionTitles={false}
                    initParameters={initialParameters}
                    disabled={disabled}
                />
            )}
        </>
    );
});

UpdateUserRolesFormFeature.displayName = "UpdateUserRolesFormFeature";

export default UpdateUserRolesFormFeature;