import {
  updateVolume,
  type VolumeRequst,
  type VolumeResponse,
} from "@/lib/api/volume_and_issue";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useUpdateVolume = <
  TResponse = VolumeResponse,
  TError = Error,
  TVariables extends VolumeRequst & { volume_id: string } = VolumeRequst & {
    volume_id: string;
  },
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    ...options,
    mutationFn: (data: TVariables) => updateVolume<TResponse>(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allVolumes"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
