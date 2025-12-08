// lib/otp.js
export function generateNumericOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export function getOtpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
