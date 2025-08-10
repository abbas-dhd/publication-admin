import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoginImage from "@/assets/login_image.jpg";
import OPUS_JURIS_ICON from "@/assets/opus_juris_logo_icon.png";
import OPUS_JURIS_TEXT from "@/assets/opus_juris_logo_text.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import usePreventUnload from "@/lib/usePreventUnload";
import { useAuthOTPRequest } from "@/lib/query_and_mutations/useAuthOTPRequest";
import { useAuthSendOTP } from "@/lib/query_and_mutations/useAuthSendOTP";
import { useAuthContext } from "@/context/AuthContext";

export const Route = createFileRoute("/_auth/login/")({
  component: Login,
});

const loginFormSchema = z.object({
  phone_number: z.string().regex(/^[1-9]\d{9}$/, {
    message: "Invalid mobile number. Must be 10 digits Phone number.",
  }),
});

const oTPFormSchema = z.object({
  otp_number: z.string().regex(/^\d{6}$/, {
    message: "Please Enter 6 digit OTP",
  }),
});

function Login() {
  const [state, setState] = useState(false);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-full h-full hidden md:block">
        <img
          src={LoginImage}
          alt="login image"
          aria-hidden
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/*  Top Right*/}
        <div className="absolute right-0 top-0 p-4">
          <Link to="/" className="flex items-center gap-1">
            <img src={OPUS_JURIS_ICON} alt="Opus Juris Icon" className="h-6" />
            <img src={OPUS_JURIS_TEXT} alt="Opus Juris Text" className="h-6" />
          </Link>
        </div>
        {/*  */}
        {!state ? (
          <LoginForm
            onLoginSucess={(phone) => {
              setState((prev) => !prev);
              setVerifiedPhoneNumber(phone);
            }}
          />
        ) : (
          <OTP_Form phoneNumber={verifiedPhoneNumber} />
        )}
      </div>
    </div>
  );
}

type LoginFormProps = {
  onLoginSucess: (verifiedPhone: string) => void;
};

const LoginForm = ({ onLoginSucess }: LoginFormProps) => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone_number: "",
    },
  });

  const authOTPRequest = useAuthOTPRequest({
    onSuccess: (data) => {
      console.log("OTP SENT", data);
      const verifiedPhone = form.getValues("phone_number");
      onLoginSucess(verifiedPhone);
    },

    onError: (error) => {
      console.error(error);
      form.setError("phone_number", {
        message: "login Failed",
      });
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    let phoneNumber = data.phone_number;
    // append 91 as country code
    if (phoneNumber.length <= 10) phoneNumber = `91${phoneNumber}`;

    authOTPRequest.mutate({ mobile: phoneNumber });
  }
  return (
    <>
      <div className="w-full max-w-[400px]">
        <h2 className="font-semibold text-2xl/[32px]">Login to Publications</h2>
        <p className="text-sm/[16px] font-[400] text-[#535862] mb-10">
          Enter your registered phone to get an OTP.
        </p>
      </div>
      <div className="w-full max-w-[400px] ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Phone" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!form.formState.isValid || authOTPRequest.isPending}
            >
              {authOTPRequest.isPending ? "Loading" : "Send OTP"}
            </Button>
            {form.formState.errors?.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
        <p className="text-sm/[20px]">
          Facing Issues?{" "}
          <a href="#" className="underline">
            Contact us
          </a>
        </p>
      </div>
    </>
  );
};
type OTPFormType = {
  phoneNumber: string;
};
const OTP_Form = ({ phoneNumber }: OTPFormType) => {
  const form = useForm<z.infer<typeof oTPFormSchema>>({
    resolver: zodResolver(oTPFormSchema),
    defaultValues: {
      otp_number: "",
    },
  });
  const navigate = useNavigate();
  const authContext = useAuthContext();

  const authSendOTP = useAuthSendOTP({
    onSuccess: (response) => {
      console.log("OTP Verified", response);

      authContext.setAuthData(response.data);
      navigate({
        to: "/",
      });
    },

    onError: (error) => {
      console.error(error);
      form.setError("otp_number", {
        type: "invalid",
        message: "Invalid OTP",
      });
    },
  });

  function onSubmit(data: z.infer<typeof oTPFormSchema>) {
    console.log("Form submitted:", data);

    const mobile = `91${phoneNumber}`;
    authSendOTP.mutate({ mobile, otp: data.otp_number });
  }
  console.log(form.formState.errors);
  usePreventUnload(true);

  return (
    <>
      <div className="w-full max-w-[400px]">
        <h2 className="font-semibold text-2xl/[32px]">Login to Publications</h2>
        <p className="text-sm/[16px] font-[400] text-[#535862] mb-10">
          Enter your registered phone to get an OTP.
        </p>
      </div>
      <div className="w-full max-w-[400px] ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mb-10"
          >
            <FormField
              control={form.control}
              name="otp_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone*</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                  <FormMessage>
                    {form.formState.errors.otp_number?.type === "invalid" && (
                      <Button variant={"link"}>Resend</Button>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!form.formState.isValid || authSendOTP.isPending}
            >
              Send OTP
            </Button>
            {/* <FormMessage /> */}
          </form>
        </Form>
        <p className="text-sm/[20px]">
          Facing Issues?{" "}
          <a href="#" className="underline">
            Contact us
          </a>
        </p>
      </div>
    </>
  );
};
