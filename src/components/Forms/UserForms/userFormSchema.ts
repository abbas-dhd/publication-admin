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
    .nullable()
    .refine(
      (val) =>
        val === undefined || val === null || /^[1-9]\d{9}$/.test(val.trim()),
      {
        message: "Invalid mobile number. Must be 10 digits Phone number.",
      }
    ),
  email: z.email(),
  address: z.string(),
  // profile_photo: z.string(),
  profile_photo: z.object({
    url: z.url(),
    name: z.string(),
  }),
  // Qualifications
  edu_qualification: z.string(),
  qualification_cert: z
    .object({
      url: z.url(),
      name: z.string(),
    })
    .optional()
    .nullable(),

  // qualification_cert: z.string(),
  preferred_review_subjects: z.string().array().min(1),
});

export const InstitutionDetailsSchema = z.object({
  institution_name: z.string(),
  institution_phone: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .nullable()
    .refine(
      (val) => val === undefined || val === null || /^[1-9]\d{9}$/.test(val),
      {
        message: "Invalid mobile number. Must be 10 digits Phone number.",
      }
    ),
  alt_institution_phone: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .nullable()
    .refine(
      (val) => val === undefined || val === null || /^[1-9]\d{9}$/.test(val),
      {
        message: "Invalid mobile number. Must be 10 digits Phone number.",
      }
    ),

  insitution_email: z
    .email()
    .or(z.literal("").transform(() => undefined))
    .optional()
    .nullable(),

  institution_address: z.string(),
});

export const RefereeDetailsSchema = z
  .object({
    referee_name: z.string().optional().nullable(),
    referee_phone: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .nullable()
      .refine(
        (val) => val === undefined || val === null || /^[1-9]\d{9}$/.test(val),
        {
          message: "Invalid mobile number. Must be 10 digits Phone number.",
        }
      ),
    alt_referee_phone: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .nullable()
      .refine(
        (val) => val === undefined || val === null || /^[1-9]\d{9}$/.test(val),
        {
          message: "Invalid mobile number. Must be 10 digits Phone number.",
        }
      ),
    referee_email: z
      .email()
      .or(z.literal("").transform(() => undefined))
      .optional()
      .nullable(),
    referee_address: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // If name is provided, phone must be provided
      if (data.referee_name && !data.referee_phone) {
        return false;
      }
      return true;
    },
    {
      message: "Phone number is required when referee name is provided.",
      path: ["referee_phone"], // attach error to phone field
    }
  );

export type AllUserData = {
  personalDetails: z.infer<typeof PersonalDetailsSchema>;
  institionDetails: z.infer<typeof InstitutionDetailsSchema>;
  referrDetails: z.infer<typeof RefereeDetailsSchema>;
};
