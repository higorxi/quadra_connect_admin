import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ReportsService,
  type ReportModule,
  type ReportStatus,
} from "@/services/reports.service";

export function useReports(pageSize = 10) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [module, setModule] = useState<ReportModule | undefined>();
  const [status, setStatus] = useState<ReportStatus | undefined>();

  const query = useQuery({
    queryKey: ["reports", { page, pageSize, module, status }],
    queryFn: () => ReportsService.listReports({ page, pageSize, module, status }),
    refetchInterval: (query) =>
      query.state.data?.data.some(
        (report) => report.status === "PENDING" || report.status === "PROCESSING"
      )
        ? 3000
        : false,
    refetchIntervalInBackground: true,
  });

  const createMutation = useMutation({
    mutationFn: ReportsService.createReport,
    onSuccess: () => {
      setPage(1);
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  return {
    ...query,
    page,
    setPage,
    module,
    setModule,
    status,
    setStatus,
    createMutation,
  };
}
