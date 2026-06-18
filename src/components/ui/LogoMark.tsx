import Image from 'next/image';

interface Props {
  className?: string;
}

export function LogoMark({ className = 'w-12 h-12' }: Props) {
  return (
    <Image
      src="/bahia-palace-icon.svg"
      alt="Bahia Palace Marrakech"
      width={160}
      height={160}
      className={className}
    />
  );
}
