// app/(auth)/verify-phone/page.jsx

"use client";

import React from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, ArrowLeft, CheckCircle } from "lucide-react";

const VerifyPhonePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const inputRefs = React.useRef([]);

  React.useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const sendOtp = async () => {
    setIsSending(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/student/send-phone-otp", {
        email,
      });

      if (res.data.success) {
        setOtpSent(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/student/verify-phone", {
        email,
        otp: otpCode,
      });

      if (res.data.success) {
        // Show success message and redirect to login
        router.push("/login?verified=true");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Phone className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Phone
            </h2>
            <p className="text-gray-600 text-center">
              Last step! We'll send a 6-digit code to your phone
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="text-green-500" size={16} />
              <p className="text-sm text-green-600">Email verified</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {!otpSent ? (
            <div>
              <p className="text-center text-gray-600 mb-6">
                Click below to receive your verification code via SMS
              </p>
              <button
                onClick={sendOtp}
                disabled={isSending}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending OTP..." : "Send OTP to Phone"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isLoading ? "Verifying..." : "Verify Phone"}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive code?
                </p>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isSending}
                  className="text-purple-600 font-semibold hover:text-purple-700 disabled:opacity-50"
                >
                  {isSending ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Back */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={16} />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
