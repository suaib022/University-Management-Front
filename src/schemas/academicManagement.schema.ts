import { z } from "zod";

export const academicSemesterSchema = z.object({
  name: z.string({ required_error: "Please select Semester name" }),
  year: z.string({ required_error: "Please select a Year" }),
  startMonth: z.string({ required_error: "Please select a Start Month" }),
  endMonth: z.string({ required_error: "Please select an End Month" }),
});
