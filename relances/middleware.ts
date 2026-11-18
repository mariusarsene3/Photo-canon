import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rafraîchit la session Supabase et protège les pages : non connecté → /login.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Variables absentes au moment du build : on l'explique au lieu de planter.
    const missing = [!url && "NEXT_PUBLIC_SUPABASE_URL", !key && "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(Boolean);
    return new NextResponse(
      `Configuration incomplète : variable(s) manquante(s) ${missing.join(", ")}.\n` +
        "Ajoutez-les dans Vercel > Settings > Environment Variables, puis redéployez (Deployments > ... > Redeploy).",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  let user = null;
  try {
    ({ data: { user } } = await supabase.auth.getUser());
  } catch (e) {
    console.error("Supabase injoignable depuis le middleware :", e);
  }

  const path = request.nextUrl.pathname;
  const isPublic = path === "/" || path === "/cgv" || path.startsWith("/api/stripe/") || path.startsWith("/outils") || path === "/sitemap.xml" || path === "/robots.txt" || path === "/mentions-legales" || path === "/confidentialite" || path.startsWith("/payer/") || path.startsWith("/login") || path.startsWith("/auth") || path.startsWith("/api/cron");
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

export const config = {
  // Les fichiers statiques (modèle CSV, images…) ne passent pas par le middleware.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:csv|png|jpg|jpeg|svg|ico|mp4|webm|woff2)$).*)"],
};
