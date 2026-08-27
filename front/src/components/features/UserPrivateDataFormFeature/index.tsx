import {forwardRef, useImperativeHandle, useMemo, useRef} from "react";
import {UserPrivateDataFormFeatureProps, UserPrivateDataFormData, UserPrivateDataFormFeatureRef} from "./types";
import {useUserPrivateDataFormFeatureTranslations} from "./translations";
import FormFeature from "@/components/features/FormFeature";
import {FormSection, FormFeatureRef} from "@/components/features/FormFeature/types";
import {validators} from "lys-front/tools";
import SelectGenderRestricted from "@/components/restrictedFeatures/SelectGenderRestricted";
import SelectLanguageRestricted from "@/components/restrictedFeatures/SelectLanguageRestricted";

/**
 * UserPrivateDataFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - User private data update form
 * - First name, last name, gender, and language fields
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Provides private data validation
 * - Handles private data update submission
 * - Receives options as props (no GraphQL here)
 */
const UserPrivateDataFormFeature = forwardRef<UserPrivateDataFormFeatureRef, UserPrivateDataFormFeatureProps>(({
    onSubmit,
    isLoading = false,
    initialValues,
    disabled = false
}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUserPrivateDataFormFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  REFS
     ******************************************************************************************************************/

    const formRef = useRef<FormFeatureRef>(null);

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Form sections configuration
     */
    const formSections: FormSection[] = useMemo(() => [
        {
            uniqueKey: "private-data-info",
            controls: [
                {
                    label: t("firstName"),
                    type: "text" as const,
                    valueKey: "firstName",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.required(t("firstNameError")),
                    xs: 12,
                    md: 6
                },
                {
                    label: t("lastName"),
                    type: "text" as const,
                    valueKey: "lastName",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.required(t("lastNameError")),
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
                        nullable: true
                    },
                    xs: 12,
                    md: 6
                }
            ]
        }
    ], [t]);

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
            uniqueKey="user-private-data-form"
            sections={formSections}
            submit={(params) => onSubmit(params as UserPrivateDataFormData)}
            targetId=""
            isInFlight={isLoading}
            submitButtonText={t("submit")}
            showSectionTitles={false}
            initParameters={initialValues}
            disabled={disabled}
        />
    );
});

UserPrivateDataFormFeature.displayName = "UserPrivateDataFormFeature";

export default UserPrivateDataFormFeature;
