import { getAllVolumes } from "@/lib/api/volume_and_issue";
import { queryOptions } from "@tanstack/react-query";

export function allVolumeQueryOptions() {
  return queryOptions({
    queryKey: ["allVolumes"],
    queryFn: () => getAllVolumes(),
  });
}
