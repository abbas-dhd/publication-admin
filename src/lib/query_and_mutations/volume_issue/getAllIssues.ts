import { getAllIssues } from "@/lib/api/volume_and_issue";
import { queryOptions } from "@tanstack/react-query";

export function allIssuesQueryOptions(data: { volume_id: string }) {
  return queryOptions({
    queryKey: ["allissues"],
    queryFn: () => getAllIssues(data),
  });
}
