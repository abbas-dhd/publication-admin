import {
  deleteProspect,
  type ProspectAuthorResponse,
} from "@/lib/api/prospect-author";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useDeleteProspect = <
  TResponse = ProspectAuthorResponse,
  TError = Error,
  TVariables extends { id: number } = { id: number },
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => deleteProspect<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: ["allProspects"] });
    },
  });
};
