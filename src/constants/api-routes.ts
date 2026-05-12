export const apiRoutes = {
  auth: {
    login: () => '/auth/login',
    logout: () => '/auth/logout',
    me: () => '/auth/me',
  },
  units: {
    list: () => '/units',
    create: () => '/units',
    delete: (id: string | number) => `/units/${id}`,
    update: (id: string | number) => `/units/${id}`,
    get: (id: string | number) => `/units/${id}`,
  },
  categories: {
    list: () => '/categories',
    get: (id: string | number) => `/categories/${id}`,
  },
  companies: {
    me: () => '/companies/me',
  },
  reservations: {
    company: () => '/reservations/company',
    get: (id: string | number) => `/reservations/${id}`,
    update: (id: string | number) => `/reservations/${id}`,
  },
  reviews: {
    byReservation: (reservationId: string | number) => `/reviews/reservation/${reservationId}`,
  },
  statistics: {
    company: () => '/statistics/company',
  },
  transactions: {
    get: (id: string | number) => `/transactions/${id}`,
    updateStatus: (id: string | number) => `/transactions/${id}/status`,
  },
} as const;
