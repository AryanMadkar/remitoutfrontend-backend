// lib/validation.js
import { z } from "zod";

export const studentRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  phoneNumber: z
    .string()
    .min(8, "Phone number too short")
    .max(20, "Phone number too long"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const studentQuestionnaireSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(8).max(20),
    city: z.string().min(1, "City is required"),
    referralCode: z.string().optional().default(""),
    howDidYouFindUs: z.string().min(1, "Please select an option"),
  }),

  courseDetails: z.object({
    targetCountries: z.array(z.string()).default([]),
    degreeTypes: z.array(z.string()).default([]),
    courseDurationMonths: z.number().nullable(),
  }),

  academicDetails: z.object({
    data: z.record(z.any()).optional().default({}),
  }),

  coBorrowerInfo: z.object({
    data: z.record(z.any()).optional().default({}),
  }),

  documentUpload: z.object({
    data: z.record(z.any()).optional().default({}),
  }),
});

export const adminRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const nbfcRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const nbfcLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const consultantRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const consultantLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const consultantStudentInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});
