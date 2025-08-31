import { AppSidebar, type SidebarLinks } from "@/components/ui/app-sidebar";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useCrumbs } from "@/hooks/useCrumbs";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  FileCheck2,
  FileDown,
  Home,
  PenTool,
  Slash,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { auth } = context;

    if (
      auth &&
      auth.isAuthenticated() &&
      auth.getTokenPayload()?.role_name !== "author"
    ) {
      console.log("Looks good");
    } else {
      console.log("User not authenticated");
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const sidebar = useSidebar();

  const crumbs = useCrumbs();
  // console.log(crumbs);

  return (
    <>
      <AppSidebar links={items} />
      <div className="flex flex-col h-full w-full overflow-auto">
        <div className="py-[18px] px-4 text-sm/[20px] font-semibold  text-[#717680] border-[#E9EAEB] border-b flex items-center gap-1">
          {!sidebar.open && <SidebarTrigger className="h-[24px] w-[24px]" />}
          {crumbs?.map((item, index) => (
            <>
              <Link to={item.fullPath}>{item?.loaderData?.crumb}</Link>
              {crumbs.length - 1 !== index && (
                <Slash className="w-4 h-4 rotate-[-10deg]" />
              )}
            </>
          ))}
        </div>
        <main
          className="p-6"
          style={{
            width: "100%",
            height: "100%",
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
      to: "/",
    },
    icon: Home,
  },
  {
    title: "My Team",
    url: { to: "/my-team" },
    icon: Users,
  },
  {
    title: "Submissions",
    url: { to: "/submissions" },
    icon: FileDown,
  },
  {
    title: "Prospective Authors",
    url: { to: "/prospective-authors" },
    icon: PenTool,
  },
  {
    title: "Published Manuscripts",
    url: { to: "/published-manuscripts" },
    icon: FileCheck2,
  },
];
