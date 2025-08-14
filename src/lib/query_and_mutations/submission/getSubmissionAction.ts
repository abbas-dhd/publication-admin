import { getActions } from "@/lib/api/actions";

import { queryOptions } from "@tanstack/react-query";

export function getSubmissionActionOptions(data: { submission_id: string }) {
  return queryOptions({
    queryKey: ["submission-actions", data.submission_id],
    queryFn: () => getActions(data.submission_id),
  });
}
