import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  authRequestOTP,
  type AuthRequest,
  type AuthResponse,
} from "../api/authRequestOTP";

export const useAuthOTPRequest = <
  TResponse = AuthResponse,
  TError = Error,
  TVariables extends AuthRequest = AuthRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => authRequestOTP<TResponse>(data),
    ...options,
  });
};
