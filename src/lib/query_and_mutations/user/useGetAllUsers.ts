import { getAllUsers } from "@/lib/api/users";
import { queryOptions } from "@tanstack/react-query";

export function allUsersQueryOptions() {
  return queryOptions({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(),
  });
}
