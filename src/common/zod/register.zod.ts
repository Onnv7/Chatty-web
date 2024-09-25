import { z } from 'zod';
import { Gender } from '../constant/enum';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'Please fill in this field' }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: 'Please fill in this field' }),
    email: z.string().trim().min(1, { message: 'Please fill in this field' }),
    password: z
      .string()
      .trim()
      .min(6, { message: 'Password at least 6 characters' }),
    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: 'Password at least 6 characters' }),
    birthDate: z
      .date({ message: 'Please choose your birth date' })
      .transform((date) => date.toISOString().split('T')[0]),
    gender: z.nativeEnum(Gender),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });
