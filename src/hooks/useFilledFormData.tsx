"use client";

import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";

export const useFilledFormData = () => {
  const data = getFormDataFromLocalStorage();
  return data;
};
