import {I18nLocaleEnum} from "lys-front/types";

export const commonTranslations = {
    save: { en: "Save", fr: "Enregistrer" },
    cancel: { en: "Cancel", fr: "Annuler" },
    delete: { en: "Delete", fr: "Supprimer" },
    edit: { en: "Edit", fr: "Modifier" },
    close: { en: "Close", fr: "Fermer" },
    back: { en: "Back", fr: "Retour" },
    next: { en: "Next", fr: "Suivant" },
    previous: { en: "Previous", fr: "Précédent" },
    loading: { en: "Loading...", fr: "Chargement..." },
    error: { en: "An error occurred", fr: "Une erreur est survenue" },
    success: { en: "Success", fr: "Succès" },
    confirm: { en: "Confirm", fr: "Confirmer" },
    yes: { en: "Yes", fr: "Oui" },
    no: { en: "No", fr: "Non" },
    search: { en: "Search", fr: "Rechercher" },
    filter: { en: "Filter", fr: "Filtrer" },
    reset: { en: "Reset", fr: "Réinitialiser" },
    submit: { en: "Submit", fr: "Soumettre" },
    required: { en: "Required", fr: "Requis" },
    optional: { en: "Optional", fr: "Optionnel" },
    notAvailable: { en: "N/A", fr: "N/A" },
    // Role codes (from lys framework)
    USER_SUPERVISOR_ROLE: { en: "User Supervisor", fr: "Superviseur utilisateurs" },
    USER_ADMIN_ROLE: { en: "User Admin", fr: "Admin utilisateurs" },
    CLIENT_SUPERVISOR_ROLE: { en: "Client Supervisor", fr: "Superviseur clients" },
    CLIENT_ADMIN_ROLE: { en: "Client Admin", fr: "Admin client" },
    LICENSE_ADMIN_ROLE: { en: "License Admin", fr: "Admin licence" },
    // License plan codes
    FREE: { en: "Freemium", fr: "Freemium (gratuit)" },
    // License rule codes
    MAX_USERS: { en: "User limit", fr: "Limite d'utilisateurs" },
    MAX_PROJECTS_PER_MONTH: { en: "Monthly project limit", fr: "Limite de projets mensuels" },
    unlimited: { en: "Unlimited", fr: "Illimité" },
    // Priority codes
    HIGH: { en: "High", fr: "Haute" },
    MEDIUM: { en: "Medium", fr: "Moyenne" },
    LOW: { en: "Low", fr: "Basse" },
    // Chatbot
    chatbotName: { en: "Chatbot", fr: "Chatbot" },
    // TODO: Add your project-specific common translations here
} satisfies Record<string, Record<I18nLocaleEnum, string>>;

export type CommonTranslationKey = keyof typeof commonTranslations;
