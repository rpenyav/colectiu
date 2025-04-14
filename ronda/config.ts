import { DEFAULT_LANGUAGE_CODE } from "./context/LanguageContext";

const API_URL_8214 = "http://demo.wad.cat:8214/api";
const API_URL_8114 = "http://demo.wad.cat:8114/api";

export const LOGIN_URL = `${API_URL_8214}/login`;
export const USER_URL = `${API_URL_8114}/${DEFAULT_LANGUAGE_CODE}/persons/user_personalizations`;
export const USER_AVATAR_URL = `${API_URL_8114}/${DEFAULT_LANGUAGE_CODE}/persons/user_personalizations/:userId/avatar/content`;
