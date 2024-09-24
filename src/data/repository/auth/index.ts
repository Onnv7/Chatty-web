import { AuthAPI } from "../../api/auth.api";
import { AuthLocalStorage } from "../../local/auth.localstorage";
import { AuthRepository } from "./auth.repository";

const authApi = new AuthAPI();
const authLocalStorage = new AuthLocalStorage();
const authRepository = new AuthRepository(authApi, authLocalStorage);
export default authRepository;
