/** Builders for tap-to-call, WhatsApp and map links — derived from site.config only. */

export function telHref(e164: string) {
  return `tel:${e164}`;
}

export function whatsappHref(number: string, message?: string) {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${query}`;
}

export function formatAddress(address: {
  line: string;
  locality: string;
  city: string;
  pincode: string;
}) {
  return [address.line, address.locality, `${address.city} ${address.pincode}`]
    .filter(Boolean)
    .join(", ");
}
