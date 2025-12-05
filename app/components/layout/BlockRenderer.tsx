"use client";
import React from "react";
import CardSlider from "../ui/CardSlider";
import PhotoStack from "../ui/PhotoStack";
import SocialLinks from "../ui/SocialLinks";

interface BlockRendererProps {
  block: any;
}


function normalize(str) {
  const parts = str.split(/(?=[A-Z])/);

  const last = parts[parts.length - 1];

  return last.toLowerCase();
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  if (!block) return null;

  const t = normalize(block.__typename);

  switch (t) {
    case "card_slider":
      // block.cards is expected to be an array of { title, image }
      return <CardSlider cards={block.cards || []} />;
    case "photo_stack":
      // block.images is expected to be an array of image URLs/paths
      return <PhotoStack images={block.images || []} />;
    case "social_links":
      // block.links is expected to be an array of { icon, url }
      return <SocialLinks links={block.links || []} />;
    default:
      return null;
  }
}
