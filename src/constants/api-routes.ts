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
} as const;