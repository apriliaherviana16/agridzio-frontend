"use client";

import Link from 'next/link';
import { MapPin, Tag, DollarSign } from 'lucide-react';

/**
 * A single advertisement card used throughout the application.  
 *
 * The card is clickable and navigates to the ad’s detail page. It shows
 * the title, truncated description, price, location and optional category
 * with intuitive icons. On hover the card lifts slightly to indicate
 * interactivity.
 */
export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  category?: string | null;
}

export default function AdCard({ ad }: { ad: Ad }) {
  return (
    <Link
      href={`/ads/${ad.id}`}
      className="block border border-neutral-dark rounded-xl bg-white shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-primary-dark">
          {ad.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {ad.description}
        </p>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="flex items-center gap-1 rtl:flex-row-reverse text-primary font-medium">
            <DollarSign className="w-4 h-4 stroke-2" />
            دج {Number(ad.price).toLocaleString()}
          </span>
          <span className="flex items-center gap-1 rtl:flex-row-reverse text-gray-500">
            <MapPin className="w-4 h-4" />
            {ad.location}
          </span>
        </div>
        {ad.category && (
          <div className="flex items-center gap-1 rtl:flex-row-reverse text-xs text-secondary mt-1">
            <Tag className="w-4 h-4" />
            {ad.category}
          </div>
        )}
      </div>
    </Link>
  );
}