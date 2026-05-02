import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UnitsService } from "@/services/units.service";
import { apiRoutes } from "@/constants/api-routes";
import type { CreateUnitDTO } from "@/schemas/services/units.dto.schema";

export function useUnits() {
  const queryClient = useQueryClient();

  const { data: units, isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: UnitsService.getUnits,
  });

  const createMutation = useMutation({
    mutationFn: UnitsService.createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiRoutes.units.list()] }),
  });

  const deleteMutation = useMutation({
    mutationFn: UnitsService.deleteUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiRoutes.units.list()] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateUnitDTO }) => 
      UnitsService.updateUnit(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
  });

  return { units, isLoading, createMutation, deleteMutation, updateMutation };
}