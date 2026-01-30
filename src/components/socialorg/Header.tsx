"use client";

import { useState, useEffect } from "react";
import { getMe } from "@/services/auth.service";

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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white sticky top-0 h-16 px-6 z-10">
      <h1 className="text-gray-900 text-lg font-bold leading-tight"></h1>
      <div className="flex items-center gap-4">
        <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></div>
        </button>

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