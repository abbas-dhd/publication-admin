import { DataTable } from "@/components/CustomTable";
import { FileUploadServer } from "@/components/FileUploadServer";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ProspectAuthor } from "@/lib/api/prospect-author";
import { BULK_SHEET_SAMPLE_URL } from "@/lib/contants";
import { useAddProspect } from "@/lib/query_and_mutations/prospect-author/useAddProspect";
import { useBulkUpload } from "@/lib/query_and_mutations/prospect-author/useBulkUpload";
import { useCallForPaper } from "@/lib/query_and_mutations/prospect-author/useCallForPaper";
import { useDeleteProspect } from "@/lib/query_and_mutations/prospect-author/useDeleteProspect";
import { allProspectsQueryOptions } from "@/lib/query_and_mutations/prospect-author/useGetAllProspects";
import { useUpdateProspect } from "@/lib/query_and_mutations/prospect-author/useUpdateProspect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Megaphone,
  Pencil,
  PlusIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/_app/prospective-authors/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(allProspectsQueryOptions());
  const [editingProspect, setEditingProspect] = useState<ProspectAuthor | null>(
    null
  );
  const [editingOpen, setEditingOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate } = useUpdateProspect({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const toggleNotify = useCallback(
    (userData: ProspectAuthor, should_notify: boolean) => {
      mutate({
        name: userData.name,
        id: userData.id,
        email: userData.email,
        mobile: userData.mobile,
        name_of_college: userData.name_of_college ?? "",
        name_of_university: userData.name_of_university ?? "",
        should_notify,
      });
    },
    [mutate]
  );

  const columns: ColumnDef<ProspectAuthor>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <div className="pr-[2rem]">Name</div>,
        cell: ({ row }) => {
          return (
            <span className="text-sm pr-[2rem] flex items-center gap-2">
              <Switch
                className="cursor-pointer"
                checked={row.original.should_notify ?? false}
                onCheckedChange={() => {
                  toggleNotify(row.original, !row.original.should_notify);
                }}
              />
              {row.original.name}
            </span>
          );
        },
      },
      {
        accessorKey: "mobile",
        header: () => <div>Contact</div>,
        cell: ({ row }) => {
          return (
            <div className="pr-[2rem] flex flex-col">
              <span className="text-sm pr-[2rem]">{row.original.email}</span>
              <span className="text-sm pr-[2rem] text-muted-foreground">
                {row.original.mobile}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "name_of_college",
        header: () => <div className="pr-[2rem]">College</div>,
        cell: ({ row }) => {
          return (
            <div className="pr-[2rem] flex flex-col">
              <span className="text-sm pr-[2rem]">
                {row.original.name_of_college ?? "N/A"}
              </span>
              <span className="text-sm pr-[2rem]">
                {row.original.name_of_university ?? "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => <div className="text-center ">Actions</div>,
        cell: ({ row }) => {
          return (
            <div className=" ml-auto text-center font-medium flex gap-4 justify-center">
              {/* <ViewUserDialog user={row.original}> */}
              <Pencil
                className="cursor-pointer p-1 h-fit w-fit rounded hover:bg-accent"
                onClick={() => {
                  setEditingProspect(row.original);
                  setEditingOpen(true);
                }}
              />
              {/* </ViewUserDialog> */}
              <Trash2
                className="cursor-pointer p-1 h-fit w-fit rounded hover:bg-accent text-destructive"
                onClick={() => {
                  setEditingProspect(row.original);
                  setDeleteOpen(true);
                }}
              />
            </div>
          );
        },
      },
    ],
    [toggleNotify]
  );
  if (!data?.data) return <p> No data </p>;
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">Prospective Authors</div>
        <div className="flex gap-2">
          <AddProspectModal />
          <CallForPaperModal />
          <BulkImportModal />
        </div>
      </div>
      {isLoading && <p>Data is Loading</p>}
      {error && <p>{error.message}</p>}
      <DataTable columns={columns} data={data.data} />
      {editingProspect && editingOpen && (
        <EditProspectModal
          prospect={editingProspect}
          open={editingOpen}
          setOpen={setEditingOpen}
          onModalClose={() => setEditingProspect(null)}
        />
      )}
      {deleteOpen && editingProspect && (
        <ConfirmDeleteProspectModal
          prospect={editingProspect}
          open={deleteOpen}
          setOpen={setDeleteOpen}
          onModalClose={() => setEditingProspect(null)}
        />
      )}
    </div>
  );
}

const ProspectFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  mobile: z.string().regex(/^[1-9]\d{9}$/, {
    message: "Invalid mobile number. Must be 10 digits Phone number.",
  }),
  name_of_college: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined))
    .optional()
    .nullable(),
  name_of_university: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined))
    .optional()
    .nullable(),
});

