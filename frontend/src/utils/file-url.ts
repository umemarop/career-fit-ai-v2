const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getPublicFileUrl(fileUrl: string | null): string | null {
  if (!fileUrl) {
    return null;
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  if (!API_URL) {
    return fileUrl;
  }

  const apiUrl = new URL(API_URL);
  const serverOrigin = apiUrl.origin;

  const normalizedFileUrl = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;

  return `${serverOrigin}${normalizedFileUrl}`;
}
