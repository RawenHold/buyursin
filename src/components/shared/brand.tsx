import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link href="/" className={`brand-link ${compact ? "brand-link--compact" : ""} ${inverse ? "brightness-0 invert" : ""}`} aria-label="Buyursin Technics — на главную">
      <Image src="/assets/logo-buyursin.svg" alt="Buyursin Technics" width={188} height={60} priority className="h-auto w-[148px] sm:w-[164px]" />
    </Link>
  );
}
