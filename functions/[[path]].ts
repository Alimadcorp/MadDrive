export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const skipAuth =
    env.WEBDAV_PUBLIC_READ === "1" &&
    ["GET", "HEAD", "PROPFIND"].includes(request.method);

  if (!skipAuth) {
    if (!env.WEBDAV_USERNAME || !env.WEBDAV_PASSWORD) {
      return new Response("WebDAV protocol is not enabled", { status: 403 });
    }

    const auth = request.headers.get("Authorization");
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": `Basic realm="WebDAV"` },
      });
    }

    const expectedAuth = `Basic ${btoa(
      `${env.WEBDAV_USERNAME}:${env.WEBDAV_PASSWORD}`
    )}`;

    if (auth !== expectedAuth) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  return next();
};
