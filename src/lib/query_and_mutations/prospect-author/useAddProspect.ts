import type { AuthorLoginResponse } from "@/lib/api/author/auth";
import {
  addProspect,
  type ProspectAuthorRequest,
} from "@/lib/api/prospect-author";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export const useAddProspect = <
  TResponse = AuthorLoginResponse,
  TError = Error,
  TVariables extends ProspectAuthorRequest = ProspectAuthorRequest,
>(
  options?: UseMutationOptions<TResponse, TError, TVariables>
) => {
  return useMutation<TResponse, TError, TVariables>({
    mutationFn: (data: TVariables) => addProspect<TResponse>(data),
    ...options,
  });
};
