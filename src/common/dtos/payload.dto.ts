import { z } from 'zod';

export const jwtDtoSchema = z.object({
  sub: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'user']),
  exp: z.number(),
  iat: z.number(),
});

export type JwtDto = z.infer<typeof jwtDtoSchema>;
