"use client";

import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { useClerk } from "@clerk/nextjs";

export const useFilledFormData = () => {
    const {user}= useClerk();
    const roll_no = user?.publicMetadata?.roll_no as string;
    if(!roll_no) return;
    const data = getFormDataFromLocalStorage(roll_no);
  return data;
};
