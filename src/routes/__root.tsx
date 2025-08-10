import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { AuthContextType } from "@/context/AuthContext";
import { Toaster } from "sonner";

type RootRouterContext = {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  auth: AuthContextType | null;
};

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: () => (
    <>
      {/*  */}
      <SidebarProvider>
        {/* <AppSidebar />
        <div className="flex flex-col h-full w-full ">
          <div className="py-[18px] px-4 text-sm/[20px] font-semibold  text-[#717680] border-[#E9EAEB] border-b">
            Publications (BREADCRUMBS WIP)
          </div>
          <main
            className="p-6"
            style={{
              // border: "2px solid red",
              width: "100%",
              height: "100%",

              // flexShrink: 0,
            }}
          >
            <Outlet />
          </main>
        </div> */}
        <Outlet />
        <Toaster richColors position="top-right" />
      </SidebarProvider>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
