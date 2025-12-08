// app/(auth)/student/register/page.jsx
"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import banner from "../../../../../public/images/login/image2.png";

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    // Names must match studentRegisterSchema: firstName, lastName, email, phoneNumber, password
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const phoneNumber = formData.get("phoneNumber");
    const password = formData.get("password");

    try {
      const res = await axios.post("/api/auth/student/register", {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });

      const data = res.data;

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess(
        "Account created! Please verify OTPs if required, then login."
      );
      if (res.data.success) {
        // Redirect to email verification page
        router.push(`student/verify-email?email=${encodeURIComponent(email)}`);
      }
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
      {/* Left image section - 60% width */}
      <div className="relative w-full md:w-[60%] h-[40vh] md:h-screen">
        <Image
          src={banner}
          alt="Student registration"
          fill
          quality={100}
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay with text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Journey to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">
                Global Education
              </span>
              <br />
              Starts Here
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mt-4">
              Join thousands of students who achieved their dream of studying
              abroad.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel - 40% width */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white px-8 md:px-12 lg:px-16 py-10 md:py-0">
        <div className="w-full max-w-md space-y-6">
          {/* Logo - Orange Diamond */}
          <div className="flex justify-center md:justify-start">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rotate-45 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg" />
              <div className="absolute inset-2 rotate-45 bg-white rounded-sm" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Get Started!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Create your account to continue
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
              {success}
            </p>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName" // CHANGED from "name"
                placeholder="First Name"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                name="phoneNumber" // CHANGED to match backend schema
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>

            {/* Password with Toggle */}
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

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-600 leading-tight">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-orange-500 hover:text-orange-600 hover:underline"
                >
                  terms & policy
                </a>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
