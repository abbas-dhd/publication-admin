import { callAction, type ActionPayload } from "@/lib/api/actions";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useCallAction = <
  TResponse,
  TError = Error,
  TVariables extends ActionPayload = ActionPayload,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => callAction<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", variables.submission_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["submission-actions", variables.submission_id],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
