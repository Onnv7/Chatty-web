export interface AuthState {
  userId: number | null;
}
export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: number }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" };

export const AuthReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        userId: action.payload,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        userId: null,
      };
    case "LOGOUT":
      return {
        ...state,
        userId: null,
      };
    default:
      return state;
  }
};
