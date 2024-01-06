import { z } from 'zod';

export const loginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export type LoginDto = z.infer<typeof loginDtoSchema>;
