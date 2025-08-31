import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarIcon,
  EllipsisVertical,
  FolderClosed,
  PlusIcon,
} from "lucide-react";

import { useForm, type UseFormReturn } from "react-hook-form";
import z from "zod";
import { format } from "date-fns";
import { FileUploadServer } from "@/components/FileUploadServer";
import { useAddIssue } from "@/lib/query_and_mutations/volume_issue/addIssue";
import { useQuery } from "@tanstack/react-query";

import { allIssuesQueryOptions } from "@/lib/query_and_mutations/volume_issue/getAllIssues";
import { useState } from "react";
import type { Issue } from "@/lib/api/volume_and_issue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUpdateIssue } from "@/lib/query_and_mutations/volume_issue/updateIssue";
import { toast } from "sonner";
import { useDeleteIssue } from "@/lib/query_and_mutations/volume_issue/deleteIssue";

export const Route = createFileRoute("/_app/published-manuscripts/$volume/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { volume } = Route.useParams();
  const [viewDetailsModal, setViewDetailsModal] = useState<boolean>(false);
  const [editIssueModal, setEditIssueModal] = useState<boolean>(false);
  const [deleteIssueModal, setDeleteIssueModal] = useState<boolean>(false);
  const [selectedIssue, setIssue] = useState<Issue | null>(null);

  const { data, isLoading, error } = useQuery(
    allIssuesQueryOptions({
      volume_id: volume,
    })
  );

  const issues = data?.data || [];

  // fetch all the issues of a particular volume
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">
          <h3>Published Mauscripts</h3>
        </div>
        <AddIssue volume_id={volume} />
      </div>
      {isLoading && <p>Data is Loading</p>}
      {error && <p>{error.message}</p>}
      <div className="grid grid-cols-4 gap-4">
        {issues.map((issue) => {
          return (
            <div className="relative">
              <Link
                to="/published-manuscripts/$volume/$issue"
                params={{
                  issue: issue.id,
                  volume: volume,
                }}
                className="p-5 border h-40 flex flex-col items-center justify-center rounded-2xl hover:bg-accent"
              >
                <FolderClosed className="h-12 w-12" />
                <div className="flex flex-col gap-3 justify-center items-center">
                  <span>{issue.title}</span>
                  <div className="flex gap-4">
                    {/* <span className="flex gap-1 justify-center items-center">
                    <FileText /> 3
                  </span> */}
                  </div>
                </div>
              </Link>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="h-8 w-8 p-2 cursor-pointer hover:text-primary" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setIssue(issue);
                        setViewDetailsModal(true);
                      }}
                    >
                      More Details
                    </DropdownMenuItem>
                    {/* TODO: Enable Edit once issue from BE is fixed */}
                    {/* <DropdownMenuItem
                      onClick={() => {
                        setIssue(issue);
                        setEditIssueModal(true);
                      }}
                    >
                      Edit Details
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setIssue(issue);
                        setDeleteIssueModal(true);
                      }}
                    >
                      Delete Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
      {viewDetailsModal && selectedIssue && (
        <IssueDetails
          issue={selectedIssue}
          open={viewDetailsModal}
          setOpen={setViewDetailsModal}
          onModalClose={() => {
            setIssue(null);
            setViewDetailsModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
      {editIssueModal && selectedIssue && (
        <EditIssue
          issue={selectedIssue}
          volume_id={volume}
          open={editIssueModal}
          setOpen={setEditIssueModal}
          onModalClose={() => {
            setIssue(null);
            setEditIssueModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
      {deleteIssueModal && selectedIssue && (
        <DeleteIssue
          issue={selectedIssue}
          open={deleteIssueModal}
          setOpen={setDeleteIssueModal}
          onModalClose={() => {
            setIssue(null);
            setDeleteIssueModal(false);
            // Temp fix for issue https://github.com/radix-ui/primitives/issues/2122
            setTimeout(() => {
              document.body.style = "";
            });
          }}
        />
      )}
    </div>
  );
}

const IssueFormSchema = z.object({
  issue_thumbnail: z.object({
    url: z.url(),
    name: z.string(),
  }),
  title: z.string(),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date(),
});
type IssueValues = z.infer<typeof IssueFormSchema>;

const AddIssue = ({ volume_id }: { volume_id: string }) => {
  const { mutate } = useAddIssue({
    onSuccess: (data) => {
      const msg = data.message;
      toast.success(msg);
    },
    onError: (error) => {
      const msg = error.message;
      toast.error(msg);
    },
  });

  const form = useForm<IssueValues>({
    resolver: zodResolver(IssueFormSchema),
  });

  const addIssue = () => {
    const values = form.getValues();

    mutate({
      description: values.description,
      end_date: (values.end_date.getTime() / 1000).toString(),
      start_date: (values.start_date.getTime() / 1000).toString(),
      thumbnail: values.issue_thumbnail,
      title: values.title,
      volume_id: volume_id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer flex bg-primary rounded-lg py-2 px-4 text-primary-foreground text-sm items-center gap-2">
          <PlusIcon /> Add Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Issue</DialogTitle>
          {/* <DialogDescription>
            Select the issue you want to publish the manuscript to. You can
            check them at Issue Management
          </DialogDescription> */}
        </DialogHeader>
        <IssueForm form={form} />

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
              onClick={addIssue}
            >
              Add Issue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const IssueForm = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof IssueFormSchema>>;
}) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="issue_thumbnail"
          render={() => (
            <FormItem>
              <FormLabel>Profile Photo*</FormLabel>
              <FormControl>
                <FileUploadServer
                  control={form.control}
                  name="issue_thumbnail"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                    disabled={(date) => date < form.getValues().start_date}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter title" {...field} />
              </FormControl>
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
};

type IssueDetailsProps = {
  issue: Issue;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const IssueDetails = ({
  issue,
  open,
  setOpen,
  onModalClose,
}: IssueDetailsProps) => {
  return (
    <Dialog
      key={issue.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{issue.title}</DialogTitle>
          <DialogDescription>{issue.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EditIssueProps = {
  issue: Issue;
  volume_id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const EditIssue = ({
  volume_id,
  issue,
  open,
  setOpen,
  onModalClose,
}: EditIssueProps) => {
  const { mutate } = useUpdateIssue({
    onSuccess: (data) => {
      const msg = data.message;
      toast.success(msg);
    },
    onError: (error) => {
      const msg = error.message;
      toast.error(msg);
    },
  });

  const start_date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  start_date.setUTCSeconds(Number(issue.start_date));

  const end_date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  end_date.setUTCSeconds(Number(issue.end_date));

  const form = useForm<IssueValues>({
    resolver: zodResolver(IssueFormSchema),
    defaultValues: {
      title: issue.title,
      end_date: end_date,
      start_date: start_date,
      description: issue.description,
      issue_thumbnail: {
        name: issue.thumbnail.name,
        url: issue.thumbnail.url,
      },
    },
  });

  const updateIssue = () => {
    const values = form.getValues();

    mutate({
      id: issue.id,
      volume_id: volume_id,
      title: values.title,
      description: values.description,
      end_date: (values.end_date.getTime() / 1000).toString(),
      start_date: (values.start_date.getTime() / 1000).toString(),
      thumbnail: values.issue_thumbnail,
    });
  };

  return (
    <Dialog
      key={issue.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Issue</DialogTitle>
          {/* <DialogDescription>
            Select the issue you want to publish the manuscript to. You can
            check them at Issue Management
          </DialogDescription> */}
        </DialogHeader>
        <IssueForm form={form} />

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
              onClick={updateIssue}
            >
              Update Issue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// const EditVolume = ({
//   open,
//   setOpen,
//   issue,
//   onModalClose,
// }: EditIssueProps) => {
//   const [title, setTitle] = useState<string>(volume.title);
//   const [description, setDescription] = useState<string>(volume.description);
//   const { mutate } = useUpdateVolume({
//     onSuccess: (data) => {
//       const msg = data.message;
//       toast.success(msg);
//     },
//     onError: (error) => {
//       const msg = error.message;
//       toast.error(msg);
//     },
//   });

//   const updateVolume = () => {
//     mutate({
//       description,
//       title,
//       volume_id: volume.id,
//     });
//   };

//   return (
//     <Dialog
//       key={volume.id}
//       onOpenChange={(value) => {
//         setOpen(value);
//         if (!value && onModalClose) onModalClose();
//       }}
//       open={open}
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Volume</DialogTitle>
//         </DialogHeader>
//         <Label htmlFor="volume_title">Volume Title</Label>
//         <Input
//           placeholder="Enter volume"
//           id="volume_title"
//           value={title}
//           onChange={(e) => {
//             setTitle(e.currentTarget.value);
//           }}
//         />
//         <Label htmlFor="volume_description">Volume Title</Label>
//         <Textarea
//           placeholder="Enter description"
//           id="volume_description"
//           value={description}
//           onChange={(e) => {
//             setDescription(e.currentTarget.value);
//           }}
//         />

//         <DialogFooter className="sm:justify-end">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary" className="border">
//               Close
//             </Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button
//               type="button"
//               disabled={!(title && description)}
//               onClick={updateVolume}
//             >
//               Update
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

type DeleteVolumeProps = {
  issue: Issue;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};

const DeleteIssue = ({
  issue,
  open,
  setOpen,
  onModalClose,
}: DeleteVolumeProps) => {
  const { mutate } = useDeleteIssue({
    onSuccess: (data) => {
      const msg = data.message;
      toast.success(msg);
    },
    onError: (error) => {
      const msg = error.message;
      toast.error(msg);
    },
  });

  const deleteIssue = () => {
    mutate({
      issue_id: issue.id,
    });
  };
  return (
    <Dialog
      key={issue.id}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {issue.title}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Volume named ‘{issue.title}’?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

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
              className="border"
              onClick={deleteIssue}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
