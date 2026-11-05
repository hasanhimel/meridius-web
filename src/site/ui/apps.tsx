/**
 * App icons used across the site: the macOS icons from the hero animation
 * (public/icons/apps). They share one silhouette, size and logo scale; Docs,
 * Drive and Chrome are built on the same silhouette from their official
 * logos. Each file carries macOS's transparent margin (the tile is 80% of the
 * canvas), so AppMark draws the image 25% larger than its slot: the visible
 * tile is exactly `size` across, wherever it appears.
 */
export const APPS = {
  gmail: { name: 'Gmail', src: '/icons/apps/gmail.png' },
  slack: { name: 'Slack', src: '/icons/apps/slack.png' },
  notion: { name: 'Notion', src: '/icons/apps/notion.png' },
  calendar: { name: 'Google Calendar', src: '/icons/apps/calendar.png' },
  docs: { name: 'Google Docs', src: '/icons/apps/docs.png' },
  drive: { name: 'Google Drive', src: '/icons/apps/drive.png' },
  figma: { name: 'Figma', src: '/icons/apps/figma.png' },
  chrome: { name: 'Google Chrome', src: '/icons/apps/chrome.png' },
  vscode: { name: 'Visual Studio Code', src: '/icons/apps/vscode.png' },
  finder: { name: 'Finder', src: '/icons/apps/finder.png' },
  zoom: { name: 'Zoom', src: '/icons/apps/zoom.png' },
  terminal: { name: 'Terminal', src: '/icons/apps/terminal.png' },
} as const;

export type AppId = keyof typeof APPS;

/**
 * `size` in px draws a fixed-size icon. Without it the icon fills its parent
 * (a square box sized in em), so it scales with the demo stages.
 */
export function AppMark({ id, size, className }: { id: AppId; size?: number; className?: string }) {
  const style =
    size === undefined
      ? { width: '125%', height: '125%', maxWidth: 'none', margin: '-12.5%', objectFit: 'contain' as const, display: 'block' }
      : { width: size * 1.25, height: size * 1.25, maxWidth: 'none', margin: -size * 0.125, objectFit: 'contain' as const, display: 'inline-block', flex: 'none' };
  return <img className={className} src={APPS[id].src} alt="" draggable={false} decoding="async" style={style} />;
}
