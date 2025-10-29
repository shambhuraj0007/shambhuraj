import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("Name, email and password are required");
    }

    try {
     const url = `${import.meta.env.VITE_BACKEND_URL}/auth/signup`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message } = result;

      if (success) {
        handleSuccess(message || "Signup successful");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(message || "Signup failed");
      }
    } catch (err) {
      handleError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name"
              value={signupInfo.name}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupInfo.email}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={signupInfo.password}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Sign Up
          </button>
        </form>

        {/* Login redirect */}
        <p className="mt-6 text-center text-sm text-gray-600 ">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
