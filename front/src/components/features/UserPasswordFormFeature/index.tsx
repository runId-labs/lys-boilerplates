import React, {useMemo} from "react";
import {UserPasswordFormFeatureProps, UserPasswordFormData} from "./types";
import {useUserPasswordFormFeatureTranslations} from "./translations";
import FormFeature from "@/components/features/FormFeature";
import {FormSection} from "@/components/features/FormFeature/types";
import {validators} from "lys-front/tools";

/**
 * UserPasswordFormFeature component
 *
 * Feature component (Layer 2) that provides:
 * - Password update form
 * - Password confirmation validation
 * - Current password requirement
 *
 * This is a feature component (Layer 2) that:
 * - Uses FormFeature for form rendering
 * - Provides password-specific validation
 * - Handles password update submission
 */
const UserPasswordFormFeature: React.FC<UserPasswordFormFeatureProps> = ({
    onSubmit,
    isLoading = false
}) => {
    /*******************************************************************************************************************
     *                                                  HOOKS
     ******************************************************************************************************************/

    const {t} = useUserPasswordFormFeatureTranslations();

    /*******************************************************************************************************************
     *                                                  MEMOS
     ******************************************************************************************************************/

    /**
     * Form sections configuration
     */
    const formSections: FormSection[] = useMemo(() => [
        {
            uniqueKey: "password-info",
            controls: [
                {
                    label: t("currentPassword"),
                    type: "password",
                    valueKey: "currentPassword",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.required(t("passwordError")),
                    xs: 12
                },
                {
                    label: t("newPassword"),
                    type: "password_edit",
                    valueKey: "newPassword",
                    isFloatingLabel: true,
                    required: true,
                    validator: validators.required(t("passwordError")),
                    xs: 12
                }
            ]
        }
    ], [t]);

    /*******************************************************************************************************************
     *                                                  RENDER
     ******************************************************************************************************************/

    return (
        <FormFeature
            uniqueKey="user-password-form"
            sections={formSections}
            submit={(params) => onSubmit(params as UserPasswordFormData)}
            targetId=""
            isInFlight={isLoading}
            submitButtonText={t("submit")}
            showSectionTitles={false}
        />
    );
};

UserPasswordFormFeature.displayName = "UserPasswordFormFeature";

export default UserPasswordFormFeature;