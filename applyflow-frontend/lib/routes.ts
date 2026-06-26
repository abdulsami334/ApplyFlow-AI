export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  resumes: "/resumes",
  applications: "/applications",
  applicationBoard: "/applications/board",
  newApplication: "/applications/new",
  applicationDetail: (id: string) => `/applications/${id}`,
  editApplication: (id: string) => `/applications/${id}/edit`,
};
