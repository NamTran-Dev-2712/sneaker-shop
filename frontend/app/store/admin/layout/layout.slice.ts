import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./layout.state";

export const AdminLayoutSlice = createSlice({
  name: "adminLayout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleDarkMode,
  setDarkMode,
} = AdminLayoutSlice.actions;
export default AdminLayoutSlice.reducer;
