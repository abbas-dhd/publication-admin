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
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";
import type { RefereeDetailsSchema } from "./userFormSchema";

type RefereeDetailsFormProp = {
  form: UseFormReturn<z.infer<typeof RefereeDetailsSchema>>;
  onSubmit?: () => void;
  onBack?: () => void;
  showButtons: boolean;
};
const RefereeDetailsForm = ({
  form,
  onSubmit,
  onBack,
  showButtons = true,
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
            onSubmit={form.handleSubmit(() => {
              onSubmit?.();
            })}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="referee_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Referee</FormLabel>
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
                  <FormLabel>Phone of Referee</FormLabel>
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
                  <FormLabel>Alternate Phone of Referee</FormLabel>
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
                  <FormLabel>Postal Address of Referee</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showButtons && (
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
export default RefereeDetailsForm;
