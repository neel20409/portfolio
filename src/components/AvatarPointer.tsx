"use client";

import React from "react";
import { FollowerPointerCard } from "./ui/following-pointer";

interface AvatarPointerProps {
  children: React.ReactNode;
}

export function AvatarPointer({ children }: AvatarPointerProps) {
  return (
    <FollowerPointerCard
      title={
        <TitleComponent
          title="Neel Bhatt"
          avatar="/neel.png" // Ensure this image exists in your public folder
        />
      }
    >
      {/* This wrapper ensures the pointer tracks over the full area */}
      <div className="relative w-full h-full">
        {children}
      </div>
    </FollowerPointerCard>
  );
}

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-2xl">
    <img
      src={avatar}
      height="24"
      width="24"
      alt="Neel"
      className="rounded-full border border-blue-500 object-cover"
    />
    <p className="text-white text-[11px] font-bold tracking-wider uppercase">
      {title}
    </p>
  </div>
);