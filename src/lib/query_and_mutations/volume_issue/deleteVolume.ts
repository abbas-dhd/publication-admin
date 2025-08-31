import { deleteVolume, type VolumeResponse } from "@/lib/api/volume_and_issue";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useDeleteVolume = <
  TResponse = VolumeResponse,
  TError = Error,
  TVariables extends { volume_id: string } = {
    volume_id: string;
  },
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();
  return useMutation<TResponse, TError, TVariables>({
    ...options,
    mutationFn: (data: TVariables) => deleteVolume<TResponse>(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allVolumes"],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
