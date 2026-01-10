/**
 * Helper functions for handling cookies in SSR context
 */

/**
 * Extract cookie from request headers
 * Works with both 'cookie' and 'Cookie' headers
 */
export function getCookieFromRequest(request: Request): string | null {
  const cookie = request.headers.get("cookie") || request.headers.get("Cookie");
  return cookie;
}

/**
 * Parse set-cookie headers from response
 * Combines multiple set-cookie headers into a single cookie string
 */
export function parseCookiesFromResponse(
  setCookieHeaders: string[] | string | undefined,
): string | null {
  if (!setCookieHeaders) return null;

  if (Array.isArray(setCookieHeaders)) {
    return setCookieHeaders
      .map((cookie) => cookie.split(";")[0]) // Get only the key=value part
      .join("; ");
  }

  return setCookieHeaders.split(";")[0];
}

/**
 * Merge cookies from multiple sources
 * Newer cookies override older ones with the same name
 */
export function mergeCookies(
  ...cookieStrings: (string | null | undefined)[]
): string {
  const cookieMap = new Map<string, string>();

  cookieStrings.forEach((cookieString) => {
    if (!cookieString) return;

    // Split by semicolon and process each cookie
    cookieString.split(";").forEach((cookie) => {
      const trimmed = cookie.trim();
      if (!trimmed) return;

      const [name, ...valueParts] = trimmed.split("=");
      if (name && valueParts.length > 0) {
        cookieMap.set(name.trim(), valueParts.join("=").trim());
      }
    });
  });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}
