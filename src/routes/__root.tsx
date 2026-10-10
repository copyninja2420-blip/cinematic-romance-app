import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Our Love Story" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#0d0107] text-[#fff0f5] antialiased min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0107] px-4 text-center text-[#fff0f5]">
      <div className="max-w-md space-y-4">
        <h1 className="text-7xl font-bold tracking-tight text-rose-500">404</h1>
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="text-sm opacity-70">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-rose-500"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RootComponent;
