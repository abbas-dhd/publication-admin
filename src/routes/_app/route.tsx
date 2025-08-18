import { AppSidebar, type SidebarLinks } from "@/components/ui/app-sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { useCrumbs } from "@/hooks/useCrumbs";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { Home, Slash } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // console.log(context, "hahaha");

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
  const crumbs = useCrumbs();
  // console.log(crumbs);

  return (
    <>
      <AppSidebar links={items} />
      <div className="flex flex-col h-full w-full overflow-auto">
        <div className="py-[18px] px-4 text-sm/[20px] font-semibold  text-[#717680] border-[#E9EAEB] border-b flex items-center gap-1">
          {/* Publications (BREADCRUMBS WIP) */}

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
      to: "/",
    },
    icon: Home,
  },
  {
    title: "My Team",
    url: { to: "/my-team" },
  },
  {
    title: "Submissions",
    url: { to: "/submissions" },
  },
  {
    title: "Prospective Authos",
    url: { to: "/prospective-authors" },
  },
  {
    title: "Published Manuscripts",
    url: { to: "/published-manuscripts" },
  },
];
