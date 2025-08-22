export default function DestinationCard({ destination, onAddToCart, onImageError }) {
  return (
    <div className="bg-white w-[270px] h-96 shadow rounded-sm overflow-hidden flex-shrink-0">
      <img
        src={Array.isArray(destination.imageUrls) ? destination.imageUrls[0] : destination.imageUrls}
        alt={destination.title}
        onError={onImageError}
        className="w-full h-48 object-cover p-2"
      />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-volkhov text-blueBlack text-ellipsis overflow-hidden whitespace-nowrap">{destination.title}</h3>
        <p className="text-sm text-gray-600">{destination.city}</p>
        <p className="text-sm text-gray-600">Rate: {destination.rating}</p>
        <p className="text-sm text-gray-600">{destination.total_reviews} reviews</p>
        <div className="flex justify-between">
            <p className="mt-1 font-semibold text-yellow-600">
            Rp {destination.price.toLocaleString()}
            </p>

            {onAddToCart && (
            <button
                onClick={() => onAddToCart(destination.id)}
                className="mt-auto bg-teal hover:bg-teal/80 text-white text-sm py-2 px-4 rounded"
            >
                Add to Cart
            </button>
            )}
        </div>
      </div>
    </div>
  )
}
