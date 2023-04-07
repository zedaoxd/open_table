import { useContext } from "react";
import { AuthenticationContext } from "../app/context/authContext";

export const useAuth = () => {
  return useContext(AuthenticationContext);
};
