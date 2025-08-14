import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { createFileRoute } from "@tanstack/react-router";
import "./style.css";
import { ArrowLeft, Ellipsis, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getSubmissionByIdOptions } from "@/lib/query_and_mutations/submission/getSubmissionsbyId";
import { getSubmissionActionOptions } from "@/lib/query_and_mutations/submission/getSubmissionAction";

export const Route = createFileRoute("/_app/submissions/$id/")({
  component: RouteComponent,
  loader: ({ params }) => ({
    crumb: params.id,
  }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery(
    getSubmissionByIdOptions({
      submission_id: id,
    })
  );

  const {
    data: actionData,
    // isLoading: action_isLoading,
    // error: action_error,
  } = useQuery(
    getSubmissionActionOptions({
      submission_id: id,
    })
  );

  console.log("action Data", actionData);

  console.log("error: ", error?.message);
  if (isLoading && !data) return <>LOADING!</>;

  // TODO: Proper Error handling for file URL
  const file = data?.data.manuscripts[0].file;

  return (
    <div>
      <div className="flex items-center gap-2 ">
        <ArrowLeft
          className="h-5 w-5 text-muted-foreground shrink-0"
          onClick={() => {
            navigate({ to: "/submissions" });
          }}
        />
        <div className="w-full">
          <div className="text-lg/[1.75rem] font-semibold ">
            {file?.name || "N/A"}
          </div>
          <div className="text-sm/[1.813] text-muted-foreground">
            {data?.data.submission.title}
          </div>
        </div>

        <MoreActions />
        <Button variant={"outline"} className="py-2">
          <Redo2 />
          Revert to Author
        </Button>
        <Button variant={"success"}>Approve</Button>
      </div>
      <Doc url={file?.url || ""} />
    </div>
  );
}
type DocProps = {
  url: string;
};
const Doc = ({ url }: DocProps) => {
  return (
    <div>
      <DocViewer
        config={{
          header: {
            disableHeader: true,
          },
        }}
        documents={[
          {
            uri: url,
            // uri: "https://pub-c20cf6f0c5614055b150956b8e2eb462.r2.dev/uploads/0c052fb7-6899-464e-ae9b-90bafea78c60_Receptionist Job Test.docx",
            // fileType: file.type || "application/pdf", // important!
            // fileName: file.name,
          },
        ]}
        requestHeaders={{
          Origin: "http://localhost:5173/",
        }}
        pluginRenderers={DocViewerRenderers}
        style={{
          height: "80vh",
          width: "100%",
          borderRadius: "6px",
          // border: "2px solid red",
        }}
      />
      <Accordion
        type="single"
        collapsible
        className="absolute right-0 bottom-0 border w-[20rem] rounded-2xl bg-blue-400"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-4 text-white">
            Checklist
          </AccordionTrigger>
          <AccordionContent className="m-[2px] bg-white rounded-[14px] p-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <Checkbox id="term_1" />
              <Label htmlFor="term_1">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_2" />
              <Label htmlFor="term_2">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_3" />
              <Label htmlFor="term_3">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_4" />
              <Label htmlFor="term_4">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_5" />
              <Label htmlFor="term_5" className=" text-sm/[20px]">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_6" />
              <Label htmlFor="term_6">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_7" />
              <Label htmlFor="term_7">Lorem ipsum dolor sit amet</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="term_8" />
              <Label htmlFor="term_8">Lorem ipsum dolor sit amet</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const MoreActions = () => {
  return (
    <Popover>
      <PopoverTrigger className="py-2 px-4 rounded-md border">
        <Ellipsis className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col p-2">
        <Button variant={"ghost"} className="">
          Re-assign reviewer
        </Button>
        <Button
          variant={"ghost"}
          className="hover:bg-destructive hover:text-white"
        >
          Reject Manuscript
        </Button>
      </PopoverContent>
    </Popover>
  );
};
