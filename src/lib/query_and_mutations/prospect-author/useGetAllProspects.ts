import { getAllProspects } from "@/lib/api/prospect-author";
import { queryOptions } from "@tanstack/react-query";

export function allProspectsQueryOptions() {
  return queryOptions({
    queryKey: ["allProspects"],
    queryFn: () => getAllProspects(),
  });
}
