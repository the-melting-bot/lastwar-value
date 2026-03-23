import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * Attribution link to The Melting Bot — matches portfolio badge styling.
 */
export default function MeltingBotBadge() {
  return (
    <a
      href="https://themeltingbot.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`${orbitron.className} inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[#00F0FF] bg-[#1A1A1A] px-[14px] py-2 pr-[18px] text-[11px] font-medium tracking-[0.06em] text-[#E8E8E8] no-underline shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-[#33f3ff] hover:shadow-[0_0_16px_rgba(0,240,255,0.25),0_0_4px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060D18]`}
      aria-label="Built by The Melting Bot (opens in new tab)"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="0"
          stroke="#7B61FF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="0" r="1.5" fill="#7B61FF" />
        <rect
          x="1"
          y="3"
          width="22"
          height="16"
          rx="4"
          stroke="#00F0FF"
          strokeWidth="1.8"
          fill="none"
        />
        <circle cx="8" cy="10" r="2.5" fill="#00F0FF" />
        <circle cx="16" cy="10" r="2.5" fill="#00F0FF" />
        <circle cx="8" cy="10" r="1" fill="#0D0D0D" />
        <circle cx="16" cy="10" r="1" fill="#0D0D0D" />
        <path
          d="M6 15 Q12 19 18 15"
          stroke="#00F0FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M5 19 L5 24 Q5 26 7 26"
          stroke="#7B61FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M11 19 L11 27 Q11 29 13 29 Q15 29 15 27 L15 23"
          stroke="#7B61FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M19 19 L19 23 Q19 25 21 25"
          stroke="#7B61FF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <span>Built by The Melting Bot</span>
    </a>
  );
}
