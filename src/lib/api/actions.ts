import { SERVER_API } from "../contants";

type ActionsResponse = {
  data: unknown;
  message: string;
};

export const getActions = async <TResponse = ActionsResponse>(
  submission_id: string
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/submission-status/get`);
  url.searchParams.append("submission_id", submission_id);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};
