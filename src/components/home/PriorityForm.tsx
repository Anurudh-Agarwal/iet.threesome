"use client";

import { useForm, useWatch } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveFormDataToLocalStorage } from "@/services/saveFormDataToLocalStorage";
import { saveFormDataToSupabase } from "@/services/saveFormDataToSupabase";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { type RamanujanStudent, type FormData as PriorityFormData } from "@/types";
import { useEffect, useState } from "react";

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

function StudentCombobox({
  value,
  onChange,
  students,
  placeholder,
  selectedOthers,
}: {
  value: string;
  onChange: (val: string) => void;
  students: RamanujanStudent[];
  placeholder: string;
  selectedOthers: string[];
}) {
  const [open, setOpen] = useState(false);
  const selected = students.find((s) => s.roll_no === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-3/4 justify-between font-normal"
        >
          {selected ? `${selected.name} — ${selected.branch}` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[75vw] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search by name or branch..." />
          <CommandList>
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup>
              {students.map((student) => {
                const isSelectedElsewhere = selectedOthers.includes(student.roll_no);
                return (
                  <CommandItem
                    key={student.roll_no}
                    value={`${student.name} ${student.branch}`}
                    disabled={isSelectedElsewhere}
                    onSelect={() => {
                      onChange(student.roll_no);
                      setOpen(false);
                    }}
                    className={cn(
                      isSelectedElsewhere && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === student.roll_no ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {student.name} — {student.branch}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const PriorityForm = ({ students }: PriorityFormProps) => {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const roll_no = user?.primaryEmailAddress?.emailAddress?.split("@")[0];

  // Filter out the logged-in user from the student list
  const filteredStudents = students.filter((s) => s.roll_no !== roll_no);

  const form = useForm<PriorityFormValues>({
    resolver: zodResolver(priorityFormSchema),
    defaultValues: { p1: "", p2: "", p3: "", p4: "" },
  });

  const watched = useWatch({ control: form.control });

  // Pre-fill form from localStorage
  useEffect(() => {
    const key = roll_no ?? "guest";
    const savedData = getFormDataFromLocalStorage(key);
    if (!savedData) return;
    form.reset({
      p1: savedData.p1.roll_no,
      p2: savedData.p2.roll_no,
      p3: savedData.p3.roll_no,
      p4: savedData.p4.roll_no,
    });
  }, [roll_no]);

  // On sign-in: migrate guest data to roll_no key and sync to Supabase
  useEffect(() => {
    if (!isSignedIn || !roll_no) return;

    const syncOnLogin = async () => {
      const savedData =
        getFormDataFromLocalStorage(roll_no) ??
        getFormDataFromLocalStorage("guest");

      if (!savedData) return;

      saveFormDataToLocalStorage(roll_no, savedData);
      localStorage.removeItem("guest");
      await saveFormDataToSupabase(roll_no, savedData); // no token
    };

    syncOnLogin();
  }, [isSignedIn, roll_no]);

 const onSubmit = async (values: PriorityFormValues) => {
  const formData: PriorityFormData = {
    p1: students.find((s) => s.roll_no === values.p1)!,
    p2: students.find((s) => s.roll_no === values.p2)!,
    p3: students.find((s) => s.roll_no === values.p3)!,
    p4: students.find((s) => s.roll_no === values.p4)!,
  };

  // Not signed in — save to localStorage and prompt login
  if (!isSignedIn) {
    saveFormDataToLocalStorage("guest", formData);
    openSignIn();
    return;
  }

  // Signed in — save to Supabase
  try {
    await saveFormDataToSupabase(roll_no!, formData);
    // Only clear localStorage after successful save
    localStorage.removeItem(roll_no!);
    localStorage.removeItem("guest");
    // Reload page to show ChosenPriorityTable
    window.location.reload();
  } catch (err) {
    console.error("Submit failed:", err);
    alert("Failed to submit. Please try again.");
  }
};

  return (
    <div className="border rounded-2xl p-6 md:p-8 shadow-sm bg-card w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">Submit your priorities</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {PRIORITIES.map(({ name, label }) => {
            const selectedOthers = PRIORITIES.filter((p) => p.name !== name)
              .map((p) => watched[p.name])
              .filter(Boolean) as string[];

            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <StudentCombobox
                        value={field.value}
                        onChange={field.onChange}
                        students={filteredStudents}
                        placeholder={`Select ${label}`}
                        selectedOthers={selectedOthers}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button
            type="submit"
            className="w-3/4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};