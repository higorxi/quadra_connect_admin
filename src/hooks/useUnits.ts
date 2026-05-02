import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UnitsService } from "@/services/units.service";

export function useUnits() {
  const queryClient = useQueryClient();

  const { data: units, isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: UnitsService.getUnits,
  });

  const createMutation = useMutation({
    mutationFn: UnitsService.createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: UnitsService.deleteUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  return { units, isLoading, createMutation, deleteMutation };
}