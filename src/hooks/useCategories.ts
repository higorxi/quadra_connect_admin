import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@/services/categories.service";
import { apiRoutes } from "@/constants/api-routes";

export function useCategories(categoryId?: string) {
  const categoriesQuery = useQuery({
    queryKey: [apiRoutes.categories.list()],
    queryFn: CategoriesService.getCategories,
  });

  const categoryQuery = useQuery({
    queryKey: [apiRoutes.categories.get(categoryId!)],
    queryFn: () => CategoriesService.getCategory(categoryId!),
    enabled: !!categoryId,
  });

  return { 
    categories: categoriesQuery.data, 
    isLoading: categoriesQuery.isLoading,
    category: categoryQuery.data,
  };
}