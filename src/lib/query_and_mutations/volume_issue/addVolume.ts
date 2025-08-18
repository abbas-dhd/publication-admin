import {
  addVolume,
  type VolumeRequst,
  type VolumeResponse,
} from "@/lib/api/volume_and_issue";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useAddVolume = <
  TResponse = VolumeResponse,
  TError = Error,
  TVariables extends VolumeRequst = VolumeRequst,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => addVolume<TResponse>(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allVolumes"],
      });
      options?.onSuccess?.(data, variables, context);
    },

    ...options,
  });
};
