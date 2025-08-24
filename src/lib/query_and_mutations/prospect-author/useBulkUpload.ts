import type { AuthorLoginResponse } from "@/lib/api/author/auth";
import { bulkUpload } from "@/lib/api/prospect-author";
import type { UserFile } from "@/lib/api/users";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useBulkUpload = <
  TResponse = AuthorLoginResponse,
  TError = Error,
  TVariables extends UserFile = UserFile,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => bulkUpload<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["allProspects"] });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
