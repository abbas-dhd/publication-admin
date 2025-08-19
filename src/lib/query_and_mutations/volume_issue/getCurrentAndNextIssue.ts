import { getCurrentAndNextIssue } from "@/lib/api/volume_and_issue";
import { queryOptions } from "@tanstack/react-query";

export function currentAndNextIssueQueryOption() {
  return queryOptions({
    queryKey: ["current_issue", "next_issue"],
    queryFn: () => getCurrentAndNextIssue(),
  });
}
