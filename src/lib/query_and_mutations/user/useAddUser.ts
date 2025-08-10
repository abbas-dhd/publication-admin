import {
  addUser,
  type UserData,
  type NewUserDataRespnse as NewUserDataResponse,
} from "@/lib/api/users";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useAddUser = <
  TResponse = NewUserDataResponse,
  TError = Error,
  TVariables extends UserData = UserData,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => addUser<TResponse>(data),
    ...options,
  });
};
