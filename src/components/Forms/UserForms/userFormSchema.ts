import z from "zod";

export const PersonalDetailsSchema = z.object({
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

export const InstitutionDetailsSchema = z.object({
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

export const RefereeDetailsSchema = z.object({
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

export type AllUserData = {
  personalDetails: z.infer<typeof PersonalDetailsSchema>;
  institionDetails: z.infer<typeof InstitutionDetailsSchema>;
  referrDetails: z.infer<typeof RefereeDetailsSchema>;
};
