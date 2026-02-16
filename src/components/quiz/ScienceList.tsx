"use client";

import Image from "next/image";

const sources = [
  { name: "World Health Organization (WHO)", logo: "/images/icons/organisation-who.png" },
  { name: "PubMed", logo: "/images/icons/organisation-pubmed.png" },
  { name: "The American Journal of Clinical Nutrition", logo: "/images/icons/organisation-tajocn.png" },
  { name: "National Center for Biotechnology Information (NCBI)", logo: "/images/icons/organisation-ncbi.png" },
  { name: "WebMD", logo: "/images/icons/organisation-webmd.png" },
  { name: "Medscape", logo: "/images/icons/organisation-medscape.png" },
];

export function ScienceList() {
  return (
    <div className="max-w-lg mx-auto">
      <p className="text-center text-gray-600 mb-6">
        Our recommendations are informed by trusted global and clinical health sources:
      </p>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {sources.map((source) => (
          <div key={source.name} className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 last:border-b-0">
            <span className="text-xs sm:text-sm font-medium text-gray-800">{source.name}</span>
            <div className="relative w-12 h-10 flex-shrink-0 ml-4">
              <Image
                src={source.logo}
                alt={source.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
