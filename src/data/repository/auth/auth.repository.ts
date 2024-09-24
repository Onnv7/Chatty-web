import { AuthAPI } from "../../api/auth.api";
import { AuthLocalStorage } from "../../local/auth.localstorage";

export class AuthRepository {
  constructor(
    private authApi: AuthAPI,
    private authLocalStorage: AuthLocalStorage
  ) {}
  // async login(body: LoginEntity) {
  //   const data = await this.authApi.login({ ...body } as LoginRequest);
  //   return data;
  // }

  // async register(data: RegisterUserFormEntity) {
  //   const body = registerUserFormToRegisterRequest(data);
  //   await this.authApi.register(body);
  // }

  // async updatePassword(userId: number, data: UpdatePasswordEntity) {
  //   await this.authApi.updatePassword(userId, data);
  // }

  // savingUserAuth(data: LoginResponse) {
  //   console.log("🚀 ~ UserAuthRepository ~ savingUserAuth ~ data:", data);
  //   this.authLocalStorage.saveCredentials(data);
  // }

  clearCredentials() {
    this.authLocalStorage.clearCredentials();
  }

  getUserId() {
    return this.authLocalStorage.getUserId();
  }

  getAccessToken() {
    return this.authLocalStorage.getAccessToken();
  }

  // async validateGoogleAccount(header: GoogleAuthEntity) {
  //   return await this.authApi.validateGoogleAccount({ ...header });
  // }

  // async refreshToken(): Promise<RefreshTokenEntity> {
  //   return await this.authApi.refreshToken();
  // }
}
