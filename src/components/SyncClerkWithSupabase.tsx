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

      if (!email) return;

      if (isUserAllowed(email)) {
        await syncUserProfile(user.id);
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
