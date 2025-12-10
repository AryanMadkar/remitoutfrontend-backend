// app/(auth)/login/page.jsx
"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import banner from "../../../../public/images/login/iamge.png";

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const data = res.data;

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      const redirectPath = data.data?.redirectPath || "/student";

      // Cookie is already set by backend, just navigate
      router.push(redirectPath);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Network or server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left image section (same as before) */}
      <div className="relative w-full md:w-[60%] h-[40vh] md:h-screen">
        <Image
          src={banner}
          alt="Student login"
          fill
          quality={100}
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join thousands of students who achieved their dream of studying
              abroad.
            </h2>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white px-8 md:px-12 lg:px-16 py-10 md:py-0">
        <div className="w-full max-w-md space-y-6">
          {/* Logo & heading (same as your existing page) */}
          <div className="flex justify-center md:justify-start">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rotate-45 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg" />
              <div className="absolute inset-2 rotate-45 bg-white rounded-sm" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-1">Login to continue</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email input (use existing name="email") */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Password input (use existing name="password") */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 pt-2">
            Don&apos;t have an account?{" "}
            <a
              href="/student/register"
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
