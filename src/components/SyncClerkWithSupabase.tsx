"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { syncUserProfile } from "@/services/syncUserProfile";
import { isUserAllowed } from "@/services/isUserAllowed";
import UnallowedEmailErrorDialog from "./UnallowedEmailErrorDialog";

const SyncClerkWithSupabase = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const sync = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      const roll_no = email?.split("@")[0];

      if (!email || !roll_no) return;

      if (isUserAllowed(email)) {
        await syncUserProfile(user.id, roll_no);
      } else {
        setShowPopup(true);

        try {
          await user?.delete();
        } finally {
          await signOut();
        }
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <UnallowedEmailErrorDialog
      open={showPopup}
      onClose={() => setShowPopup(false)}
    />
  );
};

export default SyncClerkWithSupabase;