type ProspectFormProps = {
  form: UseFormReturn<z.infer<typeof ProspectFormSchema>>;
};
const ProspectForm = ({ form }: ProspectFormProps) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Ex. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="Ex. john.doe@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input placeholder="10 digit phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_of_college"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of College</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of college"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name_of_university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of University</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name of university"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const AddProspectModal = () => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(ProspectFormSchema),
  });

  const { mutate } = useAddProspect({
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    if (form.formState.isValid) {
      const data = form.getValues();
      mutate({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        name_of_college: data.name_of_college ?? "",
        name_of_university: data.name_of_university ?? "",
      });
    } else {
      form.trigger();
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer flex bg-primary rounded-lg py-2 px-4 text-primary-foreground text-sm items-center gap-2">
          <PlusIcon /> Add Prospect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Prospect</DialogTitle>
          <DialogDescription>
            An invite will be sent to their Email and Phone. They will be
            notified further when you call for papers
          </DialogDescription>
        </DialogHeader>

        <ProspectForm form={form} />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={onSubmit}>Add Prospect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type EditProspectModalProps = {
  prospect: ProspectAuthor;
  open: boolean;
  setOpen: (open: boolean) => void;
  onModalClose?: () => void;
};
const EditProspectModal = ({
  prospect,
  open,
  setOpen,
  onModalClose,
}: EditProspectModalProps) => {
  const form = useForm({
    resolver: zodResolver(ProspectFormSchema),
    defaultValues: prospect,
  });

  const { mutate } = useUpdateProspect({
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setOpen(false);
      onModalClose?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    if (form.formState.isValid) {
      const data = form.getValues();
      mutate({
        id: prospect.id,
        email: data.email,
        mobile: data.mobile,
        name: data.name,
        name_of_college: data.name_of_college ?? "",
        name_of_university: data.name_of_university ?? "",
        should_notify: prospect.should_notify,
      });
    } else {
      form.trigger();
    }
  };

  return (
    <Dialog
      key={prospect.name}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
        form.reset();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Prospect</DialogTitle>
        </DialogHeader>

        <ProspectForm form={form} />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={onSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ConfirmDeleteProspectModal = ({
  prospect,
  open,
  setOpen,
  onModalClose,
}: EditProspectModalProps) => {
  const { mutate } = useDeleteProspect({
    onSuccess: (data) => {
      toast.success(data.message);
      setOpen(false);

      onModalClose?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    mutate({
      id: prospect.id,
    });
  };

  return (
    <Dialog
      key={prospect.name}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && onModalClose) onModalClose();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {prospect.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>‘{prospect.name}’</b>from
            Prospective Authors? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>

          <Button variant={"destructive"} onClick={onSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CallForPaperModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate } = useCallForPaper({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = () => {
    mutate({
      title,
      description,
    });

    setOpen(false);
    setTitle("");
    setDescription("");
  };

  const isValidForm = title.trim().length > 0 && description.trim().length > 0;

  return (
    <Dialog key={`${open}`} onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button className="cursor-pointer">
          <Megaphone /> Call for Papers
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call for Paper</DialogTitle>
          <DialogDescription>
            Please update the title and description of the form before you
            notify prospects.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="cfp_title">Title</Label>
        <Input
          id="cfp_title"
          placeholder="Ex. Volume 1 - Issue 01"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label htmlFor="cfp_description">Description</Label>
        <Textarea
          id="cfp_description"
          value={description}
          placeholder="Ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          onChange={(e) => setDescription(e.target.value)}
        />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>

          <Button disabled={!isValidForm} onClick={onSubmit}>
            Notify All Prospects
          </Button>
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

const BulkImportModal = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FileForm>>({
    resolver: zodResolver(FileForm),
  });

  const { mutate } = useBulkUpload({
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = () => {
    if (form.formState.isValid) {
      const data = form.getValues();
      console.log(data);
      mutate({
        name: data.file.name,
        url: data.file.url,
      });
    } else {
      form.trigger();
    }
  };

  return (
    <Dialog key={`${open}`} onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button className="cursor-pointer">
          <Upload /> Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Call for Paper</DialogTitle>
          <DialogDescription>
            Please update the title and description of the form before you
            notify prospects.
            <a
              href={BULK_SHEET_SAMPLE_URL}
              target="_blank"
              rel="noreferrer"
              className="underline ml-1 hover:text-primary"
            >
              <span className="flex items-center gap-1">
                Sample Data <Download className="h-4" />
              </span>
            </a>
          </DialogDescription>
        </DialogHeader>
        <FileUploadServer name="file" control={form.control} />

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="border">
              Cancel
            </Button>
          </DialogClose>

          <Button disabled={!form.formState.isValid} onClick={onSubmit}>
            Notify All Prospects
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
