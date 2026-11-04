import {
  GmailIcon,
  SlackIcon,
  NotionIcon,
  GoogleCalendarIcon,
  GoogleDocsIcon,
  GoogleDriveIcon,
} from '../../components/mcp/MCPIcons';

/** App marks shown on the page, each in its own brand colour. */
export const APPS = {
  gmail: { name: 'Gmail', Icon: GmailIcon, color: '#EA4335' },
  slack: { name: 'Slack', Icon: SlackIcon, color: '#4A154B' },
  notion: { name: 'Notion', Icon: NotionIcon, color: '#000000' },
  calendar: { name: 'Google Calendar', Icon: GoogleCalendarIcon, color: '#4285F4' },
  docs: { name: 'Google Docs', Icon: GoogleDocsIcon, color: '#4285F4' },
  drive: { name: 'Google Drive', Icon: GoogleDriveIcon, color: '#1FA463' },
} as const;

export type AppId = keyof typeof APPS;

export function AppMark({ id, size = 20 }: { id: AppId; size?: number }) {
  const { Icon, color } = APPS[id];
  return (
    <span style={{ color, display: 'inline-flex' }} aria-hidden="true">
      <Icon size={size} className="" />
    </span>
  );
}
