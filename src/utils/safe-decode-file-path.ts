// react-grab reports Next.js app-router paths percent-encoded ("%28routes%29",
// "%5Bslug%5D"); the encoded form does not exist on disk, so an agent given it
// verbatim fails to find the file.
export const safeDecodeFilePath = (filePath: string): string => {
  if (!filePath.includes("%")) return filePath;
  try {
    return decodeURIComponent(filePath);
  } catch {
    return filePath;
  }
};
