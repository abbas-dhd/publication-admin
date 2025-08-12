import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, type ValidateLinkOptions } from "@tanstack/react-router";
import OPUS_JURIS_ICON from "@/assets/opus_juris_logo_icon.png";
import OPUS_JURIS_TEXT from "@/assets/opus_juris_logo_text.png";
import { twMerge } from "tailwind-merge";

type AppSidebarProps = {
  links: SidebarLinks[];
};
export function AppSidebar({ links }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent className=" p-2">
        <SidebarMenu>
          {links.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  {...item.url}
                  activeProps={{
                    className: "bg-gray-200 dark:bg-gray-700",
                  }}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarFooterContent />
      </SidebarFooter>
    </Sidebar>
  );
}

// Menu items.

export type SidebarLinks = {
  title: string;
  url: ValidateLinkOptions;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const SidebarHeaderContent = () => {
  const sidebar = useSidebar();
  const isCollapsed = sidebar.state === "collapsed";
  const isExpanded = sidebar.state === "expanded";
  return (
    <div
      className={twMerge(
        "flex items-center border-[#E9EAEB] border-b",
        `${isCollapsed && "p-2 justify-center"}`,
        `${isExpanded && "p-4 justify-between"}`
      )}
    >
      <span className="flex items-center gap-1">
        <img src={OPUS_JURIS_ICON} alt="Opus Juris Icon" className="h-6" />
        {isExpanded && (
          <img src={OPUS_JURIS_TEXT} alt="Opus Juris Text" className="h-6" />
        )}
        {/* {sidebar.state === "collapsed" && <LAT_SMALL_Logo />} */}
      </span>
      {isExpanded && <SidebarTrigger className="h-[24px] w-[24px]" />}
    </div>
  );
};
const SidebarFooterContent = () => {
  return (
    <div className="p-4 flex items-center border-t border-[#E9EAEB]">
      <div className="h-[40px] w-[40px] rounded-full bg-red-900"></div>
    </div>
  );
};
