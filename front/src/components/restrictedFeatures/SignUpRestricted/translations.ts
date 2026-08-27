import {createComponentTranslations} from "@/tools/translationTools";

const translations = {
    // Form fields
    firstName: {
        en: "First Name",
        fr: "Prénom"
    },
    lastName: {
        en: "Last Name",
        fr: "Nom"
    },
    email: {
        en: "Email",
        fr: "Email"
    },
    emailError: {
        en: "Please enter a valid email address",
        fr: "Veuillez saisir une adresse email valide"
    },
    password: {
        en: "Password",
        fr: "Mot de passe"
    },
    passwordError: {
        en: "Password must be at least 8 characters",
        fr: "Le mot de passe doit contenir au moins 8 caractères"
    },
    clientName: {
        en: "Organization Name",
        fr: "Nom de l'organisation"
    },
    clientNameError: {
        en: "Organization name is required",
        fr: "Le nom de l'organisation est requis"
    },
    submit: {
        en: "Create Account",
        fr: "Créer le compte"
    },
    // Welcome dialog translations
    welcomeTitle: {
        en: "Welcome!",
        fr: "Bienvenue !"
    },
    welcomeMessage: {
        en: "Your account has been created successfully.",
        fr: "Votre compte a été créé avec succès."
    },
    welcomeLoginInfo: {
        en: "You can now log in with your credentials.",
        fr: "Vous pouvez maintenant vous connecter avec vos identifiants."
    },
    welcomeEmailVerification: {
        en: "A verification email has been sent to your email address. Please check your inbox.",
        fr: "Un email de vérification a été envoyé à votre adresse. Veuillez consulter votre boîte de réception."
    },
    welcomeClose: {
        en: "Close",
        fr: "Fermer"
    },
    // Sign up link and dialog
    linkText: {
        en: "Sign up",
        fr: "S'inscrire"
    },
    dialogTitle: {
        en: "Create Account",
        fr: "Créer un compte"
    },
    // Form sections
    structureSection: {
        en: "Organization",
        fr: "Organisation"
    },
    privateDataSection: {
        en: "Personal Information",
        fr: "Informations personnelles"
    },
    accountSection: {
        en: "Account",
        fr: "Compte"
    },
    ssoConnectedVia: {
        en: "Connected via {provider}",
        fr: "Connecté via {provider}"
    },
    // Legal consent (CGU accepted + privacy policy acknowledged) — signup clickwrap
    consentSection: {
        en: "Consent",
        fr: "Consentement"
    },
    consentIAccept: {
        en: "I accept the",
        fr: "J'accepte les"
    },
    termsLinkText: {
        en: "Terms of Use",
        fr: "Conditions Générales d'Utilisation"
    },
    consentAndAcknowledge: {
        en: "and acknowledge the",
        fr: "et reconnais avoir pris connaissance de la"
    },
    privacyLinkText: {
        en: "Privacy Policy",
        fr: "Politique de confidentialité"
    },
    consentError: {
        en: "You must accept the Terms of Use to create an account.",
        fr: "Vous devez accepter les Conditions Générales d'Utilisation pour créer un compte."
    }
} as const;

const {config, useTranslations} = createComponentTranslations(
    "SignUpRestricted",
    translations
);

export const signUpRestrictedConfig = config;
export const useSignUpRestrictedTranslations = useTranslations;