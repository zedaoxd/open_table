"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import Inputs from "./Inputs";
import { useAuth } from "../../../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup, loading, error } = useAuth();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [inputs, setInputs] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  } as User);

  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (isSignin) {
      if (inputs.email && inputs.password) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      if (
        inputs.first_name &&
        inputs.last_name &&
        inputs.email &&
        inputs.phone &&
        inputs.city &&
        inputs.password
      ) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  }, [inputs]);

  const handleClick = () => {
    if (isSignin) {
      signin(inputs, handleClose);
    } else {
      signup(inputs);
    }
  };

  return (
    <div>
      <button
        className={
          isSignin
            ? "bg-blue-400 text-white border p-1 px-4 rounded mr-3"
            : "border p-1 px-4 rounded"
        }
        onClick={handleOpen}
      >
        {isSignin ? "Sign in" : "Sign up"}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading && (
            <div className="p-2 flex justify-center align-middle">
              <CircularProgress />
            </div>
          )}
          {!loading && (
            <div className="p-2">
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {isSignin ? "Sign in" : "Create Account"}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {isSignin
                    ? "Log Into Yout Account"
                    : "Create Your OpenTable Account"}
                </h2>
                <Inputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={disable}
                  onClick={handleClick}
                >
                  {isSignin ? "Sign In" : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
