import { Provider } from "react-redux";
import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "~/store/store";
import { persistor } from "~/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { authServiceFromServer } from "~/services/auth/auth.server";
import { withCookieForwarding } from "~/common/helpers/loader.helper";
import type { LoginResponse } from "~/services/auth/dto/login/login.response";
import UserProvider from "~/components/provider/user.provider";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const res = await authServiceFromServer.getProfile(request);

    if (res.success && res.data) {
      // Automatically forward any new cookies (from token refresh) to browser
      return withCookieForwarding(res.data);
    } else {
      return withCookieForwarding(null);
    }
  } catch (error) {
    return null;
  }
};

const queryClient = new QueryClient();

const MainLayout = () => {
  const user = useLoaderData<LoginResponse | null>();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider user={user}>
          <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen">
              <Outlet />
              <Toaster position="top-right" />
            </div>
          </QueryClientProvider>
        </UserProvider>
      </PersistGate>
    </Provider>
  );
};

export default MainLayout;
