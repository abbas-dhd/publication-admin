import { callAction, type ActionPayload } from "@/lib/api/actions";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useCallAction = <
  TResponse,
  TError = Error,
  TVariables extends ActionPayload = ActionPayload,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => callAction<TResponse>(data),
    ...options,
  });
};
