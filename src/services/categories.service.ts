import { apiRoutes } from "@/constants/api-routes";
import { api } from "./api";

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

const getCategories = async (): Promise<Category[]> => {
    const response = await api.get(apiRoutes.categories.list());
    return response.data;
};

const getCategory = async (id: string): Promise<Category> => {
    const response = await api.get(apiRoutes.categories.get(id));
    return response.data;
};

export const CategoriesService = {
    getCategories,
    getCategory
};