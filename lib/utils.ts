import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dataURLtoBlob = (dataUrl: string) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
};

export const getCategoryEmoji = (name: string) => {
  const lowerName = name.toLowerCase();

  if (
    lowerName.includes("food") ||
    lowerName.includes("groceries") ||
    lowerName.includes("restaurant")
  )
    return "🍕";
  if (
    lowerName.includes("transport") ||
    lowerName.includes("car") ||
    lowerName.includes("fuel")
  )
    return "🚗";
  if (
    lowerName.includes("entertainment") ||
    lowerName.includes("movie") ||
    lowerName.includes("fun")
  )
    return "🎮";
  if (
    lowerName.includes("health") ||
    lowerName.includes("medical") ||
    lowerName.includes("doctor")
  )
    return "💊";
  if (lowerName.includes("shopping") || lowerName.includes("clothes"))
    return "🛍️";
  if (lowerName.includes("education") || lowerName.includes("book"))
    return "📚";
  if (lowerName.includes("electric") || lowerName.includes("electronic"))
    return "🔌";
  if (
    lowerName.includes("home") ||
    lowerName.includes("rent") ||
    lowerName.includes("utilities")
  )
    return "🏠";
  if (lowerName.includes("savings") || lowerName.includes("investment"))
    return "💰";
  if (lowerName.includes("gift") || lowerName.includes("donation")) return "🎁";
  if (lowerName.includes("travel") || lowerName.includes("vacation"))
    return "✈️";
  if (lowerName.includes("phone") || lowerName.includes("internet"))
    return "📱";
  if (lowerName.includes("gym") || lowerName.includes("fitness")) return "💪";

  const defaultEmojis = ["💫", "⭐", "🌟", "✨", "🎯", "🎪", "🎨", "🌈"];
  return defaultEmojis[Math.abs(name.length) % defaultEmojis.length];
};

export function timeSince(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(seconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function getCssHslGradient(hsl: string): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);

  if (!match) return "";

  const [_, h, s, l] = match;
  const hue = h;
  const sat = s;
  const light = Number(l);
  const lighter = Math.min(light + 15, 95);

  return `linear-gradient(to bottom right, hsl(${hue},${sat}%,${light}%), hsl(${hue},${sat}%,${lighter}%))`;
}
