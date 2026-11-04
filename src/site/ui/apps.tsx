/**
 * App marks shown on the page: each app's current official logo, served from
 * /public/logos (Wikimedia Commons, public-domain files). `full` marks are
 * complete macOS icons with their own tile; the rest are logos that sit on a
 * white tile wherever a tile is drawn.
 */
export const APPS = {
  gmail: { name: 'Gmail', src: '/logos/gmail.svg', full: false },
  slack: { name: 'Slack', src: '/logos/slack.svg', full: false },
  notion: { name: 'Notion', src: '/logos/notion.svg', full: false },
  calendar: { name: 'Google Calendar', src: '/logos/calendar.svg', full: false },
  docs: { name: 'Google Docs', src: '/logos/docs.svg', full: false },
  drive: { name: 'Google Drive', src: '/logos/drive.svg', full: false },
  figma: { name: 'Figma', src: '/logos/figma.svg', full: false },
  chrome: { name: 'Google Chrome', src: '/logos/chrome.svg', full: false },
  finder: { name: 'Finder', src: '/logos/finder.png', full: true },
} as const;

export type AppId = keyof typeof APPS;

export function AppMark({ id, size = 20, className }: { id: AppId; size?: number; className?: string }) {
  const app = APPS[id];
  return (
    <img
      className={className}
      src={app.src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block', flex: 'none' }}
    />
  );
}
