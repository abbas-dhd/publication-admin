import { getUser } from "@/lib/api/users";
import { queryOptions } from "@tanstack/react-query";

export function userQueryOptions(data: { id: string; role: string }) {
  return queryOptions({
    queryKey: ["user", data.id, data.role],
    queryFn: () => getUser(data),
  });
}
