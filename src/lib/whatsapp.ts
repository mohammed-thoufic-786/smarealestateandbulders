import { whatsappLink } from "./business-config";

export function openWhatsApp(message: string): void {
  const href = whatsappLink(message);
  const popup = window.open(href, "_blank");

  if (popup) {
    popup.opener = null;
    return;
  }

  window.location.assign(href);
}
