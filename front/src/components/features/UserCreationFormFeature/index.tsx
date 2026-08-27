import {forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from "react";
import {useIntl} from "react-intl";
import {UserCreationFormFeatureProps, UserCreationFormData, UserCreationFormFeatureRef} from "./types";
import {useUserCreationFormFeatureTranslations} from "./translations";
import FormFeature from "@/components/features/FormFeature";
import {FormSection, FormFeatureRef} from "@/components/features/FormFeature/types";
import {validators} from "lys-front/tools";
import SelectGenderRestricted from "@/components/restrictedFeatures/SelectGenderRestricted";
import SelectLanguageRestricted from "@/components/restrictedFeatures/SelectLanguageRestricted";

/**
 * UserCreationFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - User creation form
 * - Email, password, language (required) + first name, last name, gender (optional)
 * - Optional role selection with checkboxes
 * - Validation rules matching backend requirements
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Provides validation for all fields
 * - Does not handle mutation (delegated to restricted component)
 */
const UserCreationFormFeature = forwardRef<UserCreationFormFeatureRef, UserCreationFormFeatureProps>(({
    onSubmit,
    isLoading = false,
    disabled = false,
    roleOptions
}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const intl = useIntl();
    const {t} = useUserCreationFormFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const formRef = useRef<FormFeatureRef>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Base form sections configuration
     */
    const baseSections: FormSection[] = useMemo(() => [
        {
            uniqueKey: "credentials",
            controls: [
                {
                    label: t("email"),
                    type: "email" as const,
                    valueKey: "email",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.email(t("emailInvalid")),
                    xs: 12
                },
                {
                    label: t("password"),
                    type: "password_edit" as const,
                    valueKey: "password",
                    isFloatingLabel: true,
                    required: true,
                    xs: 12
                }
            ]
        },
        {
            uniqueKey: "personal-info",
            controls: [
                {
                    label: t("firstName"),
                    type: "text" as const,
                    valueKey: "firstName",
                    isFloatingLabel: true,
                    xs: 12,
                    md: 6
                },
                {
                    label: t("lastName"),
                    type: "text" as const,
                    valueKey: "lastName",
                    isFloatingLabel: true,
                    xs: 12,
                    md: 6
                },
                {
                    label: "",
                    type: "custom" as const,
                    valueKey: "genderCode",
                    customComponent: SelectGenderRestricted,
                    customProps: {
                        isFloatingLabel: true,
                        nullable: true
                    },
                    xs: 12,
                    md: 6
                },
                {
                    label: "",
                    type: "custom" as const,
                    valueKey: "languageCode",
                    customComponent: SelectLanguageRestricted,
                    customProps: {
                        isFloatingLabel: true,
                        required: true
                    },
                    xs: 12,
                    md: 6
                }
            ]
        }
    ], [t]);

    /**
     * Roles section configuration (only when roleOptions provided)
     */
    const rolesSection: FormSection | null = useMemo(() => {
        if (!roleOptions || roleOptions.length === 0) return null;

        return {
            uniqueKey: "roles-section",
            title: t("rolesLabel"),
            controls: roleOptions.map(role => ({
                label: role.label,
                type: "checkbox" as const,
                valueKey: `role_${role.code}`,
                xs: 12,
                md: 6
            }))
        };
    }, [roleOptions, t]);

    /**
     * Combined form sections
     */
    const formSections: FormSection[] = useMemo(() => {
        if (rolesSection) {
            return [...baseSections, rolesSection];
        }
        return baseSections;
    }, [baseSections, rolesSection]);

    /**
     * Initial form parameters with default language from current locale
     */
    const initParameters = useMemo(() => ({
        languageCode: intl.locale
    }), [intl.locale]);

    /*******************************************************************************************************************
     *                                                  CALLBACKS
     ******************************************************************************************************************/

    /**
     * Handle form submission - transform checkbox values to roleCodes array
     */
    const handleSubmit = useCallback((params: Record<string, any>) => {
        const formData: UserCreationFormData = {
            email: params.email,
            password: params.password,
            languageCode: params.languageCode,
            firstName: params.firstName || undefined,
            lastName: params.lastName || undefined,
            genderCode: params.genderCode || undefined
        };

        // Extract roleCodes from checkbox values
        if (roleOptions && roleOptions.length > 0) {
            const selectedRoleCodes: string[] = [];
            roleOptions.forEach(role => {
                if (params[`role_${role.code}`] === true) {
                    selectedRoleCodes.push(role.code);
                }
            });
            formData.roleCodes = selectedRoleCodes;
        }

        onSubmit(formData);
    }, [roleOptions, onSubmit]);

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
        <FormFeature
            ref={formRef}
            uniqueKey="user-creation-form"
            sections={formSections}
            submit={handleSubmit}
            targetId=""
            initParameters={initParameters}
            isInFlight={isLoading}
            submitButtonText={t("submit")}
            showSectionTitles={!!roleOptions}
            disabled={disabled}
        />
    );
});

UserCreationFormFeature.displayName = "UserCreationFormFeature";

export default UserCreationFormFeature;
