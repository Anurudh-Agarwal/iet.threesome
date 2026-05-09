import { FormData } from "@/types";

const getFormDataFromLocalStorage = (roll_no:string): FormData | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(roll_no);
  if (!data) return null;
  return JSON.parse(data) as FormData;
};

export default getFormDataFromLocalStorage;
