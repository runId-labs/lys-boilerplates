import {PasswordRule} from "./types";
import {passwordRegex} from "lys-front/tools";

/**
 * Mandatory password rules that must be satisfied
 */
export const mandatoryPasswordRules: PasswordRule[] = [
    {key: "atLeast1SmallLetter", regExp: passwordRegex.lowercase, level: "error"},
    {key: "atLeast1CapitalLetter", regExp: passwordRegex.uppercase, level: "error"},
    {key: "atLeast1Number", regExp: passwordRegex.number, level: "error"},
    {key: "atLeast8Characters", regExp: passwordRegex.minLength8, level: "error"},
];

/**
 * Optional password rules for stronger passwords
 */
export const optionalPasswordRules: PasswordRule[] = [
    {key: "atLeast1SpecialCharacter", regExp: passwordRegex.specialChar, level: "warning"},
    {key: "atLeast12Characters", regExp: passwordRegex.minLength12, level: "warning"},
];