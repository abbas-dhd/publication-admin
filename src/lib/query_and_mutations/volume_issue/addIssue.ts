import {
  addIssue,
  type IssueRequest,
  type IssueResponse,
} from "@/lib/api/volume_and_issue";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useAddIssue = <
  TResponse = IssueResponse,
  TError = Error,
  TVariables extends IssueRequest = IssueRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => addIssue<TResponse>(data),
    ...options,
  });
};
