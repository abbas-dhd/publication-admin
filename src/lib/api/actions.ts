import { SERVER_API } from "../contants";
import type { UserFile } from "./users";

export type ActionsResponse<T> = {
  data: T;
  message: string;
};

export const getActions = async <
  TResponse = ActionsResponse<{
    actions: {
      name: string;
      label: string;
    }[];
  }>,
>(
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
export type RevertTypes =
  | "first_revert"
  | "second_revert"
  | "third_revert"
  | "fourth_revert";

export type ResubmitTypes =
  | "first_resubmit"
  | "second_resubmit"
  | "third_resubmit"
  | "fourth_resubmit";

export type ActionPayload =
  | {
      submission_id: string;
      action_name: "reject";
      details: {
        comments: string;
      };
    }
  | {
      submission_id: string;
      action_name: RevertTypes;
      details: {
        comments: string;
        checklist: string[];
      };
    }
  | {
      submission_id: string;
      action_name: "assign_reviewer";
      details: {
        reviewers: number[];
        reviewer_deadline: {
          [key: number]: number;
        };
      };
    }
  | {
      submission_id: string;
      action_name: "reassign_reviewer";
      details: {
        reviewers: number[];
        reviewer_id_to_delete: number[];
        reviewer_deadline: {
          [key: number]: number;
        };
      };
    }
  | {
      submission_id: string;
      action_name: "partial_ready_to_publish";
      details: {
        score: number;
        comments: string;
      };
    }
  | {
      submission_id: string;
      action_name: "assign_editor";
      details: {
        editors: number[];
      };
    }
  | {
      submission_id: string;
      action_name: "final_ready_to_publish";
      // details: undefined;
    }
  | {
      submission_id: string;
      action_name: "payment_pending" | "payment_done";
      details: {
        amount: number;
        currency: "INR";
        comments: string;
      };
    }
  | {
      submission_id: string;
      action_name: "publish";
      details: {
        volume_id: number;
        issue_id: number;
      };
    }
  | {
      submission_id: string;
      action_name: ResubmitTypes | "overwrite";
      details: {
        file: UserFile;
      };
    };

// Reject Submisison
export const callAction = async <
  TResponse = ActionsResponse<{
    data: undefined;
  }>,
>(
  data: ActionPayload
): Promise<TResponse> => {
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/submission-status/create/`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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

export type CheckListItem = {
  item: string;
  checked: boolean;
};

export const getChecklistItems = async <
  TResponse = ActionsResponse<CheckListItem[]>,
>(): Promise<TResponse> => {
  // submission_id: string
  const { token } = JSON.parse(localStorage.getItem("authUser") || "");

  const url = new URL(`${SERVER_API}/api/checklist/get-checklist`);
  // url.searchParams.append("submission_id", submission_id);

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
