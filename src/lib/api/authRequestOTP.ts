import { SERVER_API } from "../contants";

export type AuthRequest = {
  mobile: string;
};

export type AuthResponse = {
  message: string;
};

export const authRequestOTP = async <TResponse = AuthResponse>(
  data: AuthRequest
): Promise<TResponse> => {
  const response = await fetch(`${SERVER_API}/api/auth/send-otp/`, {
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
