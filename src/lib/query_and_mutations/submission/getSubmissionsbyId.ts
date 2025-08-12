import { getSubmissionById } from "@/lib/api/submissions";
import { queryOptions } from "@tanstack/react-query";

export function getSubmissionByIdOptions(data: {
  id: string;
  roleName: string;
}) {
  return queryOptions({
    queryKey: ["allSubmission"],
    queryFn: () => getSubmissionById(data),
  });
}
