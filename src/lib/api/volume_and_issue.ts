import { SERVER_API } from "../contants";
import type { UserFile } from "./users";

export type VolumeRequst = {
  title: string;
  description: string;
};

export type VolumeResponse = {
  message: string;
  data: {
    volume_id: string;
    title: string;
    description: string;
    created_at: string;
  };
};

export const addVolume = async <TResponse = VolumeResponse>(
  data: VolumeRequst
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/volume/create/`, {
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

export type IssueRequest = {
  title: string; // required
  thumbnail: UserFile; // optional
  start_date: string; // required
  end_date: string; // required
  description: string; // optional
  volume_id: string; // required
};

export type IssueResponse = {
  message: string;
  data: {
    issue_id: string;
    title: string;
    thumbnail: UserFile;
    start_date: string;
    end_date: string;
    description: string;
    volume_id: string;
  };
};

// TODO: create a common type for all issues and volumes
export type Issue = {
  id: string;
  title: string;
  thumbnail: UserFile;
  start_date: string;
  end_date: string;
  description: string;
  volume_id: string;
};

export const addIssue = async <TResponse = IssueResponse>(
  data: IssueRequest
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/issue/create/`, {
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

export type VolumesResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    dsescription: string;
    created_at: string;
  }[];
};

export const getAllVolumes = async <
  TResponse = VolumesResponse,
>(): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/volume/all/`);

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

export type IssuesResponse = {
  message: string;
  data: {
    id: string;
    title: string;
    thumbnail: UserFile;
    start_date: string;
    end_date: string;
    description: string;
    volume_id: string;
  }[];
};

export const getAllIssues = async <TResponse = IssuesResponse>({
  volume_id,
}: {
  volume_id: string;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/issue/all/`);
  url.searchParams.append("volume_id", volume_id);

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

export type Manuscript = {
  id: string;
  submission_id: string;
  reference_number: string;
  type: string;
  title: string;
  file: UserFile;
  authors: {
    name: string;
  };
  coauthors: string[];
  reviewers: {
    name: string;
  }[];
  score: number;
  published_on: string;
  issue_id: string;
};
type ManuscriptResponse = {
  message: string;
  data: Manuscript[];
};

export const getAllManuscripts = async <TResponse = ManuscriptResponse>({
  issue_id,
}: {
  issue_id: string;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/published-manuscript/all/`);
  url.searchParams.append("issue_id", issue_id);

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

export const getCurrentAndNextIssue = async <
  TResponse = {
    message: string;
    data: {
      current_issue: Issue;
      next_issue: Issue;
    };
  },
>(): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/issue/current-and-next/`);

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
