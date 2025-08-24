import {
  updateProspect,
  type ProspectAuthorResponse,
  type UpdateProspectRequest,
} from "@/lib/api/prospect-author";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useUpdateProspect = <
  TResponse = ProspectAuthorResponse,
  TError = Error,
  TVariables extends UpdateProspectRequest = UpdateProspectRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => updateProspect<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: ["allProspects"] });
    },
  });
};
