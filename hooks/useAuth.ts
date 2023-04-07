import { User } from "@prisma/client";
import axios from "axios";

const useAuth = () => {
  const signin = async (user: Pick<User, "email" | "password">) => {
    try {
      const response = await axios.post("/api/auth/signin", user);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (
    user: Omit<User, "created_at" | "updated_at" | "id">
  ) => {};

  return { signin, signup };
};

export default useAuth;
