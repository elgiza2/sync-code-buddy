import "@/lib/buffer-polyfill";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

// Keep the route tree behind an async module boundary. Several route modules
// import TON packages that read the global Buffer while their modules are
// being evaluated. A normal static import is evaluated before this module's
// body, regardless of import order, so the Buffer shim would run too late.
const { routeTree } = await import("./routeTree.gen");

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
