"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { getCookie, removeCookies } from "cookies-next";
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
  useCallback,
} from "react";

type State = {
  loading: boolean;
  data: Omit<User, "created_at" | "updated_at"> | null;
  error: string | null;
};

type AuthState = {
  setAuthState: Dispatch<SetStateAction<State>>;

  signin: (
    user: Pick<User, "email" | "password">,
    onSuccess?: () => void
  ) => Promise<void>;

  signup: (
    user: Omit<User, "created_at" | "updated_at" | "id">,
    onSuccess?: () => void
  ) => Promise<void>;

  sigout: () => Promise<void>;
} & State;

export const AuthenticationContext = createContext<AuthState>({} as AuthState);

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({
    loading: false,
    data: null,
    error: null,
  });

  const signin = async (
    user: Pick<User, "email" | "password">,
    onSuccess?: () => void
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axios.post("/api/auth/signin", user);
      setAuthState((prev) => ({ ...prev, data: response.data }));
      onSuccess && onSuccess();
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.errors[0],
      }));
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signup = async (
    user: Omit<User, "created_at" | "updated_at" | "id">,
    onSuccess?: () => void
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await axios.post("/api/auth/signup", user);
      setAuthState((prev) => ({ ...prev, data: response.data }));
      onSuccess && onSuccess();
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.error,
      }));
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  const sigout = async () => {
    removeCookies("jwt");
    setAuthState((prev) => ({ ...prev, data: null }));
  };

  const fecthUser = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const jwt = getCookie("jwt");

      if (!jwt) {
        return setAuthState((prev) => ({ ...prev, loading: false }));
      }

      const response = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setAuthState((prev) => ({
        ...prev,
        data: response.data,
        loading: false,
      }));
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        error: error.response.data.error,
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fecthUser();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ ...authState, setAuthState, signin, signup, sigout }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
