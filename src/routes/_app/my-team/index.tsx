import { DataTable } from "@/components/CustomTable";
import { preferredOptions } from "@/components/Forms/UserForms/PersonalDetailsForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { UserDataWithId } from "@/lib/api/users";
import { allUsersQueryOptions } from "@/lib/query_and_mutations/user/useGetAllUsers";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Mail,
  Pencil,
  Phone,
  PlusIcon,
  MapPin,
  FileBadge2,
  Award,
  Star,
  Landmark,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_app/my-team/")({
  component: RouteComponent,
});

type UserRole = "editor" | "review_coordinator" | "reviewer";
type RoleData = {
  role: UserRole;
  count: number;
  text: string;
};

function RouteComponent() {
  const [activeRole, setCurrentActiveRole] = useState<UserRole>("editor");

  const { data, isLoading, error } = useQuery(
    allUsersQueryOptions({
      enabled: true,
    })
  );
  const navigate = Route.useNavigate();

  const editor = data?.data.editors || [];
  const reviewCoordinator = data?.data.review_coordinators || [];
  const reviewers = data?.data.reviewers || [];
  const getActiveRoleData = (role: UserRole) => {
    if (role === "editor") return editor;
    if (role === "review_coordinator") return reviewCoordinator;
    if (role === "reviewer") return reviewers;

    return [];
  };
  const roleCount: RoleData[] = [
    { role: "editor", count: editor.length, text: "Editor" },
    {
      role: "review_coordinator",
      count: reviewCoordinator.length,
      text: "Review Coordinators",
    },
    { role: "reviewer", count: reviewers.length, text: "Reviewer" },
  ];

  const columns: ColumnDef<UserDataWithId>[] = useMemo(
    () => [
      {
        accessorKey: "role_name",
        header: getRoleName(activeRole),
        size: 1,
        maxSize: 1,
        cell: ({ row }) => {
          const userName = row.original.name;
          const email = row.original.email;
          const profile_photo = row.original.profile_photo;
          const pic = profile_photo;

          return (
            <div className="flex flex-col">
              <img
                src={pic.url}
                alt={row.original.name}
                className="h-10 w-10 object-cover"
              />
              <span className="text-sm">{userName}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "manuscript",
        header: "Manuscripts",
        cell: () => {
          return (
            <p className="flex flex-col justify-start items-start">
              <span>0 in Progress</span>
              <span className="">0 Published</span>
            </p>
          );
        },
      },
      {
        accessorKey: "mobile",
        header: () => <div className="text-center">Contact</div>,
        cell: ({ row }) => {
          return <p className="text-center">+91 {row.original.mobile}</p>;
        },
      },
      {
        accessorKey: "action",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
          return (
            <div className=" ml-auto text-center font-medium flex gap-4 justify-center">
              <ViewUserDialog user={row.original}>
                <Eye className="cursor-pointer p-1 h-fit w-fit rounded hover:bg-accent" />
              </ViewUserDialog>
              <Pencil
                className="cursor-pointer p-1 h-fit w-fit rounded hover:bg-accent"
                onClick={() => {
                  navigate({
                    to: "/my-team/edit-user/$role/$id",
                    params: {
                      id: `${row.original.user_id}`,
                      role: row.original.role_name,
                    },
                  });
                }}
              />
            </div>
          );
        },
      },
    ],
    [activeRole, navigate]
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">
          {roleCount.map((item) => (
            <Button
              variant={"ghost"}
              key={item.role}
              className={cn(
                "py-2.5 px-3 flex gap-2 text-base/[24px] font-semibold rounded-[6px] hover:bg-[#f5f5f5]",
                `${activeRole === item.role ? "bg-accent" : ""}`
              )}
              onClick={() => {
                setCurrentActiveRole(item.role);
              }}
            >
              {item.text}
              <span className="text-sm/[20px] border rounded-full py-0.5 px-2.5">
                {item.count}
              </span>
            </Button>
          ))}
        </div>
        <Link
          className="cursor-pointer flex bg-primary rounded-lg py-2 px-4 text-primary-foreground text-sm items-center gap-2"
          to={"/my-team/add-user"}
        >
          <PlusIcon /> Add User
        </Link>
      </div>
      {isLoading && <p>Data is Loading</p>}
      {error && <p>{error.message}</p>}

      <DataTable columns={columns} data={getActiveRoleData(activeRole)} />
    </div>
  );
}

function getRoleName(role: string) {
  if (role === "editor") return "Editor";
  if (role === "review_coordinator") return "Review Coordinators";
  if (role === "reviewer") return "Reviewers";
}

type ViewUserDialogProp = {
  children: React.ReactElement;
  user: UserDataWithId;
};

const UserTabs = {
  1: "Basic Details",
  2: "Institution Details",
  3: "Referee Details",
} as const;

const ViewUserDialog = ({ children, user }: ViewUserDialogProp) => {
  const [currentTab, setCurrentTab] = useState<keyof typeof UserTabs>(1);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center flex-col justify-center gap-4">
            <img
              src={user.profile_photo.url}
              alt={user.name}
              className="rounded-full h-12 w-12"
            />
            <p className="text-base font-semibold">{user.name}</p>
          </div>
        </DialogHeader>
        <div className="flex border-b">
          {Object.keys(UserTabs).map((tab) => {
            // is `tab` is being returned as string in map explicit conversion as to be done
            const tab_num = Number(tab) as keyof typeof UserTabs;
            return (
              <Button
                variant={"ghost"}
                key={tab}
                className={cn(
                  "rounded-none w-full shrink grow",
                  tab_num === currentTab ? "border-b-2 border-primary" : ""
                )}
                onClick={() => {
                  setCurrentTab(tab_num);
                }}
              >
                {UserTabs[tab_num]}
              </Button>
            );
          })}
        </div>
        <div className="h-96 overflow-auto">
          {currentTab === 1 && <ViewPersonalDetails user={user} />}
          {currentTab === 2 && <ViewInstitutionDetails user={user} />}
          {currentTab === 3 && <ViewRefereeDetails user={user} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ViewPersonalDetails = ({ user }: { user: UserDataWithId }) => {
  return (
    <div>
      <div className="flex flex-col gap-4 mb-5">
        <h3 className="text-sm font-semibold ">Basic Details</h3>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Phone
          </span>
          <p className="text-sm text-secondary-foreground">{user.mobile}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Alternate Phone
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.alternate_mobile || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Mail className="h-2.5 w-2.5" /> Email
          </span>
          <p className="text-sm text-secondary-foreground">{user.email}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" /> Address
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.postal_address}
          </p>
        </div>
      </div>
      {/* Next Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold ">
          Qualification & Review Preferences
        </h3>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <FileBadge2 className="h-2.5 w-2.5" /> Educational Qualification
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.education_qualification}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Award className="h-2.5 w-2.5" /> Uploaded Qualification
            Certificates
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.education_certificate ? (
              <a href={user.education_certificate.url} target="_blank">
                {user.education_certificate.name}
              </a>
            ) : (
              "N/A"
            )}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Star className="h-2.5 w-2.5" /> Preferred Subject for Review
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.preferred_subjects_for_review.map((subject) => {
              return `${
                preferredOptions.find((item) => item.value === subject)
                  ?.label || ""
              }, `;
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const ViewInstitutionDetails = ({ user }: { user: UserDataWithId }) => {
  return (
    <div>
      <div className="flex flex-col gap-4 mb-5">
        <h3 className="text-sm font-semibold ">Institution details</h3>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Landmark className="h-2.5 w-2.5" /> Name
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.institution_name}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Phone
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.institution_mobile || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Alternate Phone
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.institution_alternate_mobile || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Mail className="h-2.5 w-2.5" /> Email
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.institution_email || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" /> Address
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.institution_postal_address || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ViewRefereeDetails = ({ user }: { user: UserDataWithId }) => {
  return (
    <div>
      <div className="flex flex-col gap-4 mb-5">
        <h3 className="text-sm font-semibold ">Referee details</h3>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Landmark className="h-2.5 w-2.5" /> Name
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.referee_name || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Phone
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.referee_mobile || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Phone className="h-2.5 w-2.5" /> Alternate Phone
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.referee_alternate_mobile || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <Mail className="h-2.5 w-2.5" /> Email
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.referee_email || "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex gap-1 text-sm items-center text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" /> Address
          </span>
          <p className="text-sm text-secondary-foreground">
            {user.referee_postal_address || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
