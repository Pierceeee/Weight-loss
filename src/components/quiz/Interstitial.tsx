"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

interface InterstitialProps {
  title: string;
  description: string;
  highlight?: string;
  image?: string;
  benefits?: string[];
  imageStyle?: "rectangular" | "circular";
}

export function Interstitial({
  title,
  description,
  highlight,
  image,
  benefits,
  imageStyle = "rectangular",
}: InterstitialProps) {
  const defaultBenefits = [
    "Balance hormones",
    "Boost metabolism",
    "Reduce cravings",
    "Increase weight loss",
  ];
  const displayBenefits = benefits || (highlight ? defaultBenefits : undefined);

  const isCircular = imageStyle === "circular" || (!highlight && !displayBenefits);

  return (
    <div className="max-w-sm mx-auto py-2">
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        {image && isCircular && (
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {image && !isCircular && (
          <div className="relative w-full h-52 sm:h-64 mb-4 rounded-xl overflow-hidden bg-gray-50/50">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-2"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h2>

        <p className="text-[15px] text-gray-700 mb-4 leading-relaxed">
          {description}
        </p>

        {displayBenefits && (
          <div className="mb-4 w-full">
            {displayBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 py-1"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 text-left">{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {highlight && (
          <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl w-full border border-pink-100">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-pink-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900 text-left">
              {highlight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
