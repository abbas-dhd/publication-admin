import InstitutionDetailsForm from "@/components/Forms/UserForms/InstitutionDetailsForm";
import PersonalDetailsForm from "@/components/Forms/UserForms/PersonalDetailsForm";
import RefereeDetailsForm from "@/components/Forms/UserForms/RefereeDetailsForm";
import {
  InstitutionDetailsSchema,
  PersonalDetailsSchema,
  RefereeDetailsSchema,
} from "@/components/Forms/UserForms/userFormSchema";
import { Button } from "@/components/ui/button";
import type { UserDataWithId } from "@/lib/api/users";
import { useEditUser } from "@/lib/query_and_mutations/user/useEditUser";
import { userQueryOptions } from "@/lib/query_and_mutations/user/useGetUser";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

export const Route = createFileRoute("/_app/my-team/edit-user/$role/$id")({
  component: RouteComponent,
});

const formTabs = {
  1: "Basic Details",
  2: "Institution Details",
  3: "Referee Details",
} as const;

function RouteComponent() {
  const { id, role } = Route.useParams();
  const { data, isLoading, error } = useQuery(
    userQueryOptions({
      id,
      role,
    })
  );

  console.log("error: ", error?.message);
  if (isLoading && !data) return <>LOADING!</>;

  return data && <EditForm data={data} />;
}

const EditForm = ({ data }: { data: UserDataWithId }) => {
  const form_1 = useForm<z.infer<typeof PersonalDetailsSchema>>({
    resolver: zodResolver(PersonalDetailsSchema),
    mode: "onChange",
    defaultValues: {
      role: data.role_name,
      email: data.email,
      name: data.name,
      address: data.postal_address,
      phone: data.mobile,
      alt_phone: data.alternate_mobile,
      profile_photo: data.profile_photo,
      edu_qualification: data.education_qualification,
      preferred_review_subjects: data.preferred_subjects_for_review,
      qualification_cert: data.education_certificate,
    },
  });

  const form_2 = useForm<z.infer<typeof InstitutionDetailsSchema>>({
    resolver: zodResolver(InstitutionDetailsSchema),
    mode: "onChange",
    defaultValues: {
      alt_institution_phone: data?.institution_mobile,
      insitution_email: data?.institution_email,
      institution_address: data?.institution_postal_address,
      institution_name: data?.institution_name,
      institution_phone: data?.institution_mobile,
    },
  });

  const form_3 = useForm<z.infer<typeof RefereeDetailsSchema>>({
    resolver: zodResolver(RefereeDetailsSchema),
    mode: "onChange",
    defaultValues: {
      alt_referee_phone: data?.referee_mobile,
      referee_address: data?.referee_postal_address,
      referee_email: data?.referee_email,
      referee_name: data?.referee_name,
      referee_phone: data?.referee_mobile,
    },
  });

  const [currentTab, setCurrentTab] = useState<keyof typeof formTabs>(1);
  const [invalidTabs, setInvalidTabs] = useState<number[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useEditUser({
    onSuccess: (data, variables) => {
      const id = variables.user_id;
      const role = variables.role_name;
      queryClient.invalidateQueries({
        queryKey: ["user", id, role],
      });

      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message);
    },
  });

  const validateAllForms = async () => {
    const [result_1, result_2, result_3] = await Promise.all([
      form_1.trigger(),
      form_2.trigger(),
      form_3.trigger(),
    ]);

    if (result_1 && result_2 && result_3) return true;

    if (currentTab !== 1 && !result_1) {
      setInvalidTabs((prev) => {
        return [...prev, 1];
      });
    }

    if (currentTab !== 2 && !result_2) {
      setInvalidTabs((prev) => {
        return [...prev, 2];
      });
    }

    if (currentTab !== 3 && !result_3) {
      setInvalidTabs((prev) => {
        return [...prev, 3];
      });
    }

    return false;
  };

  return (
    <div>
      <div className="mb-8">
        {Object.keys(formTabs).map((tab) => {
          // is `tab` is being returned as string in map explicit conversion as to be done
          const tab_num = Number(tab) as keyof typeof formTabs;
          return (
            <Button
              variant={"ghost"}
              key={tab}
              className={cn(
                "rounded-none",
                tab_num === currentTab ? "border-b-2 border-primary" : "",
                invalidTabs.includes(tab_num)
                  ? "border-2 border-destructive bg-red-300 rounded hover:bg-red-100"
                  : ""
              )}
              onClick={() => {
                setCurrentTab(tab_num);
                setInvalidTabs((prev) => prev.filter((i) => i !== tab_num));
              }}
            >
              {formTabs[tab_num]}
            </Button>
          );
        })}
        <hr />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full max-w-[512px]">
          {currentTab === 1 && (
            <PersonalDetailsForm
              form={form_1}
              showButtons={false}
              onSubmit={() => {}}
            />
          )}
          {currentTab === 2 && (
            <InstitutionDetailsForm form={form_2} showButtons={false} />
          )}
          {currentTab === 3 && (
            <RefereeDetailsForm form={form_3} showButtons={false} />
          )}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                navigate({
                  to: "/my-team",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer px-8"
              onClick={async () => {
                const isValid = await validateAllForms();

                if (isValid) {
                  const personalDetails = form_1.getValues();
                  const institutionDetails = form_2.getValues();
                  const refereeDetails = form_3.getValues();

                  const userData: UserDataWithId = {
                    user_id: data.user_id,
                    role_name: personalDetails.role,
                    name: personalDetails.name,
                    mobile: personalDetails.phone,
                    alternate_mobile: personalDetails.alt_phone,
                    email: personalDetails.email,
                    postal_address: personalDetails.address,
                    education_qualification: personalDetails.edu_qualification,
                    preferred_subjects_for_review:
                      personalDetails.preferred_review_subjects,
                    institution_name: institutionDetails.institution_name,
                    institution_mobile: institutionDetails.institution_phone,
                    institution_alternate_mobile:
                      institutionDetails.alt_institution_phone,
                    institution_email: institutionDetails.insitution_email,
                    institution_postal_address:
                      institutionDetails.institution_address,
                    referee_name: refereeDetails.referee_name,
                    referee_email: refereeDetails.referee_email,
                    referee_mobile: refereeDetails.referee_phone,
                    referee_alternate_mobile: refereeDetails.alt_referee_phone,
                    referee_postal_address: refereeDetails.referee_address,
                    profile_photo: personalDetails.profile_photo,
                    education_certificate: personalDetails.qualification_cert,
                  };
                  mutate(userData);
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
