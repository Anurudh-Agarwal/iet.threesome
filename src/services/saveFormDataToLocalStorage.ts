import { FormData } from "@/types";
import { getCurrentRollNo } from "@/utils/getCurrentRollNo";

export const saveFormDataToLocalStorage = (formData: FormData): void => {
  if (typeof window === "undefined") return;

  const roll_no = getCurrentRollNo();
  localStorage.setItem(roll_no, JSON.stringify(formData));
};
