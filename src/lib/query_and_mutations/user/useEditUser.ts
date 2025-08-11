import {
  type UserDataWithId,
  type NewUserDataRespnse as NewUserDataResponse,
  editUser,
} from "@/lib/api/users";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const useEditUser = <
  TResponse = NewUserDataResponse,
  TError = Error,
  TVariables extends UserDataWithId = UserDataWithId,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => editUser<TResponse>(data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [
          ["allUsers"],
          ["user", variables.user_id, variables.role_name],
        ],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
};
