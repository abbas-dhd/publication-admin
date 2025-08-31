import { AppSidebar, type SidebarLinks } from "@/components/ui/app-sidebar";
import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_author")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { auth } = context;

    if (
      auth &&
      auth.isAuthenticated() &&
      auth.getTokenPayload()?.role_name === "author"
    ) {
      console.log("Looks good");
    } else {
      console.log("User not authenticated");
      throw notFound();
    }
  },
});

function RouteComponent() {
  // TODO: Add check to only show this if author is logged in

  return (
    <>
      <AppSidebar links={items} />
      <div className="flex flex-col h-full w-full overflow-auto">
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

const items: SidebarLinks[] = [
  {
    title: "Home",
    url: {
      to: "/author",
    },
  },
];
