import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRoutes } from "@/constants/api-routes";
import { CompaniesService } from "@/services/companies.service";

const companyProfileQueryKey = [apiRoutes.companies.me()];

export function useCompanyProfile() {
  const queryClient = useQueryClient();

  const {
    data: company,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: companyProfileQueryKey,
    queryFn: CompaniesService.getMyCompany,
  });

  const updateMutation = useMutation({
    mutationFn: CompaniesService.updateMyCompany,
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData(companyProfileQueryKey, updatedCompany);
      queryClient.invalidateQueries({ queryKey: companyProfileQueryKey });
    },
  });

  return {
    company,
    isLoading,
    isError,
    error,
    updateMutation,
  };
}
