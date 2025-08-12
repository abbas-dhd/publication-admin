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
import { useAuthContext } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import LoginImage from "@/assets/login_image.jpg";
import OPUS_JURIS_ICON from "@/assets/opus_juris_logo_icon.png";
import OPUS_JURIS_TEXT from "@/assets/opus_juris_logo_text.png";
import { useAuthorLogin } from "@/lib/query_and_mutations/author/useAuthorLogin";

export const Route = createFileRoute("/_auth/author-login/")({
  component: Login,
});

const loginFormSchema = z.object({
  reference_id: z.string().refine((value) => value.trim, {
    error: "Please enter valid reference ID",
  }),
  password: z.string(),
});

function Login() {
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
        <LoginForm />
      </div>
    </div>
  );
}

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      reference_id: "",
    },
  });

  const navigate = Route.useNavigate();
  const authContext = useAuthContext();

  const { mutate, isPending } = useAuthorLogin({
    onSuccess: (response) => {
      console.log("OTP Verified", response);

      authContext.setAuthData(response.data);
      navigate({
        to: "/author",
      });
    },

    onError: (error) => {
      console.error(error);
      form.setError("root", {
        type: "invalid",
        message: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    // api call
    mutate({
      reference_number: data.reference_id,
      password: data.password,
    });
  }
  return (
    <>
      <div className="w-full max-w-[400px]">
        <h2 className="font-semibold text-2xl/[32px]">
          Author login to Publications
        </h2>
        <p className="text-sm/[16px] font-[400] text-[#535862] mb-10">
          Enter the login credential sent to you over email,
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
              name="reference_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referece ID*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reference id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!form.formState.isValid || isPending}
            >
              {isPending ? "Please wait..." : "Login"}
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
