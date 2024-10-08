import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const response = await axios.post("http://localhost:3000/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("User registered:", response.data);
      if (response.data.user) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setError("submitError", {
        type: "manual",
        message: error.response?.data?.message || "An error occurred during registration.",
      });
    }
  };
  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };
  return (
    <div className="flex flex-col md:flex-row mx-auto min-h-screen w-full md:w-4/5 p-4 md:p-0">
      <div className="w-full md:w-1/2 flex justify-center items-center mb-8 md:mb-0  ">
        <img src="authForm2.jpg" alt="register Image" className="max-w-full h-auto shadow-transparent rounded-xl " />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-slate-500 border border-[oklch(0.4_0.1_272.54)] flex flex-col items-center justify-center  p-6 md:p-10 rounded-xl shadow-lg ">
          <img className="w-24 " src="logoRegister.png" alt="register Logo" />
          <span className="font-bold text-2xl text-white mb-8">Sign Up</span>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-5">
            <div className="w-full">
              <label className="w-full input input-bordered flex items-center gap-2 bg-white">
                <span className="text-gray-700">Name</span>
                <input
                  type="text"
                  className="grow"
                  placeholder="Please enter your Name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </label>
              {errors.name && <p className="text-red-700 text-sm font-bold mt-1">{errors.name.message}</p>}
            </div>
            <div className="w-full">
              <label className="w-full input input-bordered flex items-center gap-2 bg-white">
                <span className="text-gray-700">Email</span>
                <input
                  type="text"
                  className="grow"
                  placeholder="user@site.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </label>
              {errors.email && <p className="text-red-700 text-sm font-bold mt-1">{errors.email.message}</p>}
            </div>

            <div className="w-full">
              <label className="w-full input input-bordered flex items-center gap-2 bg-white">
                <span className="text-gray-700">Password</span>
                <input
                  type="password"
                  className="grow"
                  placeholder="Your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])/,
                      message: "Password must contain at least one capital letter",
                    },
                  })}
                />
              </label>
              {errors.password && <p className="text-red-700 text-sm font-bold mt-1">{errors.password.message}</p>}
            </div>
            <div className="w-full">
              <label className="w-full input input-bordered flex items-center gap-2 bg-white">
                <span className="text-gray-700">Avatar</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            <span className="capitalize text-sm font-bold text-zinc-300 ">
              I already have an account{" "}
              <Link className="underline text-white hover:text-blue-200" to="/login">
                Login
              </Link>
            </span>

            <div className="flex justify-center items-center w-full ">
              <button type="submit" className="btn font-bold bg-slate-700 border-none text-white w-full md:w-1/2 hover:bg-slate-600 hover:text-black">
                Register Now{" "}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
