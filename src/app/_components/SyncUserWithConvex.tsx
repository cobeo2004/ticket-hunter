"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";

function SyncUserWithConvex() {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);
  React.useEffect(() => {
    if (!user) return;
    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: user.fullName ?? "",
          email: user.emailAddresses[0].emailAddress ?? "",
        });
      } catch (error) {
        console.error("Error syncing user with Convex: ", error);
      }
    };
    syncUser();
  }, [user, updateUser]);
  return <></>;
}

export default SyncUserWithConvex;
