import { getAllSubmission } from "@/lib/api/submissions";
import { queryOptions } from "@tanstack/react-query";

export function allSubmissionOptions() {
  return queryOptions({
    queryKey: ["allSubmission"],
    queryFn: () => getAllSubmission(),
  });
}
