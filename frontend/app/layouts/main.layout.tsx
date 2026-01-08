import { Provider } from "react-redux";
import { Outlet } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "~/store/store";
import { persistor } from "~/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-col min-h-screen">
            <Outlet />
            {/* <Toaster /> */}
          </div>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default MainLayout;
