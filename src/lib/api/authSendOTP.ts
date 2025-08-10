import { SERVER_API } from "../contants";

export type OTPRequest = {
  mobile: string;
  otp: string;
};

export type UserData = {
  token: string;
};

export type OTPVerifyResponse = {
  message: string;
  data: UserData;
};

export const authSendOTP = async <TResponse = OTPVerifyResponse>(
  data: OTPRequest
): Promise<TResponse> => {
  const response = await fetch(`${SERVER_API}/api/auth/verify-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};
