export {menuSections} from "./menuSections";
export type {MenuSection, MenuLink} from "./menuSections";
export {default as navigationTranslation} from "./translation";
export {ADMINISTRATION_TABS} from "./administrationTabs";
export {SUPERVISION_TABS} from "./supervisionTabs";

/**
 * Prefix prepended to every translation key in `services/navigation/translation.ts`
 * when looked up via react-intl. Kept in one place so feature components that
 * render menu/tab labels don't drift.
 */
export const NAVIGATION_TRANS_PREFIX = "lys.services.navigation.";
