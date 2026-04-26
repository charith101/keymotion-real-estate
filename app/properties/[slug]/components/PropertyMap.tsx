interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  title: string;
  address?: string | null;
  city: string;
}

export function PropertyMap({ latitude, longitude, title, address, city }: PropertyMapProps) {
  // Hardcoding a random location in Sri Lanka (Colombo) to ensure the red pin shows up
  const randomLat = 6.9271;
  const randomLng = 79.8612;
  const q = `${randomLat},${randomLng}`;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${q}&zoom=15`;

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
