import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { CalendarIcon, FolderClosed, PlusIcon } from "lucide-react";

import { useForm, type UseFormReturn } from "react-hook-form";
import z from "zod";
import { format } from "date-fns";
import { FileUploadServer } from "@/components/FileUploadServer";
import { useAddIssue } from "@/lib/query_and_mutations/volume_issue/addIssue";
import { useQuery } from "@tanstack/react-query";

import { allIssuesQueryOptions } from "@/lib/query_and_mutations/volume_issue/getAllIssues";

export const Route = createFileRoute("/_app/published-manuscripts/$volume/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { volume } = Route.useParams();
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
          );
        })}
      </div>
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
  end_data: z.date(),
});
type IssueValues = z.infer<typeof IssueFormSchema>;

const AddIssue = ({ volume_id }: { volume_id: string }) => {
  const { mutate } = useAddIssue();

  const form = useForm<IssueValues>({
    resolver: zodResolver(IssueFormSchema),
  });

  const addIssue = () => {
    const values = form.getValues();

    mutate({
      description: values.description,
      end_date: (values.end_data.getTime() / 1000).toString(),
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
          name="end_data"
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
