export const onRequest: PagesFunction<{ WEBDAV_USERNAME: string; WEBDAV_PASSWORD: string; WEBDAV_PUBLIC_READ?: string; }> = async ({ request, env, next }) => {
  // Public access only for files under /f/
  const pathname = new URL(request.url).pathname;
  if (pathname === "/f" || pathname.startsWith("/f/")) {
    return next();
  }

  // Require credentials for everything else
  if (!env.WEBDAV_USERNAME || !env.WEBDAV_PASSWORD) {
    return new Response("WebDAV protocol is not enabled", { status: 403 });
  }

  const auth = request.headers.get("Authorization");
  const authHeader = { "WWW-Authenticate": `Basic realm="WebDAV"` };
  if (!auth || !auth.startsWith("Basic ")) {
    return new Response("Unauthorized", { status: 401, headers: authHeader });
  }

  // UTF-8 safe base64 for expected credentials
  const creds = `${env.WEBDAV_USERNAME}:${env.WEBDAV_PASSWORD}`;
  const expectedAuth = `Basic ${btoa(unescape(encodeURIComponent(creds)))}`;

  if (auth !== expectedAuth) {
    return new Response("Unauthorized", { status: 401, headers: authHeader });
  }

  return next();
};
