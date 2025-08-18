import { DataTable } from "@/components/CustomTable";
import { FileUploadServer } from "@/components/FileUploadServer";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import type { ResubmitTypes } from "@/lib/api/actions";
import { type SubmissionData } from "@/lib/api/submissions";
import { useCallAction } from "@/lib/query_and_mutations/actions/actions";
import { getSubmissionActionOptions } from "@/lib/query_and_mutations/submission/getSubmissionAction";
import { getSubmissionByIdOptions } from "@/lib/query_and_mutations/submission/getSubmissionsbyId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_author/author/")({
  component: RouteComponent,
});

export type AuthorJWTPayload = {
  user_id: string;
  role_name: string;
  exp: number;
  submission_id: string;
};

const FileSchema = z.object({
  url: z.string(),
  name: z.string(),
});

const FileForm = z.object({
  file: FileSchema,
});

function RouteComponent() {
  const authContext = useAuthContext();
  const token = authContext.user?.token || "";

  const decoded = jwtDecode<AuthorJWTPayload>(token);
  const { submission_id } = decoded;
  // TODO: Fix submission API for Author

  const { data: actionData } = useQuery(
    getSubmissionActionOptions({
      submission_id,
    })
  );

  const actions = actionData?.data.actions || [];

  const { data, isLoading, error } = useQuery(
    getSubmissionByIdOptions({
      submission_id,
    })
  );

  // form: UseFormReturn<z.infer<typeof PersonalDetailsSchema>>;
  const form = useForm<z.infer<typeof FileForm>>({
    resolver: zodResolver(FileForm),
  });

  const { mutate } = useCallAction();

  const handleResubmit = () => {
    const resubmitAction = actions.find((item) =>
      item.name.includes("resubmit")
    ) as { name: ResubmitTypes } | undefined;

    if (!resubmitAction) return;

    mutate({
      action_name: resubmitAction.name,
      details: {
        file: {
          name: form.getValues().file.name,
          url: form.getValues().file.url,
        },
      },
      submission_id: submission_id,
    });
  };

  if (!actions.length)
    return <p>No action to be performed on your end for now</p>;

  if (!data) return <p>No Data</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <div>
        <strong>Submission</strong>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={[data.data]} />
      </div>

      {!!actions.length && (
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-lg">
            Submission has been reverted to you please re upload the file with
            corrected changes
          </h1>
          <FileUploadServer name="file" control={form.control} />

          <Button disabled={!form.formState.isValid} onClick={handleResubmit}>
            Send
          </Button>
        </div>
      )}
    </div>
  );
}

const columns: ColumnDef<SubmissionData>[] = [
  {
    accessorKey: "submisison",
    header: () => <span className="pr-[2rem]">File</span>,
    cell: ({ row }) => {
      // TODO:  y ugly file parsing logic!
      const fileName = row.original?.manuscripts?.[0]?.file;

      return (
        <div className="flex flex-col pr-[2rem] py-1">
          <span className="text-sm">{fileName.name ?? fileName}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.submission?.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Status</span>,
    cell: () => <span className="px-[2rem]">Yet to Assign</span>,
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Type of Submission</span>,
    cell: ({ row }) => {
      return (
        <span className="px-[2rem]">
          {row.original?.submission?.category || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Submitted on</span>,
    cell: ({ row }) => {
      const submitted = new Date(row.original.submission.created_at * 1000);

      return <span className="px-[2rem]">{submitted.toDateString()}</span>;
    },
  },
];
