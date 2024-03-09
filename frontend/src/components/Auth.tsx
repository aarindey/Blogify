import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpBody } from "@aarindey/medium-zod-common";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const isSignup = type === "signup";
  const [postInputs, setPostInputs] = useState<SignUpBody>({
    name: "",
    username: "",
    password: "",
    bio: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${isSignup ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      alert("Sign up request failed");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center w-[24rem]">
        {isSignup && (
          <div>
            <div className="text-3xl font-extrabold ">Create an account</div>

            <div className="text-slate-400">
              Already have an account?{" "}
              <Link className="pl-2 underline" to={"/signin"}>
                LogIn
              </Link>
            </div>
          </div>
        )}

        {!isSignup && (
          <div>
            <div className="text-3xl font-extrabold ">
              Sign In to your account
            </div>

            <div className="text-slate-400">
              Don't have an account?{" "}
              <Link className="pl-2 underline" to={"/signup"}>
                SignUp
              </Link>
            </div>
          </div>
        )}

        {isSignup && (
          <LabelledInput
            type="text"
            label="Name"
            placeholder="Jane Doe"
            onChange={(e) => {
              setPostInputs({ ...postInputs, name: e.target.value });
            }}
          ></LabelledInput>
        )}
        <LabelledInput
          type="email"
          label="Username/E-mail"
          placeholder="janedoe@gmail.com"
          onChange={(e) => {
            setPostInputs({ ...postInputs, username: e.target.value });
          }}
        ></LabelledInput>

        <LabelledInput
          type="password"
          label="Password"
          placeholder="abc123"
          onChange={(e) => {
            setPostInputs({ ...postInputs, password: e.target.value });
          }}
        ></LabelledInput>

        {isSignup && (
          <LabelledInput
            type="text"
            label="Bio"
            placeholder="Describe yourself in few words"
            onChange={(e) => {
              setPostInputs({ ...postInputs, bio: e.target.value });
            }}
          ></LabelledInput>
        )}
        <button
          type="button"
          onClick={sendRequest}
          className="mt-5 w-1/2 text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
};

interface LabelledInputType {
  type: string;
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  type,
  label,
  placeholder,
  onChange,
}: LabelledInputType) {
  return (
    <div className="mt-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-600 ml-1">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type}
          id="first_name"
          className="bg-gray-50 -mt-1 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}
