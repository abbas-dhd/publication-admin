import { DataTable } from "@/components/CustomTable";
import type { Manuscript } from "@/lib/api/volume_and_issue";
import { allManuscriptQueryOptions } from "@/lib/query_and_mutations/volume_issue/getAllManuscripts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";

export const Route = createFileRoute(
  "/_app/published-manuscripts/$volume/$issue/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { issue } = Route.useParams();
  const { data, isLoading, error } = useQuery(
    allManuscriptQueryOptions({
      issue_id: issue,
    })
  );

  const manuscripts = data?.data || [];
  console.log(manuscripts);
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">
          <h3>Published Mauscripts</h3>
        </div>
      </div>
      {isLoading && <p>Data is Loading</p>}
      {error && <p>{error.message}</p>}
      <DataTable columns={columns} data={manuscripts} />
    </div>
  );
}

const columns: ColumnDef<Manuscript>[] = [
  {
    accessorKey: "file",
    header: () => <span className="pr-[2rem]">File</span>,
    cell: ({ row }) => {
      // TODO:  y ugly file parsing logic!
      const file = row.original.file;

      return (
        <a
          href={file.url}
          target="_blank"
          className="flex flex-col pr-[2rem] py-1"
        >
          {/* <img
            src={pic.url}
            alt={row.original.name}
            className="h-10 w-10 object-cover"
          /> */}
          <span className="text-sm">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.title}
          </span>
        </a>
      );
    },
  },
  {
    accessorKey: "author",
    header: () => <span className="px-[2rem]">Author</span>,
    cell: ({ row }) => (
      <span className="px-[2rem]">{row.original.authors.name} </span>
    ),
  },
  {
    accessorKey: "type",
    header: () => <span className="px-[2rem]">Type Of Submission</span>,
    cell: ({ row }) => <span className="px-[2rem]">{row.original.type}</span>,
  },
  {
    accessorKey: "reviewers",
    header: () => <span className="px-[2rem]">Reviewers</span>,
    cell: ({ row }) => (
      <span className="px-[2rem]">
        {row.original.reviewers[0].name ?? "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "score",
    header: () => <span className="px-[2rem]">Score</span>,
    cell: ({ row }) => <span className="px-[2rem]">{row.original.score}</span>,
  },
  {
    accessorKey: "published_on",
    header: () => <span className="px-[2rem]">Published On</span>,
    cell: ({ row }) => (
      <span className="px-[2rem]">
        {new Date(Number(row.original.published_on) * 1000).toDateString()}
      </span>
    ),
  },
];
