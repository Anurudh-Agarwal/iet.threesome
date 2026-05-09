"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { saveFormDataToLocalStorage } from "@/services/saveFormDataToLocalStorage";
import { saveFormDataToSupabase } from "@/services/saveFormDataToSupabase";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { type RamanujanStudent, type FormData } from "@/types";
import { useEffect } from "react";

const priorityFormSchema = z
  .object({
    p1: z.string().min(1, "Priority 1 is required"),
    p2: z.string().min(1, "Priority 2 is required"),
    p3: z.string().min(1, "Priority 3 is required"),
    p4: z.string().min(1, "Priority 4 is required"),
  })
  .refine((data) => new Set([data.p1, data.p2, data.p3, data.p4]).size === 4, {
    message: "All priorities must be different students",
    path: ["p4"],
  });

type PriorityFormValues = z.infer<typeof priorityFormSchema>;

interface PriorityFormProps {
  students: RamanujanStudent[];
}

const PRIORITIES = [
  { name: "p1", label: "Priority 1" },
  { name: "p2", label: "Priority 2" },
  { name: "p3", label: "Priority 3" },
  { name: "p4", label: "Priority 4" },
] as const;

export const PriorityForm = ({ students }: PriorityFormProps) => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const form = useForm<PriorityFormValues>({
    resolver: zodResolver(priorityFormSchema),
    defaultValues: { p1: "", p2: "", p3: "", p4: "" },
  });

  useEffect(() => {
    const savedData = getFormDataFromLocalStorage();
    if (!savedData) return;
    form.reset(savedData);
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    const savedData = getFormDataFromLocalStorage();
    if (!savedData) return;
    saveFormDataToSupabase(savedData);
  }, [isSignedIn]);

  const onSubmit = async (values: PriorityFormValues) => {
    const formData: FormData = values;
    saveFormDataToLocalStorage(formData);
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    await saveFormDataToSupabase(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {PRIORITIES.map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.roll_no} value={student.roll_no}>
                        {student.name} — {student.branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
