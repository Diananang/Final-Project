import { useState } from "react";
import { Link } from "react-router-dom";

export default function DestinationCard({ destination, onAddToCart, onImageError, isDetailPage = false }) {

  return (
    <div className="bg-white w-full sm:w-[250px] md:w-[280px] lg:w-[300px] shadow rounded-sm overflow-hidden flex-shrink-0">
      <img
        src={Array.isArray(destination.imageUrls) ? destination.imageUrls[0] : destination.imageUrls}
        alt={destination.title}
        onError={onImageError}
        className="w-full h-48 object-cover"
      />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-volkhov text-blueBlack truncate">
          {destination.title}
        </h3>
        <p className="text-sm text-gray-600">{destination.city}</p>
        <p className="text-sm text-gray-600">Rate: {destination.rating}</p>
        <p className="text-sm text-gray-600">{destination.total_reviews} reviews</p>
        <div className="flex justify-between items-center">
          <p className="mt-1 font-semibold text-yellow-600">
            Rp {destination.price?.toLocaleString()}
          </p>
          {!isDetailPage ? (
            <Link
              to={`/detail-destination/${destination.id}`}
              className="bg-teal hover:bg-teal/80 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded"
            >
              Detail
            </Link>
          ) : (
            <button
              onClick={() => onAddToCart(destination.id)}
              className="bg-teal hover:bg-teal/80 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
