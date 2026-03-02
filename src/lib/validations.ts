import { z } from 'zod';

export const registerSchema = z.object({
  shopName: z.string().min(2, 'Shop name required').max(100),
  ownerName: z.string().min(2, 'Owner name required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number'),
  email: z.string().email('Enter valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const leadFormSchema = z.object({
  name: z.string().min(2, 'Name required').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  city: z.string().min(2, 'City required').max(100),
  reelId: z.string().optional(),
  userId: z.string().min(1),
  instagramUser: z.string().optional(),
});

export const reelSchema = z.object({
  url: z.string().url('Enter valid Instagram URL'),
  productName: z.string().min(2, 'Product name required').max(100),
  category: z.string().min(1, 'Category required'),
  price: z.number().optional(),
  triggerWord: z.string().min(1).default('interested'),
});

export const updateLeadSchema = z.object({
  status:     z.enum(['NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'FOLLOW_UP']).optional(),
  notes:      z.string().max(500).optional(),
  saleAmount: z.number().positive().optional().nullable(),
});

export const campaignSchema = z.object({
  templateType: z.enum(['FESTIVAL_OFFER', 'BRIDAL_OFFER', 'GOLD_RATE_DROP', 'NEW_COLLECTION']),
});

export const settingsSchema = z.object({
  shopName:            z.string().min(2).max(100).optional(),
  ownerName:           z.string().min(2).max(100).optional(),
  phone:               z.string().regex(/^[6-9]\d{9}$/).optional(),
  city:                z.string().max(100).optional(),
  instagramUserId:     z.string().optional(),
  instagramAccessToken:z.string().optional(),
  waPhoneNumberId:     z.string().optional(),
  waAccessToken:       z.string().optional(),
  waBusinessId:        z.string().optional(),
});
