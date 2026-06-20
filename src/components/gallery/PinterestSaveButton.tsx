'use client';

interface Props {
  pageUrl: string;
  imageUrl: string;
  description: string;
  className?: string;
}

export function PinterestSaveButton({ pageUrl, imageUrl, description, className = '' }: Props) {
  const href =
    'https://www.pinterest.com/pin/create/button/' +
    `?url=${encodeURIComponent(pageUrl)}` +
    `&media=${encodeURIComponent(imageUrl)}` +
    `&description=${encodeURIComponent(description)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Save to Pinterest"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 bg-[#E60023] hover:bg-[#cc001f] text-white text-[10px] font-bold leading-none px-2 py-1.5 rounded-full shadow-sm pinterest-badge ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.374 0 12c0 5.082 3.162 9.424 7.624 11.172-.105-.946-.2-2.399.042-3.434.218-.934 1.406-5.957 1.406-5.957s-.359-.716-.359-1.778c0-1.665.966-2.909 2.168-2.909 1.022 0 1.517.768 1.517 1.688 0 1.029-.656 2.567-.993 3.992-.282 1.191.598 2.164 1.775 2.164 2.13 0 3.768-2.245 3.768-5.487 0-2.869-2.062-4.878-5.006-4.878-3.41 0-5.412 2.559-5.412 5.204 0 1.029.396 2.133.891 2.735.098.119.112.223.083.344l-.332 1.358c-.053.22-.173.266-.4.16-1.497-.696-2.432-2.882-2.432-4.641 0-3.781 2.746-7.254 7.921-7.254 4.159 0 7.391 2.964 7.391 6.925 0 4.13-2.604 7.452-6.219 7.452-1.215 0-2.358-.631-2.748-1.374l-.748 2.849c-.271 1.041-1.002 2.347-1.492 3.143C9.57 23.81 10.763 24 12 24c6.626 0 12-5.374 12-12S18.626 0 12 0z" />
      </svg>
      Save
    </a>
  );
}
