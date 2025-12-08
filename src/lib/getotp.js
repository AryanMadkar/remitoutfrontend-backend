// lib/getotp.js
import axios from 'axios';

// You already updated SEND_URL to this:
const SEND_URL = 'https://api.otp.dev/v1/verifications';
const VERIFY_URL = 'https://api.otp.dev/v1/verifications';

export async function sendSmsOtpWithGetOtp(phoneNumber) {
  const apiKey = process.env.GETOTP_API_KEY;
  const sender = process.env.GETOTP_SENDER;
  const templateId = process.env.GETOTP_TEMPLATE_ID;

  if (!apiKey || !sender || !templateId) {
    throw new Error('GetOTP environment variables are not configured');
  }

  const formattedPhone = phoneNumber.startsWith('+')
    ? phoneNumber.replace('+', '')
    : phoneNumber;

  const payload = {
    channel: 'sms',
    sender,
    phone: formattedPhone,
    template: templateId,
    code_length: 6,
  };

  const { data } = await axios.post(
    SEND_URL,
    { data: payload },
    {
      headers: {
        'X-OTP-Key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    }
  );

  return data;
}

export async function verifySmsOtpWithGetOtp({ code }) {
  const apiKey = process.env.GETOTP_API_KEY;

  if (!apiKey) {
    throw new Error('GETOTP_API_KEY is not set');
  }

  // Only send code; phone is optional in their docs
  const url = `${VERIFY_URL}?code=${encodeURIComponent(code)}`;

  const { data } = await axios.get(url, {
    headers: {
      'X-OTP-Key': apiKey,
      Accept: 'application/json',
    },
    timeout: 10000,
  });

  // If data is empty, code is invalid (per docs)
  const entries = data?.data || [];
  return entries.length > 0 ? entries[0] : null;
}
