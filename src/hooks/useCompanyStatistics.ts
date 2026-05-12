import { useQuery } from "@tanstack/react-query";
import { StatisticsService } from "@/services/statistics.service";

export function useCompanyStatistics() {
  const { data: statistics, isLoading, isError } = useQuery({
    queryKey: ["statistics", "company"],
    queryFn: StatisticsService.getCompanyStatistics,
  });

  return { statistics, isLoading, isError };
}
