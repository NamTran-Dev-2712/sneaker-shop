export interface AdminLayoutState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
}

export const initialState: AdminLayoutState = {
  sidebarCollapsed: false,
  darkMode: false,
};
