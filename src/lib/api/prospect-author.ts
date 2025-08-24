import { SERVER_API } from "../contants";
import type { UserFile } from "./users";

export type ProspectAuthorRequest = {
  name: string;
  email: string;
  mobile: string;
  name_of_college?: string;
  name_of_university?: string;
};

export type ProspectAuthor = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  name_of_college?: string | null;
  name_of_university?: string | null;
  should_notify: boolean;
  created_at: number;
  updated_at: number;
};

export type ProspectAuthorResponse = {
  data: {
    id: 1;
  };
  message: string;
};

export const addProspect = async <TResponse = ProspectAuthorResponse>(
  data: ProspectAuthorRequest
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/prospect-author/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};

export const getAllProspects = async <
  TResponse = {
    data: ProspectAuthor[];
    message: string;
  },
>(): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/prospect-author/get/all/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};

export type UpdateProspectRequest = Omit<
  ProspectAuthor,
  "created_at" | "updated_at"
>;

export const updateProspect = async <TResponse = ProspectAuthorResponse>(
  data: UpdateProspectRequest
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/prospect-author/update/`);
  url.searchParams.append("id", data.id.toString());

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};

export const deleteProspect = async <TResponse = ProspectAuthorResponse>(data: {
  id: number;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/prospect-author/delete/`);
  url.searchParams.append("id", data.id.toString());

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};

export const callForPaper = async <TResponse = ProspectAuthorResponse>(data: {
  title: string;
  description: string;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/call-for-paper/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};

export const bulkUpload = async <TResponse = ProspectAuthorResponse>(
  data: UserFile
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");
  const url = new URL(`${SERVER_API}/api/prospect-author/create/`);
  url.searchParams.append("type", "bulk");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json();
};
