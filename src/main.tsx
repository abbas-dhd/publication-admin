import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  type RouterProps,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: null,
  },
  defaultNotFoundComponent: () => {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p>404 Not found!</p>
      </div>
    );
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* <RouterProvider router={router} /> */}
          <AuthRouter router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
export function AuthRouter({ router }: RouterProps) {
  const authContext = useAuthContext();
  return <RouterProvider router={router} context={{ auth: authContext }} />;
}
