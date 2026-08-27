import {forwardRef, useImperativeHandle, useMemo, useRef} from "react";
import {UserEmailFormFeatureProps, UserEmailFormData, UserEmailFormFeatureRef} from "./types";
import {useUserEmailFormFeatureTranslations} from "./translations";
import FormFeature from "@/components/features/FormFeature";
import {FormSection, FormFeatureRef} from "@/components/features/FormFeature/types";
import {validators} from "lys-front/tools";

/**
 * UserEmailFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Email update form
 * - Email validation
 * - Current email display
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Provides email-specific validation
 * - Handles email update submission
 */
const UserEmailFormFeature = forwardRef<UserEmailFormFeatureRef, UserEmailFormFeatureProps>(({
    currentEmail,
    onSubmit,
    isLoading = false,
    disabled = false
}, ref) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUserEmailFormFeatureTranslations();

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
            uniqueKey: "email-info",
            controls: [
                {
                    label: t("email"),
                    type: "email",
                    valueKey: "email",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.custom(
                        (value) => {
                            // Check if it's a valid email AND different from current
                            const isValidEmail = validators.email(t("emailError")).method(value);
                            if (!isValidEmail) return false;

                            const isDifferent = String(value).toLowerCase() !== currentEmail.toLowerCase();
                            return isDifferent;
                        },
                        t("sameEmailError")
                    ),
                    xs: 12
                }
            ]
        }
    ], [t, currentEmail]);

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
            uniqueKey="user-email-form"
            sections={formSections}
            submit={(params) => onSubmit(params as UserEmailFormData)}
            targetId=""
            isInFlight={isLoading}
            initParameters={{email: currentEmail}}
            submitButtonText={t("submit")}
            showSectionTitles={false}
            disabled={disabled}
        />
    );
});

UserEmailFormFeature.displayName = "UserEmailFormFeature";

export default UserEmailFormFeature;