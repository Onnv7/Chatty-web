// import { LoginResponse } from "../model/response/user-auth.response";

export class AuthLocalStorage {
  constructor() {}

  //   saveCredentials(credential: LoginResponse) {
  //     localStorage.setItem("user-id", credential.userId.toString());
  //     localStorage.setItem("accessToken", credential.accessToken);
  //   }
  getUserId() {
    return localStorage.getItem("user-id");
  }
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  clearCredentials() {
    localStorage.removeItem("user-id");
    localStorage.removeItem("accessToken");
  }
}
