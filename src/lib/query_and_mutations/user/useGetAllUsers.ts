import { getAllUsers } from "@/lib/api/users";
import { queryOptions } from "@tanstack/react-query";

export function allUsersQueryOptions({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  return queryOptions({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
    enabled,
  });
}
