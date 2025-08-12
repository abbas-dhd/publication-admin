import { DataTable } from "@/components/CustomTable";
import type { SubmissionData } from "@/lib/api/submissions";
import { allSubmissionOptions } from "@/lib/query_and_mutations/submission/getAllSubmissions";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

export const Route = createFileRoute("/_author/author/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(allSubmissionOptions());

  if (!data) return <p>No Data</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <strong>Submission</strong>
      <div className="mt-4">
        <DataTable columns={columns} data={data.data} />
      </div>
    </div>
  );
}

const columns: ColumnDef<SubmissionData>[] = [
  {
    accessorKey: "submisison",
    header: () => <span className="pr-[2rem]">File</span>,
    cell: ({ row }) => {
      // TODO:  y ugly file parsing logic!
      const fileString = row.original?.manuscripts?.[0]?.file;

      const fileName =
        fileString != undefined ? JSON.parse(fileString) : "Some File Name";
      return (
        <div className="flex flex-col pr-[2rem] py-1">
          {/* <img
            src={pic.url}
            alt={row.original.name}
            className="h-10 w-10 object-cover"
          /> */}
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
    header: () => <span className="px-[2rem]">Score</span>,
    cell: () => <span className="px-[2rem]">-</span>,
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Reviewers</span>,
    cell: () => <span className="px-[2rem]">-</span>,
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Deadline</span>,
    cell: () => <span className="px-[2rem]">-</span>,
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Editor</span>,
    cell: () => <span className="px-[2rem]">-</span>,
  },

  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Co-Authors</span>,
    cell: () => <span className="px-[2rem]">-</span>,
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
