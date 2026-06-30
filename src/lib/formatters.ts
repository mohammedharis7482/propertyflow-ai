export function safeText(
  value: string | number | null | undefined,
  fallback = "Not available"
) {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();
  const normalized = text.toLowerCase();

  if (!text || normalized === "null" || normalized === "undefined") {
    return fallback;
  }

  return text;
}

export function formatEnumLabel(value: string | null | undefined) {
  return safeText(value, "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatNumber(value: string | number | null | undefined) {
  const numeric =
    typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""));

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(numeric);
}

export function formatPrice(
  price: string | number | null | undefined,
  currency = "AED"
) {
  if (price === null || price === undefined || price === "") {
    return "Price on request";
  }

  return `${safeText(currency, "AED")} ${formatNumber(price)}`;
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Date pending";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return safeText(value, "Date pending");
  }

  return Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(value: string | null | undefined) {
  if (!value) {
    return "Time pending";
  }

  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(date.getTime())) {
    return safeText(value, "Time pending");
  }

  return Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return safeText(value, "Recently");
  }

  return Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
