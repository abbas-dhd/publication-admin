import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import usePreventUnload from "@/lib/usePreventUnload";
import { useState } from "react";
import { useAddUser } from "@/lib/query_and_mutations/user/useAddUser";
import type { UserData } from "@/lib/api/users";
import { toast } from "sonner";
import PersonalDetailsForm from "@/components/Forms/UserForms/PersonalDetailsForm";
import InstitutionDetailsForm from "@/components/Forms/UserForms/InstitutionDetailsForm";
import RefereeDetailsForm from "@/components/Forms/UserForms/RefereeDetailsForm";
import {
  InstitutionDetailsSchema,
  PersonalDetailsSchema,
  RefereeDetailsSchema,
} from "@/components/Forms/UserForms/userFormSchema";

export const Route = createFileRoute("/_app/my-team/add-user/")({
  component: RouteComponent,
  loader: () => ({
    crumb: "Add User",
  }),
});

function RouteComponent() {
  const navigation = useNavigate();
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
  });

  const form_2 = useForm<z.infer<typeof InstitutionDetailsSchema>>({
    resolver: zodResolver(InstitutionDetailsSchema),
  });

  const form_3 = useForm<z.infer<typeof RefereeDetailsSchema>>({
    resolver: zodResolver(RefereeDetailsSchema),
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
          <PersonalDetailsForm form={form_1} onSubmit={nextStep} showButtons />
        )}
        {step === 2 && (
          <InstitutionDetailsForm
            form={form_2}
            onSubmit={nextStep}
            onBack={prevStep}
            showButtons
          />
        )}
        {step === 3 && (
          <RefereeDetailsForm
            form={form_3}
            onSubmit={submitForm}
            onBack={prevStep}
            showButtons
          />
        )}
      </div>
    </div>
  );
}
