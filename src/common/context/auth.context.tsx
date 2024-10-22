import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { AuthState, AuthAction, AuthReducer } from './auth.reducer';
import { authRepository, profileRepository } from '../../data/repository';
import { Gender } from '../constant/enum';
import { UserProfileEntity } from '../../domain/entity/conversation.entity';

let userData = null;
if (localStorage.getItem('user') !== 'undefined') {
  userData = JSON.parse(localStorage.getItem('user-id')!);
}
const INITIAL_STATE: AuthState = {
  userId: userData,
};

type AuthContextType = {
  userId: number | null;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    gender: Gender;
    birthDate: Date;
  } | null;
  authDispatch: React.Dispatch<AuthAction>;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [profile, setProfile] = useState<UserProfileEntity | null>(null);

  const isAuthenticated = () => {
    if (state.userId) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const loadingData = async () => {
      if (state.userId) {
        try {
          const userProfile = await profileRepository.getUserProfile(
            state.userId,
          );
          setProfile(userProfile);
        } catch (err) {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        authRepository.clearCredentials();
      }
    };
    loadingData();
  }, [state.userId]);

  return (
    <AuthContext.Provider
      value={{
        userId: state.userId,
        authDispatch: dispatch,
        isAuthenticated,
        profile: profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
