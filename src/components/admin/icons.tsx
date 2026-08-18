import type { IconName } from '@/lib/admin/nav'

/**
 * Hand-drawn line icons.
 *
 * An icon set would be a dependency and a bundle for eight glyphs; these are
 * stroke paths on a shared 24-grid, so they weigh nothing and match each other.
 */
const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5',
  inbox: 'M3 13h5l1.5 3h5L16 13h5M3 13 5.5 5h13L21 13v6H3z',
  catalog: 'M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z',
  question: 'M9.2 9a2.8 2.8 0 1 1 3.6 2.7c-.5.2-.8.7-.8 1.3v.5M12 17h.01M4 4h16v16H4z',
  photo: 'M4 5h16v14H4zM4 15l4.5-4.5 4 4L15.5 11 20 15',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l4.5 4.5',
  phone: 'M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
  user: 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM4.5 20a7.5 7.5 0 0 1 15 0',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5.5l3.5 2',
  blocks: 'M4 5h16v5H4zM4 13h7v6H4zM13 13h7v6h-7z',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9zM10 18a2 2 0 0 0 4 0',
}

export function Icon({ name, className = 'h-4 w-4' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
