"use client";

import { User } from "@prisma/client";
import axios from "axios";
import { useState, createContext, Dispatch, SetStateAction } from "react";

type State = {
  loading: boolean;
  data: Omit<User, "created_at" | "updated_at"> | null;
  errors: string[] | [];
};

type AuthState = {
  setAuthState: Dispatch<SetStateAction<State>>;
  signin: (user: Pick<User, "email" | "password">) => Promise<void>;
  signup: (
    user: Omit<User, "created_at" | "updated_at" | "id">
  ) => Promise<void>;
} & State;

export const AuthenticationContext = createContext<AuthState>({} as AuthState);

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({} as State);

  const signin = async (user: Pick<User, "email" | "password">) => {
    setAuthState({ ...authState, loading: true });
    try {
      const response = await axios.post("/api/auth/signin", user);
      setAuthState({ ...authState, data: response.data });
    } catch (error: any) {
      setAuthState({ ...authState, errors: error.response.data.errors });
    } finally {
      setAuthState({ ...authState, loading: false });
    }
  };

  const signup = async (
    user: Omit<User, "created_at" | "updated_at" | "id">
  ) => {};

  return (
    <AuthenticationContext.Provider
      value={{ ...authState, setAuthState, signin, signup }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
