import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, type UseFormReturn } from "react-hook-form";
import z from "zod";

import { MultiSelect } from "@/components/ui/multi-select";

import usePreventUnload from "@/lib/usePreventUnload";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useAddUser } from "@/lib/query_and_mutations/user/useAddUser";
import type { UserData } from "@/lib/api/users";
import { toast } from "sonner";
import { SERVER_API } from "@/lib/contants";
// import { DevTool } from "@hookform/devtools";
import { Trash2 } from "lucide-react";

const userSearchParamSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("add"),
    id: z.undefined().optional(), // id should not exist
  }),
  z.object({
    mode: z.literal("edit"),
    id: z.string().min(1, "id is required in edit mode"),
  }),
]);

export const Route = createFileRoute("/_app/my-team/add-user/")({
  validateSearch: (search: Record<string, unknown>) =>
    userSearchParamSchema.parse(search),
  component: RouteComponent,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => {
    if (deps.mode === "edit") {
      // fetch data for id
    }

    return {} as AllUserData;
  },
});

const PersonalDetailsSchema = z.object({
  // personal details
  role: z.string(),
  name: z.string(),
  phone: z.string().regex(/^[1-9]\d{9}$/, {
    message: "Invalid mobile number. Must be 10 digits Phone number.",
  }),
  alt_phone: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || /^[1-9]\d{9}$/.test(val), {
      message: "Invalid mobile number. Must be 10 digits Phone number.",
    }),
  email: z.email(),
  address: z.string(),
  // profile_photo: z.string(),
  profile_photo: z.object({
    url: z.url(),
    name: z.string(),
  }),
  // Qualifications
  edu_qualification: z.string(),
  qualification_cert: z.object({
    url: z.url(),
    name: z.string(),
  }),
  // qualification_cert: z.string(),
  preferred_review_subjects: z.string().array().min(1),
});

const InstitutionDetailsSchema = z.object({
  institution_name: z.string(),
  institution_phone: z.string().regex(/^[1-9]\d{9}$/, {
    message: "Invalid mobile number. Must be 10 digits Phone number.",
  }),
  alt_institution_phone: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || /^[1-9]\d{9}$/.test(val), {
      message: "Invalid mobile number. Must be 10 digits Phone number.",
    }),

  insitution_email: z.email(),
  institution_address: z.string(),
});

const RefereeDetailsSchema = z.object({
  referee_name: z.string(),
  referee_phone: z.string().regex(/^[1-9]\d{9}$/, {
    message: "Invalid mobile number. Must be 10 digits Phone number.",
  }),
  alt_referee_phone: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => val === undefined || /^[1-9]\d{9}$/.test(val), {
      message: "Invalid mobile number. Must be 10 digits Phone number.",
    }),
  referee_email: z.email(),
  referee_address: z.string(),
});

type AllUserData = {
  personalDetails: z.infer<typeof PersonalDetailsSchema>;
  institionDetails: z.infer<typeof InstitutionDetailsSchema>;
  referrDetails: z.infer<typeof RefereeDetailsSchema>;
};

