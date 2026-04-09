import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type LetterRecord, LetterType } from "../backend";
import { useActor } from "./useActor";

export { LetterType };
export type { LetterRecord };

export function useGetAllLetters() {
  const { actor, isFetching } = useActor();
  return useQuery<LetterRecord[]>({
    queryKey: ["letters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLetters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      customerName: string;
      loanAccountNumber: string;
      loanAmount: string;
      date: string;
      letterType: LetterType;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createLetter(
        vars.customerName,
        vars.loanAccountNumber,
        vars.loanAmount,
        vars.date,
        vars.letterType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}

export function useDeleteLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteLetter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}
