import { DataTable } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import type { UserDataWithId } from "@/lib/api/users";
import { allUsersQueryOptions } from "@/lib/query_and_mutations/user/useGetAllUsers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, PlusIcon } from "lucide-react";
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
              <Eye className="cursor-pointer" />
              <Pencil
                className="cursor-pointer"
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
              className="py-2.5 px-3 flex gap-2 text-base/[24px] font-semibold rounded-[6px] hover:bg-[#f5f5f5]"
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
