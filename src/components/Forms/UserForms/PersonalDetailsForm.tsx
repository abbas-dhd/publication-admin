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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadServer } from "@/components/FileUploadServer";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { PersonalDetailsSchema } from "./userFormSchema";
import { DevTool } from "@hookform/devtools";

type PersonalDetailsFormProp = {
  form: UseFormReturn<z.infer<typeof PersonalDetailsSchema>>;
  onSubmit?: () => void;
  showButtons: boolean; // true by default
};
const PersonalDetailsForm = ({
  form,
  onSubmit,
  showButtons = true,
}: PersonalDetailsFormProp) => {
  const preferredOptions = [
    { value: "law", label: "Law" },
    { value: "legal", label: "Legal" },
    { value: "Litigation", label: "Litigation" },
  ];

  return (
    <div className="flex items-center justify-center">
      <DevTool control={form.control} />
      <div className="w-full max-w-[512px] ">
        <h3 className="text-base font-semibold mb-10">Personal Details</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {
              onSubmit?.();
            })}
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
                      <SelectItem value="reviewer">Reviewer</SelectItem>
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
              render={() => (
                <FormItem>
                  <FormLabel>Profile Photo*</FormLabel>
                  <FormControl>
                    <FileUploadServer
                      control={form.control}
                      name="profile_photo"
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
              render={() => {
                // console.log("render func", field.field.value);
                return (
                  <FormItem>
                    <FormLabel>Upload Qualification Certificates*</FormLabel>
                    <FormControl>
                      <FileUploadServer
                        control={form.control}
                        name="qualification_cert"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
            {showButtons && (
              <div className="flex">
                <Button
                  type="submit"
                  className="cursor-pointer ml-auto"
                  // disabled={!form.formState.isValid}
                >
                  Save and Continue
                </Button>
              </div>
            )}

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

export default PersonalDetailsForm;
