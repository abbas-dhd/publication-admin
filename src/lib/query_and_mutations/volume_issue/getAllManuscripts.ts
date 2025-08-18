import { getAllManuscripts } from "@/lib/api/volume_and_issue";
import { queryOptions } from "@tanstack/react-query";

export function allManuscriptQueryOptions(data: { issue_id: string }) {
  return queryOptions({
    queryKey: ["allManuscripts"],
    queryFn: () => getAllManuscripts(data),
  });
}
