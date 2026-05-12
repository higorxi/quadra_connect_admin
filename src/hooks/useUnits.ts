import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UnitsService } from "@/services/units.service";
import type { CreateUnitDTO } from "@/schemas/services/units.dto.schema";

export function useUnits() {
  const queryClient = useQueryClient();

  const { data: units, isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: UnitsService.getMyUnits,
  });

  const createMutation = useMutation({
    mutationFn: UnitsService.createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: UnitsService.deleteUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateUnitDTO }) => 
      UnitsService.updateUnit(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  return { units, isLoading, createMutation, deleteMutation, updateMutation };
}
