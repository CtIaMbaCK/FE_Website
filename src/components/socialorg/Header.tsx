"use client";

import { useState, useEffect } from "react";
import { getMe } from "@/services/auth.service";
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  const [organizationName, setOrganizationName] = useState("A");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load organization info
    const loadProfile = async () => {
      try {
        const profile = await getMe();
        if (profile?.organizationProfiles) {
          const orgName = profile.organizationProfiles.organizationName || "A";
          setOrganizationName(orgName.charAt(0).toUpperCase());
          setAvatarUrl(profile.organizationProfiles.avatarUrl);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  return (
    <header className="flex items-center justify-end whitespace-nowrap border-b border-solid border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 h-16 px-6 z-20">
      <div className="flex items-center gap-4">
        <NotificationBell />

        {/* Avatar only - no dropdown */}
        <div
          className="bg-gray-200 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-gray-500 font-bold"
          style={
            avatarUrl
              ? { backgroundImage: `url(${avatarUrl})` }
              : undefined
          }
        >
          {!avatarUrl && organizationName}
        </div>
      </div>
    </header>
  );
}