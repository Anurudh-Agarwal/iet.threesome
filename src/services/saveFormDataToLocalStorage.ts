import { FormData } from "@/types";

export const saveFormDataToLocalStorage = async(roll_no: string, formData: FormData): Promise<void> => {
  if (typeof window === "undefined") return;

  localStorage.setItem(roll_no, JSON.stringify(formData));
};
