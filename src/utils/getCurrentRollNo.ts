"use client";

import { useUser } from "@clerk/nextjs";

export const getCurrentRollNo = () => {
  const { user } = useUser();
  const roll_no = user?.publicMetadata?.roll_no as string;
  return roll_no;
};
