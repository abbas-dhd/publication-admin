import {
  callForPaper,
  type ProspectAuthorResponse,
} from "@/lib/api/prospect-author";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useCallForPaper = <
  TResponse = ProspectAuthorResponse,
  TError = Error,
  TVariables extends { title: string; description: string } = {
    title: string;
    description: string;
  },
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => callForPaper<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
  });
};
