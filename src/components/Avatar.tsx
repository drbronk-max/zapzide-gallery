export function Avatar({
  npub,
  picture,
  name,
}: {
  npub: string;
  picture?: string;
  name?: string;
}) {
  if (!picture) return null;

  return (
    <a
      className="avatar"
      href={`https://njump.to/${npub}`}
      target="_blank"
      rel="noreferrer"
      title={name}
    >
      <img src={picture} alt={name || "avatar"} />
    </a>
  );
}
