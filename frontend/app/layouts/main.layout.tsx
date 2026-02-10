import { Provider } from "react-redux";
import {
  Outlet,
  useLoaderData,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "~/store/store";
import { persistor } from "~/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { authServiceFromServer } from "~/services/auth/auth.server";
import { withCookieForwarding } from "~/common/helpers/loader.helper";
import type { LoginResponse } from "~/services/auth/dto/login/login.response";
import UserProvider from "~/components/provider/user.provider";
import { useEffect } from "react";

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
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle OAuth callback redirect with oauth_success param
  // After BE sets auth cookies and redirects, we need to refresh once
  // so the browser sends cookies on a same-site request to load user info
  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth_success");

    if (oauthSuccess === "true") {
      // Remove the param to prevent refresh loop
      searchParams.delete("oauth_success");
      const newSearch = searchParams.toString();
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : "");

      // Replace history to clean URL, then reload
      window.history.replaceState({}, "", newUrl);
      window.location.reload();
    }
  }, [searchParams]);

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
