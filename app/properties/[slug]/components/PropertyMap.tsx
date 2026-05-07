interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  mapUrl?: string | null;
  title: string;
  address?: string | null;
  city: string;
}

export function PropertyMap({ latitude, longitude, mapUrl, title, address, city }: PropertyMapProps) {
  

  const resolvedMapUrl = mapUrl || `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3697.7120739549896!2d79.84245807463981!3d6.9229203183936585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTUnMjIuNSJOIDc5wrA1MCc0Mi4xIkU`;

  return (
    <div>
      <h2 className="text-xl font-semibold">Location</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border">
        <iframe
          src={resolvedMapUrl}
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
