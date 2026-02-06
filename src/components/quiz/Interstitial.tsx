"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

interface InterstitialProps {
  title: string;
  description: string;
  highlight?: string;
  image?: string;
  benefits?: string[];
}

export function Interstitial({
  title,
  description,
  highlight,
  image,
  benefits,
}: InterstitialProps) {
  // Default benefits for motivation screens
  const defaultBenefits = [
    "Balance hormones",
    "Boost metabolism",
    "Reduce cravings",
    "Increase weight loss",
  ];

  const displayBenefits = benefits || (highlight ? defaultBenefits : undefined);

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto">
      {image && (
        <div className="relative w-full h-48 sm:h-64 mb-6 rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>

      <p className="text-muted-foreground mb-6">{description}</p>

      {displayBenefits && (
        <ul className="text-left space-y-2 mb-6 w-full">
          {displayBenefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      )}

      {highlight && (
        <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl w-full">
          <Heart className="w-8 h-8 text-primary flex-shrink-0" />
          <p className="text-sm font-medium text-foreground">{highlight}</p>
        </div>
      )}
    </div>
  );
}
