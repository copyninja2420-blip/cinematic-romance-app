import { whatsappReaction } from "@/content/loveStory";

export function WhatsAppReaction() {
  const href = `https://wa.me/${whatsappReaction.phoneNumber}?text=${encodeURIComponent(whatsappReaction.message)}`;
  return (
    <div className="flex flex-col items-center gap-2 px-6 pt-4 text-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-auto items-center justify-center rounded-full border border-rose-soft/40 bg-gradient-to-r from-rose-glow/80 via-primary to-rose-glow/80 px-7 py-3 font-display text-base text-primary-foreground shadow-[0_0_24px_oklch(0.76_0.14_12/40%)] transition-transform active:scale-95"
      >
        {whatsappReaction.label}
      </a>
      <p className="font-display text-xs text-warm/60 italic">{whatsappReaction.subtext}</p>
    </div>
  );
}
