const HTTP_STATUS = Object.freeze({
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    TOO_MANY_REQUEST: 429,
    SERVER_ERROR: 500,
});

const PROTOCOL = "http";
const HOST = "103.82.28.130";
const PORT = "8016/service";

const LANG = Object.freeze({
    vi: "Tiếng Việt",
    en: "English",
});
const PROJECT = Object.freeze({
    DASHBOARD: "DASHBOARD",
    WATER_DANCE: "WATER_DANCE",
});

export { HTTP_STATUS, PROTOCOL, HOST, PORT, LANG, PROJECT };
