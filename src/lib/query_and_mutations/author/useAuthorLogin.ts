import {
  authorLogin,
  type AuthorLoginRequest,
  type AuthorLoginResponse,
} from "@/lib/api/author/auth";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useAuthorLogin = <
  TResponse = AuthorLoginResponse,
  TError = Error,
  TVariables extends AuthorLoginRequest = AuthorLoginRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => authorLogin<TResponse>(data),
    ...options,
  });
};
