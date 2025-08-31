import { type IssueResponse, deleteIssue } from "@/lib/api/volume_and_issue";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useDeleteIssue = <
  TResponse = IssueResponse,
  TError = Error,
  TVariables extends { issue_id: string } = { issue_id: string },
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    ...options,
    mutationFn: (data: TVariables) => deleteIssue<TResponse>(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allIssues"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
