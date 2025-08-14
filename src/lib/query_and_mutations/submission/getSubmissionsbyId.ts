import { getSubmissionById } from "@/lib/api/submissions";
import { queryOptions } from "@tanstack/react-query";

export function getSubmissionByIdOptions(data: { submission_id: string }) {
  return queryOptions({
    queryKey: ["submission", data.submission_id],
    queryFn: () => getSubmissionById(data),
  });
}
