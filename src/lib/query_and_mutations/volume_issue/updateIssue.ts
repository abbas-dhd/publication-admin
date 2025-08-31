import {
  type IssueResponse,
  type Issue,
  updateIssue,
} from "@/lib/api/volume_and_issue";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useUpdateIssue = <
  TResponse = IssueResponse,
  TError = Error,
  TVariables extends Issue = Issue,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    ...options,
    mutationFn: (data: TVariables) => updateIssue<TResponse>(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allIssues"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
