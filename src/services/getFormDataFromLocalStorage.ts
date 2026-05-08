import { getCurrentRollNo } from "@/utils/getCurrentRollNo";
import { FormData } from "@/types";

const getFormDataFromLocalStorage = (): FormData | null => {
  const roll_no = getCurrentRollNo();
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(roll_no);
  if (!data) return null;
  return JSON.parse(data) as FormData;
};

export default getFormDataFromLocalStorage;
