import "./style.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CalendarIcon, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCallAction,
  useGetCheckList,
} from "@/lib/query_and_mutations/actions/actions";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { allUsersQueryOptions } from "@/lib/query_and_mutations/user/useGetAllUsers";
import type { UserDataWithId } from "@/lib/api/users";
import type { CheckListItem, RevertTypes } from "@/lib/api/actions";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { DevTool } from "@hookform/devtools";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadServer } from "@/components/FileUploadServer";
import { currentAndNextIssueQueryOption } from "@/lib/query_and_mutations/volume_issue/getCurrentAndNextIssue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/statusBadge";

export const Route = createFileRoute("/_app/submissions/$id/")({
  component: RouteComponent,
  loader: ({ params }) => ({
    crumb: params.id,
  }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(
    getSubmissionByIdOptions({
      submission_id: id,
    })
  );

  const { data: actionData } = useQuery(
    getSubmissionActionOptions({
      submission_id: id,
    })
  );

  const { data: checklistData } = useGetCheckList();

  const checkListItems = checklistData?.data || ([] as CheckListItem[]);
  // console.log("checklist data", checklistData);

  const actions = actionData?.data.actions || [];
  const revertAction = actions.find((item) => item.name.includes("revert")) as
    | { name: RevertTypes }
    | undefined;

  // console.log("action Data", actionData);

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
          <div className="text-lg/[1.75rem] font-semibold flex gap-2">
            {file?.name || "N/A"}
            <span className="text-xs">
              <StatusBadge
                statusText={data?.data.submission.status?.label}
                backgroundColor={data?.data.submission.status.background}
                textColor={data?.data.submission.status.text}
              />
            </span>
          </div>
          <div className="text-sm/[1.813] text-muted-foreground">
            {data?.data.submission.title}
          </div>
        </div>
        {/* TODO: Add condition before pushing */}

        {revertAction && (
          <RevertToAuthor submission_id={id} revertType={revertAction.name} />
        )}
        {actions.some((action) => action.name === "reject") && (
          <RejectModal submission_id={id} />
        )}
        {actions.find((item) => item.name === "assign_reviewer") && (
          <AssignReviewers submission_id={id} />
        )}
        {actions.find((item) => item.name === "partial_ready_to_publish") && (
          <PublishManuscript submission_id={id} />
        )}
        {actions.find((item) => item.name === "assign_editor") && (
          // {/* use it in badge*/}
          <AssignEditor submission_id={id} />
        )}
        {actions.find((item) => item.name === "final_ready_to_publish") && (
          <EditorReadyToPublish submission_id={id} />
        )}
        {actions.find((item) => item.name === "payment_pending") && (
          <RC_SendPaymentLink submission_id={id} />
          //  {/* use it in badge*/}
        )}
        {actions.find((item) => item.name === "payment_done") && (
          <RC_MarkPaymentDone submission_id={id} />
          // {/* use it in badge*/}
        )}
        {actions.find((item) => item.name === "publish") && (
          <RC_Publish submission_id={id} />
        )}
        {actions.find((item) => item.name === "overwrite") && (
          <FileOverwrite submission_id={id} />
        )}
      </div>
      <Doc url={file?.url || ""} checkListItems={checkListItems} />
    </div>
  );
}

type DocProps = {
  url: string;
  checkListItems?: CheckListItem[];
};

const Doc = ({ url, checkListItems }: DocProps) => {
  // const [checkListState, setCheckListState] = useState(checkListItems);
  // console.log("checkListState", checkListState);
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
          Origin: "https://admin-publication.netlify.app/",
        }}
        pluginRenderers={DocViewerRenderers}
        style={{
          height: "80vh",
          width: "100%",
          borderRadius: "6px",
          // border: "2px solid red",
        }}
      />
      {!!checkListItems?.length && (
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
              {checkListItems?.map((item) => (
                <div className="flex gap-2">
                  <Checkbox
                    id={item.item}
                    // checked={item.checked}
                    onCheckedChange={() => {
                      // const newState = checkListState.map((chk, idx) =>
                      //   idx === index
                      //     ? { ...chk, checked: value as boolean }
                      //     : chk
                      // );
                      // setCheckListState(newState);
                    }}
                  />
                  <Label htmlFor={item.item}>{item.item}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

// const Checklist = ({
//   form,
//   checkListItems,
// }: {
//   checkListItems?: CheckListItem[];
//   form: UseFormReturn<z.infer<typeof checkListSchema>>;
// }) => {
//   return <div></div>;
// };

// const MoreActions = ({
//   actions,
//   submission_id,
// }: {
//   actions: {
//     name: string;
//     label: string;
//   }[];
//   submission_id: string;
// }) => {
//   return (
//     <Popover>
//       <PopoverTrigger className="py-2 px-4 rounded-md border">
//         <Ellipsis className="h-5 w-5" />
//       </PopoverTrigger>
//       <PopoverContent className="w-fit flex flex-col p-2">

//       </PopoverContent>
//     </Popover>
//   );
// };

const RejectModal = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();
  const [comments, setComments] = useState<string>("");

  const onConfirmReject = () => {
    mutate({
      action_name: "reject",
      details: {
        comments: comments,
      },
      submission_id: submission_id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="hover:bg-destructive hover:text-white"
        >
          Reject Manuscript
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject Reference_number by John Doe, and 2
            others? This action can’t be undone.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          onChange={(e) => {
            setComments(e.currentTarget.value);
          }}
        />
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirmReject}
              disabled={!comments.length}
            >
              Reject
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RevertToAuthor = ({
  submission_id,
  revertType,
}: {
  submission_id: string;
  revertType: RevertTypes;
}) => {
  const { mutate } = useCallAction();
  const [comments, setComments] = useState<string>("");

  const ConfirmRevert = () => {
    mutate({
      submission_id,
      action_name: revertType,
      details: {
        checklist: [],
        comments,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Redo2 />
          Revert to Author
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revert to Author</DialogTitle>
          <DialogDescription>
            Send them what they’re missing in their Manuscript.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          onChange={(e) => {
            setComments(e.currentTarget.value);
          }}
        />
        <span className="flex gap-2">
          <Checkbox id="include_list">Include CheckList</Checkbox>
          <Label htmlFor="include_list">Also send them the checklist</Label>
        </span>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={ConfirmRevert}
              disabled={!comments.length}
            >
              Send to Author
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- SCHEMA ---
const ReviewersSchema = z.object({
  reviewers: z.array(z.number()).refine((arr) => arr.length === 2, {
    message: "You must select exactly 2 reviewers",
  }),
  deadline: z.date(),
});

type ReviewerValues = z.infer<typeof ReviewersSchema>;

const AssignReviewers = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();

  const [isModalOpen, setIsModalOpen] = useState<boolean>();

  const { data, error, isLoading, refetch } = useQuery(
    allUsersQueryOptions({ enabled: false })
  );

  useEffect(() => {
    if (isModalOpen) {
      refetch();
    }
  }, [isModalOpen, refetch]);

  const form = useForm<ReviewerValues>({
    resolver: zodResolver(ReviewersSchema),
    defaultValues: {
      reviewers: [],
    },
  });

  const confirmApprove = () => {
    if (form.formState.isValid) {
      mutate({
        submission_id,
        action_name: "assign_reviewer",
        details: {
          reviewers: form.getValues().reviewers,
          deadline: form.getValues().deadline.getTime() / 1000,
        },
      });
      form.reset();
    }
  };

  if (error) return <p>{error.message}</p>;

  return (
    <Dialog
      onOpenChange={(value) => {
        setIsModalOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"success"}>Approve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve and Assign to Reviewers</DialogTitle>
          <DialogDescription>
            Choose 2 Reviewers to assign the Manuscript to
          </DialogDescription>
        </DialogHeader>
        {isLoading && <p>Loading</p>}
        <ReviewerListForm reviewers={data?.data.reviewers || []} form={form} />
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={confirmApprove}
              disabled={!form.formState.isValid}
            >
              Assign
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ReviewerListForm({
  form,
  reviewers,
}: {
  form: UseFormReturn<z.infer<typeof ReviewersSchema>>;
  reviewers: UserDataWithId[];
}) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="reviewers"
          render={() => (
            <FormItem>
              <FormLabel>Select exactly 2 reviewers</FormLabel>
              <div className="h-80 overflow-y-auto space-y-3 p-2 border rounded-md">
                {reviewers.map((reviewer) => (
                  <FormField
                    key={reviewer.user_id}
                    control={form.control}
                    name="reviewers"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(reviewer.user_id);
                      return (
                        <FormItem
                          key={reviewer.user_id}
                          className="flex items-center space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...field.value,
                                    reviewer.user_id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (v) => v !== reviewer.user_id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex gap-3 items-center w-full">
                            <img
                              src={reviewer.profile_photo.url}
                              alt="profile_img"
                              className="h-10 w-10 object-cover rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">
                                {reviewer.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {reviewer.email}
                              </span>
                            </div>
                            {reviewer.status === "available" && (
                              <span className="text-primary flex gap-2 items-center ml-auto">
                                {reviewer.submission_assigned}
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              </span>
                            )}
                            {reviewer.status === "unavailable" && (
                              <span className="text-destructive ml-auto">
                                Unavailable
                              </span>
                            )}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal w-full",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit" disabled={!form.formState.isValid}>
          Submit
        </Button> */}
      </form>
    </Form>
  );
}

type PublishManuscriptProps = {
  submission_id: string;
};
const PublishManuscript = ({ submission_id }: PublishManuscriptProps) => {
  const MIN_STEP_COUNT = 1;
  const MAX_STEP_COUNT = 6;
  const [scoringStep, setScoringStep] = useState(1);

  const [score_1, setScore_1] = useState(0);
  const [score_2, setScore_2] = useState(0);
  const [score_3, setScore_3] = useState(0);
  const [score_4, setScore_4] = useState(0);
  const [score_5, setScore_5] = useState(0);

  const [score_avg, setScore_avg] = useState(0);

  const calculateAvg = () => {
    const avg_score = (score_1 + score_2 + score_3 + score_4 + score_5) / 5;
    setScore_avg(avg_score);
  };
  const { mutate, error } = useCallAction();

  const readyToPublish = () => {
    // submission_id;
    mutate(
      {
        action_name: "partial_ready_to_publish",
        submission_id,
        details: {
          comments: "",
          score: score_avg,
        },
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const reset = () => {
    setScore_1(0);
    setScore_2(0);
    setScore_3(0);
    setScore_4(0);
    setScore_5(0);
    setScore_avg(0);

    setScoringStep(1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"}>Ready To Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Scores Before Marking ‘Ready to Publish’
          </DialogTitle>
          <DialogDescription>
            {!error && (
              <>
                Please evaluate the manuscript across each criterion. The
                minimum average score required to be considered ready to publish
                is 6.
              </>
            )}
            {error && error.message}
          </DialogDescription>
        </DialogHeader>
        {scoringStep === 1 && (
          <NumbersScore
            score={score_1}
            title="Originality & Contribution"
            subtitle="How original is the topic and how much value does it add?"
            onChangeScore={(score) => {
              setScore_1(score);
            }}
          />
        )}
        {scoringStep === 2 && (
          <NumbersScore
            score={score_2}
            title="Clarity & Structure"
            subtitle="How clear and well-organized is the manuscript?"
            onChangeScore={(score) => {
              setScore_2(score);
            }}
          />
        )}
        {scoringStep === 3 && (
          <NumbersScore
            score={score_3}
            title="Relevance & Scope"
            subtitle="Does the paper align with the journal’s theme and intended audience?"
            onChangeScore={(score) => {
              setScore_3(score);
            }}
          />
        )}
        {scoringStep === 4 && (
          <NumbersScore
            score={score_4}
            title="Research Depth & Citations"
            subtitle="How well-researched is the paper? Are citations relevant and sufficient?"
            onChangeScore={(score) => {
              setScore_4(score);
            }}
          />
        )}
        {scoringStep === 5 && (
          <NumbersScore
            score={score_5}
            title="Suggestions & Edits Required"
            subtitle="How much revision does this manuscript need?"
            onChangeScore={(score) => {
              setScore_5(score);
            }}
          />
        )}
        {scoringStep === 6 && (
          <div
            className={cn(
              "h-32 flex justify-center flex-col items-center rounded",
              `${score_avg >= 1 && score_avg <= 6 ? "bg-[#FEF3F2]" : ""}`,
              `${score_avg >= 6 && score_avg <= 8 ? "bg-[#FFFAEB]" : ""}`,
              `${score_avg >= 8 && score_avg <= 10 ? "bg-[#ECFDF3]" : ""}`
            )}
          >
            <p className="text-xs text-muted-foreground">Total Average Score</p>
            <div>
              <span className="text-3xl font-semibold">{score_avg}</span>
              <span className="text-sm">/ 10</span>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="border mr-auto"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              setScoringStep((prev) => Math.max(prev - 1, MIN_STEP_COUNT));
            }}
          >
            Back
          </Button>
          {scoringStep === MAX_STEP_COUNT && (
            <DialogClose asChild>
              <Button type="button" variant="default" onClick={readyToPublish}>
                Assign
              </Button>
            </DialogClose>
          )}
          {scoringStep < MAX_STEP_COUNT && (
            <>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  if (scoringStep === MAX_STEP_COUNT - 1) {
                    calculateAvg();
                  }
                  setScoringStep((prev) => Math.min(prev + 1, MAX_STEP_COUNT));
                }}
              >
                Next
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type NumbersScoreProps = {
  title: string;
  subtitle: string;
  onChangeScore: (score: number) => void;
  score: number;
};

const NumbersScore = ({
  subtitle,
  title,
  score,
  onChangeScore,
}: NumbersScoreProps) => {
  const MAX_SCORE = 10;
  // const MIN_SCORE = 1;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-sm">{subtitle}</p>
      </div>
      <div className="mt-2 mb-2">
        {[...Array(MAX_SCORE).keys()].map((item) => (
          <span
            className={cn(
              `px-4 py-2 border-l border-y [&:last-child]:border-r [&:last-child]:rounded-r [&:first-child]:border-l [&:first-child]:rounded-l`,
              `${score >= item + 1 && score >= 1 && score <= 6 ? "bg-[#FEF3F2]" : ""}`,
              `${score >= item + 1 && score >= 6 && score <= 8 ? "bg-[#FFFAEB]" : ""}`,
              `${score >= item + 1 && score >= 8 && score <= 10 ? "bg-[#ECFDF3]" : ""}`
            )}
            onClick={() => {
              onChangeScore(item + 1);
            }}
          >
            {item + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

// const coercedNumber = z.coerce.number().int().positive();

export const EditorsSchema = z.object({
  editors: z.array(z.number()).refine((arr) => arr.length === 1, {
    message: "You must select exactly 2 reviewers",
  }),
});

type EditorValues = z.infer<typeof EditorsSchema>;

const AssignEditor = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const { data, error, isLoading, refetch } = useQuery(
    allUsersQueryOptions({ enabled: false })
  );

  useEffect(() => {
    if (isModalOpen) {
      refetch();
    }
  }, [isModalOpen, refetch]);

  const form = useForm<EditorValues>({
    resolver: zodResolver(EditorsSchema),
    defaultValues: {
      editors: [] as number[],
    },
  });

  const confirmApprove = () => {
    if (form.formState.isValid) {
      mutate({
        submission_id,
        action_name: "assign_editor",
        details: {
          editors: form.getValues().editors,
        },
      });
      form.reset();
    }
  };

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {/* <DevTool control={form.control} /> */}
      <Dialog
        onOpenChange={(value) => {
          setIsModalOpen(value);
        }}
      >
        <DialogTrigger asChild>
          <Button variant={"success"}>Assign Editor</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to an Editor</DialogTitle>
            <DialogDescription>
              Choose an Editor for a final check
            </DialogDescription>
          </DialogHeader>
          {isLoading && <p>Loading</p>}
          <EditorListForm editors={data?.data.editors || []} form={form} />
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="border">
                Cancel
              </Button>
            </DialogClose>
            {/* <DialogClose asChild> */}
            <Button
              type="button"
              variant="default"
              onClick={confirmApprove}
              disabled={!form.formState.isValid}
            >
              Assign
            </Button>
            {/* </DialogClose> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function EditorListForm({
  form,
  editors,
}: {
  form: UseFormReturn<z.infer<typeof EditorsSchema>>;
  editors: UserDataWithId[];
}) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="editors" // now a number
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  // RadioGroup still deals with strings, so we convert
                  onValueChange={(value) => field.onChange([Number(value)])}
                  value={field.value?.toString()}
                  className="max-h-80 overflow-y-auto space-y-3 p-2 border rounded-md"
                >
                  {editors.map((editor) => (
                    <FormItem
                      key={editor.user_id}
                      className="flex items-center space-x-3 h-fit"
                    >
                      <FormControl>
                        <RadioGroupItem value={editor.user_id.toString()} />
                      </FormControl>
                      <FormLabel className="flex gap-3 items-center w-full">
                        <img
                          src={editor.profile_photo.url}
                          alt="profile_img"
                          className="h-10 w-10 object-cover rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {editor.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {editor.email}
                          </span>
                        </div>
                        {editor.status === "available" && (
                          <span className="text-primary flex gap-2 items-center ml-auto">
                            {editor.submission_assigned}
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          </span>
                        )}
                        {editor.status === "unavailable" && (
                          <span className="text-destructive ml-auto">
                            Unavailable
                          </span>
                        )}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

const EditorReadyToPublish = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();

  const onConfirmPublish = () => {
    mutate({
      action_name: "final_ready_to_publish",
      submission_id: submission_id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"} className="">
          Ready to be Published
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark as Ready to be Published?</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark the Manuscript ready to be pubmished?
            This action can’t be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onConfirmPublish}>
              Publish
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RC_SendPaymentLink = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();

  const onSendPaymentLink = () => {
    mutate({
      action_name: "payment_pending",
      submission_id: submission_id,
      details: {
        amount: 1500,
        comments: "",
        currency: "INR",
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"} className="">
          Approve and Send Payment Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve and Send Payment Link?</DialogTitle>
          <DialogDescription>
            This is to remind you that this is the final approval. By confirming
            here, the payment link will be sent to Authors and you and your team
            will not be able to suggest further changes. Are you sure you want
            to proceed?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onSendPaymentLink}>
              Approve
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RC_MarkPaymentDone = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();

  const onMarkPaymentAsDone = () => {
    mutate({
      action_name: "payment_done",
      submission_id: submission_id,
      details: {
        amount: 1500,
        comments: "",
        currency: "INR",
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"} className="">
          Mark Payment Done
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Payment as Done?</DialogTitle>
          <DialogDescription>
            This will mark the payment as done and notify the author that
            payment has been processed.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onMarkPaymentAsDone}>
              Mark as Paid
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// BADGE button
const RC_Publish = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();
  const [issue, setIssue] = useState<string>("");
  const { data } = useQuery(currentAndNextIssueQueryOption());

  const currentIssue = data?.data.current_issue;
  const nextIssue = data?.data.next_issue;

  const pubsishManuscript = () => {
    // TODO: handle it errors and undefined value properly
    const volume_id =
      currentIssue?.id === issue
        ? currentIssue.volume_id
        : nextIssue?.volume_id;

    mutate({
      action_name: "publish",
      submission_id: submission_id,
      details: {
        issue_id: Number(issue),
        volume_id: Number(volume_id) || 0, //TODO: take it from API
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"}>Publish Manuscript</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Manuscript</DialogTitle>
          <DialogDescription>
            Select the issue you want to publish the manuscript to. You can
            check them at Issue Management
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="issue">Issue</Label>
        <Select
          onValueChange={(value) => {
            setIssue(value);
          }}
        >
          <SelectTrigger className="w-full" id="issue">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>

          <SelectContent>
            {/* TODO: change it API based */}
            <SelectItem value={currentIssue?.id || "0"}>
              (Current Issue) {currentIssue?.title}
            </SelectItem>
            <SelectItem value={nextIssue?.id || "0"}>
              (Next Issue) {nextIssue?.title}
            </SelectItem>
          </SelectContent>
        </Select>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={pubsishManuscript} disabled={!issue}>
              Publish
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const FileSchema = z.object({
  url: z.string(),
  name: z.string(),
});

const FileForm = z.object({
  file: FileSchema,
});

const FileOverwrite = ({ submission_id }: { submission_id: string }) => {
  const { mutate } = useCallAction();
  const form = useForm<z.infer<typeof FileForm>>({
    resolver: zodResolver(FileForm),
  });

  const handleOverwrite = () => {
    mutate({
      action_name: "overwrite",
      details: {
        file: {
          name: form.getValues().file.name,
          url: form.getValues().file.url,
        },
      },
      submission_id: submission_id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} className="">
          Replace Manuscript
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Replace Document?</DialogTitle>
          <DialogDescription>
            Overwrite existing manuscript with a new document?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center gap-4">
          <FileUploadServer name="file" control={form.control} />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={!form.formState.isValid}
              onClick={handleOverwrite}
            >
              Replace
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
