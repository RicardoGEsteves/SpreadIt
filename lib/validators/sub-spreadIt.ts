import { z } from "zod";

export const SubSpreadItValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(21)
    .refine((name) => !/[\/\\|\s]/.test(name) && name.length > 2),
});

export const SubSpreadItSubscriptionValidator = z.object({
  subSpreadItId: z.string(),
});

export type CreateSubSpreadItPayload = z.infer<typeof SubSpreadItValidator>;
export type SubscribeToSubSpreadItPayload = z.infer<
  typeof SubSpreadItSubscriptionValidator
>;
