import Image from 'next/image';

interface Props {
  className?: string;
}

export function LogoMark({ className = 'w-12 h-12' }: Props) {
  return (
    <Image
      src="/images/logo-bahia-palace.png"
      alt="Bahia Palace logo"
      width={48}
      height={48}
      className={`object-contain rounded-full ${className}`}
      priority
    />
  );
}
