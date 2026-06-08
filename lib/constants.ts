export const APP_CONFIG = {
    NAME: "Parabolica",
    DESC: "Next-Gen Gaming Experiences",
    PREFIX: "parabolica_v1_",
} as const;

export const STORAGE_KEYS = {
    LANGUAGE: `${APP_CONFIG.PREFIX}-language`,
} as const;

export const LOCALE_CONFIG = {
    DEFAULT: "en",
    SUPPORTED: ["en", "tr"] as const,
} as const;