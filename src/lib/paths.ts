export function withBasePath(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const relativePath = path.replace(/^\//, "");

  return relativePath ? `${base}/${relativePath}` : `${base}/`;
}
