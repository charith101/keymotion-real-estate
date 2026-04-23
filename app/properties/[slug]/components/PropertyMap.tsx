interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  title: string;
}

export function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  if (!latitude || !longitude) return null;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=15`;

  return (
    <div>
      <h2 className="text-xl font-semibold">Location</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${title}`}
        />
      </div>
    </div>
  );
}
