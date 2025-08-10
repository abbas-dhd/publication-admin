import { AppSidebar } from "@/components/ui/app-sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    console.log(context, "hahaha");

    const { auth } = context;
    if (auth && auth.isAuthenticated()) {
      console.log("Looks good");
    } else {
      console.log("something is wrong");
    }

    // TODO: FIX AUTH CONTEXT ON BEFORE LOAD
  },
});

function RouteComponent() {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext.user === null) {
      navigate({
        to: "/login",
      });
    }
  }, [authContext.user, navigate]);

  return (
    <>
      <AppSidebar />
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
      </div>
    </>
  );
}