function RouteComponent() {
  const navigation = useNavigate();
  // const { id, mode } = Route.useSearch();
  const data = Route.useLoaderData();

  usePreventUnload(true);
  const { mutate } = useAddUser({
    onSuccess: () => {
      console.log("user Created");

      toast.success("User Added!");
      navigation({
        to: "/my-team",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Server Error!");
      form_3.setError("root", {
        type: "server_error",
        message: "Something went wrong",
      });
    },
  });
  const form_1 = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    defaultValues: data.personalDetails,
  });

  const form_2 = useForm<z.infer<typeof InstitutionDetailsSchema>>({
    resolver: zodResolver(InstitutionDetailsSchema),
    defaultValues: data.institionDetails,
  });

  const form_3 = useForm<z.infer<typeof RefereeDetailsSchema>>({
    resolver: zodResolver(RefereeDetailsSchema),
    defaultValues: data.referrDetails,
  });

  const FIRST_STEP = 1;
  const LAST_STEP = 3;

  const [step, setStep] = useState(FIRST_STEP);

  const prevStep = () => {
    setStep((prev) => Math.max(FIRST_STEP, prev - 1));
  };
  const nextStep = () => {
    setStep((prev) => Math.min(LAST_STEP, prev + 1));
  };

  const submitForm = async () => {
    console.log(form_1.getValues());
    console.log(form_2.getValues());
    console.log(form_3.getValues());

    const personalDetails = form_1.getValues();
    const institutionDetails = form_2.getValues();
    const refereeDetails = form_3.getValues();

    const userData: UserData = {
      role_name: personalDetails.role,
      name: personalDetails.name,
      mobile: personalDetails.phone,
      alternate_mobile: personalDetails.alt_phone,
      email: personalDetails.email,
      postal_address: personalDetails.address,
      education_qualification: personalDetails.edu_qualification,
      preferred_subjects_for_review: personalDetails.preferred_review_subjects,
      institution_name: institutionDetails.institution_name,
      institution_mobile: institutionDetails.institution_phone,
      institution_alternate_mobile: institutionDetails.alt_institution_phone,
      institution_email: institutionDetails.insitution_email,
      institution_postal_address: institutionDetails.institution_address,
      referee_name: refereeDetails.referee_name,
      referee_email: refereeDetails.referee_email,
      referee_mobile: refereeDetails.referee_phone,
      referee_alternate_mobile: refereeDetails.alt_referee_phone,
      referee_postal_address: refereeDetails.referee_address,
      profile_photo: personalDetails.profile_photo,
      education_certificate: personalDetails.qualification_cert,
    };

    mutate(userData);
  };

  const formSteps: { [key: number]: string } = {
    1: "Basic Details",
    2: "Institution Details",
    3: "Referee Details",
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-5">
        Add User | Step {step} {formSteps[step]}
      </h2>
      {/* <div className="relative">
        <div className="w-full h-[1px] border-t-2 border-dotted absolute" />
        <div className="flex w-full justify-between mb-16">
          {Object.keys(formSteps).map((key) => (
            <div className="w-full flex justify-center" key={key}>
              {key}
            </div>
          ))}
        </div>
      </div> */}

      <div>
        {step === 1 && (
          <PersonalDetailsForm form={form_1} onSubmit={nextStep} />
        )}
        {step === 2 && (
          <InstitutionDetailsForm
            form={form_2}
            onSubmit={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <RefereeDetailsForm
            form={form_3}
            onSubmit={submitForm}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}

type PersonalDetailsFormProp = {
  form: UseFormReturn<z.infer<typeof PersonalDetailsSchema>>;
  onSubmit: () => void;
};
const PersonalDetailsForm = ({ form, onSubmit }: PersonalDetailsFormProp) => {
  const preferredOptions = [
    { value: "law", label: "Law" },
    { value: "legal", label: "Legal" },
    { value: "Litigation", label: "Litigation" },
  ];

  return (
    <div className="flex items-center justify-center">
      {/* <DevTool control={form.control} /> */}
      <div className="w-full max-w-[512px] ">
        <h3 className="text-base font-semibold mb-10">Personal Details</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="reviewer ">Reviewer</SelectItem>
                      <SelectItem value="review_coordinator">
                        Review Coordinator
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Phone*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
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
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Address*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile_photo"
              render={(field) => (
                <FormItem>
                  <FormLabel>Profile Photo*</FormLabel>
                  <FormControl>
                    <FileUploadServer
                      value={field.field.value}
                      onUploadSuccess={(fileData) => {
                        field.field.onChange(fileData);
                      }}
                      onUploadFail={() => {
                        form.setError("profile_photo", {
                          message: "Failed to upload file to server, try again",
                        });

                        form.setValue("profile_photo", undefined!);
                      }}
                      onRemoveFile={() => {
                        form.setValue("profile_photo", undefined!);
                        console.log("remove file set");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* EDUCATIONAL QUALIFICATION */}
            <h3 className="text-base font-semibold mb-10">
              Qualification & Review Preferences
            </h3>
            <FormField
              control={form.control}
              name="edu_qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educational Qualification*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualification_cert"
              render={(field) => (
                <FormItem>
                  <FormLabel>Upload Qualification Certificates*</FormLabel>
                  <FormControl>
                    <FileUploadServer
                      value={field.field.value}
                      onUploadSuccess={(fileData) => {
                        field.field.onChange(fileData);
                      }}
                      onUploadFail={() => {
                        form.setError("qualification_cert", {
                          message: "Failed to upload file to server, try again",
                        });
                        form.setValue("qualification_cert", undefined!);
                      }}
                      onRemoveFile={() => {
                        form.setValue("qualification_cert", undefined!);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferred_review_subjects"
              render={(field) => (
                <FormItem>
                  <FormLabel>Preferred Subject for Review*</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={preferredOptions}
                      onValueChange={field.field.onChange}
                      defaultValue={field.field.value}
                      placeholder="Select Subjects"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex">
              <Button
                type="submit"
                className="cursor-pointer ml-auto"
                // disabled={!form.formState.isValid}
              >
                Save and Continue
              </Button>
            </div>

            {form.formState.errors?.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

type InstitutionDetailsFormProp = {
  form: UseFormReturn<z.infer<typeof InstitutionDetailsSchema>>;
  onSubmit: () => void;
  onBack: () => void;
};
const InstitutionDetailsForm = ({
  form,
  onSubmit,
  onBack,
}: InstitutionDetailsFormProp) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[512px] ">
        <h3 className="text-base font-semibold mb-10">Institution details</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="institution_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Institution*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone of Institution*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt_institution_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Phone of Institution*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insitution_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID of Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Address of Institution*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant={"secondary"}
                className="border"
                type="button"
                onClick={onBack}
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                // disabled={!form.formState.isValid}
              >
                Save and Continue
              </Button>
            </div>
            {form.formState.errors?.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

type RefereeDetailsFormProp = {
  form: UseFormReturn<z.infer<typeof RefereeDetailsSchema>>;
  onSubmit: () => void;
  onBack: () => void;
};
const RefereeDetailsForm = ({
  form,
  onSubmit,
  onBack,
}: RefereeDetailsFormProp) => {
  // function onSubmitForm(data: z.infer<typeof RefereeDetailsSchema>) {
  //   // console.log("Referee Form submitted:", data);

  // }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[512px] ">
        <h3 className="text-base font-semibold mb-10">Referee details</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="referee_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Referee*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referee_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone of Referee*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt_referee_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Phone of Referee*</FormLabel>
                  <FormControl>
                    <Input placeholder="10 digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referee_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID of Referee</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referee_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Address of Referee*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant={"secondary"}
                className="border"
                type="button"
                onClick={onBack}
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                // disabled={!form.formState.isValid}
              >
                Add User
              </Button>
            </div>
            {form.formState.errors?.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

type ResponseFile = {
  url: string;
  name: string;
};

type FileUploadResponse = {
  message: string;
  error?: string;
  data: {
    file: ResponseFile;
  };
};

const uploadFileToServer = async (file: File): Promise<FileUploadResponse> => {
  const fd = new FormData();

  fd.append("file", file);

  const resposne = await fetch(`${SERVER_API}/api/core/upload-file/`, {
    method: "POST",
    body: fd,
  });

  const data = (await resposne.json()) as FileUploadResponse;
  console.log(data);
  return data;
};

type FileUploadServerProp = {
  value: ResponseFile | null;
  onUploadSuccess: (file: ResponseFile) => void;
  onUploadFail: () => void;
  onRemoveFile: () => void;
};
const FileUploadServer = ({
  value = null,
  onUploadSuccess,
  onUploadFail,
  onRemoveFile,
}: FileUploadServerProp) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [fileData, setFileData] = useState<ResponseFile | null>(value);

  return (
    <>
      {!value && (
        <FileUpload
          isLoading={isLoading}
          onChange={async (file) => {
            setIsLoading(true);

            const url = await uploadFileToServer(file)
              .catch((error) => {
                console.log(error);
                onUploadFail?.();
              })
              .finally(() => {
                setIsLoading(false);
              });

            if (url) {
              const file_data = (url as FileUploadResponse).data.file;
              // setFileData(file_data);
              onUploadSuccess(file_data);
            }
          }}
        />
      )}
      {value != null && (
        <div className="h-[4rem] w-full border rounded-[8px] p-4 flex align-center justify-between">
          <a href={value.url} target="_blank">
            <strong>{value.name}</strong>
          </a>
          <button
            className="pointer text-destructive"
            onClick={(e) => {
              e.preventDefault();
              onRemoveFile();
            }}
            type="button"
          >
            <Trash2 />
          </button>
        </div>
      )}
    </>
  );
};
