import { SERVER_API } from "@/lib/contants";

export type AuthorLoginRequest = {
  reference_number: string;
  password: string;
};

export type UserData = {
  token: string;
};

export type AuthorLoginResponse = {
  message: string;
  data: UserData;
};

export const authorLogin = async <TResponse = AuthorLoginResponse>(
  data: AuthorLoginRequest
): Promise<TResponse> => {
  const response = await fetch(`${SERVER_API}/api/auth/login/`, {
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
