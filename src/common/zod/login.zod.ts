import { z } from 'zod';
import { Gender } from '../constant/enum';

export const loginSchema = z.object({
  username: z.string().trim().min(1, { message: 'Please fill in this field' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password at least 6 characters' }),
});
