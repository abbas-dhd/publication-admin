import { SERVER_API } from "../contants";
import type { UserFile } from "./users";

export type SubmissionData = {
  submission: Submission;
  manuscripts: Manuscript[];
  author: Author;
  coauthors: unknown[]; // Change this if you know coauthor structure
};

type Submission = {
  user_id: number;
  submission_id: string;
  reference_number: string;
  title: string;
  category: string;
  status: {
    name: string;
    label: string;
    text: string;
    background: string;
  };
  created_at: number;
  updated_at: number;
};

type Manuscript = {
  id: number;
  file: UserFile;
  comments: string | null;
  // checklist: string | null;
  submission_id: number;
  created_at: number;
  updated_at: number;
};

type Author = {
  id: number;
  mobile: string;
  name: string;
  email: string;
  college_name: string;
  linkedin_url: string;
  submission_id: number;
  created_at: number;
  updated_at: number;
};

export const getAllSubmission = async <
  TResponse = { data: SubmissionData[]; message: string },
>(): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/submission/all/`, {
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

export const getSubmissionById = async <
  TResponse = { data: SubmissionData; message: string },
>(data: {
  submission_id: string;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const { submission_id: id } = data;

  const url = new URL(`${SERVER_API}/api/submission/get/`);
  url.searchParams.append("submission_id", id);
  // url.searchParams.append("role_name", roleName);

  const response = await fetch(url.toString(), {
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
