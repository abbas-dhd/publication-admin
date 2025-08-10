import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import {
  authSendOTP,
  type OTPRequest,
  type OTPVerifyResponse,
} from "../api/authSendOTP";

export const useAuthSendOTP = <
  TResponse = OTPVerifyResponse,
  TError = Error,
  TVariables extends OTPRequest = OTPRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => authSendOTP<TResponse>(data),
    ...options,
  });
};
