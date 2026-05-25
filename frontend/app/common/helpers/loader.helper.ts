import { data as routerData } from "react-router";
import { getNewCookiesFromResponse } from "~/common/configs/axios.server";

/**
 * Helper function to return loader data with automatic cookie forwarding
 * Use this instead of direct return in loaders to ensure cookies are forwarded to browser
 *
 * @param data - The data to return from loader
 * @param additionalHeaders - Optional additional headers to include
 * @returns Response with Set-Cookie headers if new cookies are available
 *
 * @example
 * export const loader = async ({ request }: LoaderFunctionArgs) => {
 *   const user = await authServiceFromServer.getProfile(request);
 *   return withCookieForwarding(user);
 * }
 */
export function withCookieForwarding<T>(
  data: T,
  additionalHeaders?: HeadersInit,
): Response | T {
  // Check if there are new cookies from token refresh
  const newCookies = getNewCookiesFromResponse();

  if (newCookies && newCookies.length > 0) {
    console.log(
      "[loader-helper] 🍪 Forwarding cookies to browser:",
      newCookies.length,
    );

    // Merge additional headers with Set-Cookie
    const headers = new Headers(additionalHeaders);
    newCookies.forEach((cookie) => {
      headers.append("Set-Cookie", cookie);
    });

    return new Response(JSON.stringify(data), { headers });
  }

  // No new cookies, return data as-is
  return data;
}

/**
 * Helper to check if cookies were forwarded in this request
 * Useful for debugging
 */
export function hasCookiesToForward(): boolean {
  const cookies = getNewCookiesFromResponse();
  return cookies !== null && cookies.length > 0;
}
