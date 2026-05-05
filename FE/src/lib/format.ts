export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDimensions(width: number, height: number): string {
  return `${width} x ${height}px`;
}

export function imageMimeType(format: string): string {
  if (format === "jpg") {
    return "image/jpeg";
  }

  return `image/${format}`;
}
