interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Description</h2>
      <div className="mt-4 prose prose-sm max-w-none text-muted-foreground">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
