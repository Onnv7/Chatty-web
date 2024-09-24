import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { useAuthContext } from "../context/auth.context";

const BASE_URL = "http://localhost:8000/api";
export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const httpAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const setAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    httpAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
setAuthToken();

export function useInterceptor() {
  const { userId, authDispatch } = useAuthContext();

  httpAuth.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 500 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const { accessToken } = { accessToken: "hi" }; // await refreshToken();

          httpAuth.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          return httpAuth(originalRequest);
        } catch (refreshError) {
          authDispatch({ type: "LOGOUT" });
          //   toastNotification({
          //     msg: "Có lỗi, vui lòng đăng nhập lại",
          //     type: "error",
          //   });
          //   googleLogout();

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}
