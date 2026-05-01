export const apiRoutes: Record<string, Record<string, string>> = {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      me: '/auth/me',
    },
    units: {
      list: '/units',
      create: '/units',
    },
};