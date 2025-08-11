import { SERVER_API } from "../contants";

// export type UserFile =
//   | { type: "url"; value: string }
//   | { type: "blob"; value: Blob };

export type UserFile = {
  name: string;
  url: string;
};

export type UserData = {
  role_name: string;
  name: string;
  mobile: string;
  alternate_mobile?: string;
  email: string;
  postal_address: string;
  education_qualification: string;
  preferred_subjects_for_review: string[];
  // Institution details
  institution_name: string;
  institution_mobile: string;
  institution_alternate_mobile?: string;
  institution_email: string;
  institution_postal_address: string;
  // Referr details
  referee_name: string;
  referee_mobile: string;
  referee_alternate_mobile?: string;
  referee_email: string;
  referee_postal_address: string;
  profile_photo: UserFile;
  education_certificate: UserFile;
};
export type NewUserDataRespnse = {
  data: unknown;
  message: string;
};

export const addUser = async <TResponse = NewUserDataRespnse>(
  data: UserData
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/myteam/create/`, {
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

type AllUsersData = {
  message: string;
  data: {
    editors: UserDataWithId[];
    review_coordinators: UserDataWithId[];
    reviewers: UserDataWithId[];
  };
};

export const getAllUsers = async <
  TResponse = AllUsersData,
>(): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const response = await fetch(`${SERVER_API}/api/myteam/list-all/`, {
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

export type UserDataWithId = UserData & { user_id: string };

export const editUser = async <TResponse = NewUserDataRespnse>(
  data: UserDataWithId
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/myteam/update/`);
  url.searchParams.append("user_id", data.user_id);
  url.searchParams.append("role_name", data.role_name);

  const response = await fetch(url.toString(), {
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

export const getUser = async <TResponse = UserDataWithId>({
  id,
  role,
}: {
  id: string;
  role: string;
}): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/myteam/get/`);
  url.searchParams.append("user_id", id);
  url.searchParams.append("role_name", role);

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
  const data = await response.json();

  return data.data;
};
