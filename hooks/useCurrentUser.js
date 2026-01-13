"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useCurrentUser = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && isMounted) {
          setProfile(snap.data());
        } else if (isMounted) {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        if (isMounted) setProfile(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    user,
    profile,
    loading,
    isUser: !!user && profile?.role === "user",
  };
};
