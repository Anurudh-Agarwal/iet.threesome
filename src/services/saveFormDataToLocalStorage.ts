import { FormData } from "@/types";

export const saveFormDataToLocalStorage = (roll_no: string, formData: FormData): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(roll_no, JSON.stringify(formData));
};
