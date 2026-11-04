/**
 * Copy deck for the Meridius landing page.
 *
 * Kept short on purpose: one idea per section. Claims follow the accuracy
 * rules in meridius-product-vison-and-architecture.md — capabilities are what
 * Meridius is designed to do, roadmap items are labelled as roadmap, and no
 * customers, quotes or statistics are invented. Names, courses and times in
 * the product shots are illustrative.
 */

export const nav = [
  { label: 'How it works', href: '#how' },
  { label: 'Recall', href: '#recall' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'FAQ', href: '#faq' },
];

export const hero = {
  title: ['AI that remembers', 'and does the work'],
  sentence:
    'Meridius is a Mac companion that understands what you see and hear, keeps track of what you promised, and gets it done without taking over your screen.',
  primary: 'Request early access',
  secondary: 'Book a call',
};

export const how = {
  heading: ['How Meridius helps', 'every day'],
  notice: {
    title: ['Meridius', 'notices', 'what you commit to'],
    body: 'It reads your screen and listens when you allow it, so the deadline you scrolled past in a channel is not forgotten.',
  },
  act: {
    title: ['When it’s time, Meridius', 'does the work'],
    body: 'It gathers files, drafts and fills in forms in a display of its own, then asks before anything important.',
  },
};

export interface Moment {
  time: string;
  app: string;
  what: string;
}

export const recall = {
  heading: ['Ask about anything', 'you’ve seen'],
  sentence: 'A private timeline of your screen and audio, searchable in plain words.',
  questions: [
    {
      q: 'What was I looking at yesterday around 3 PM?',
      answer: 'You were in Figma on the onboarding screens, then replied to a message about the flight on the 21st.',
      moments: [
        { time: '2:58 PM', app: 'Figma', what: 'Onboarding screens, frame “Welcome 2”' },
        { time: '3:16 PM', app: 'Messages', what: 'Question about the flight on the 21st' },
      ],
    },
    {
      q: 'Who promised me the logo files?',
      answer: 'Ayaan, in yesterday’s weekly sync. He said Monday.',
      moments: [
        { time: '11:58 AM', app: 'Zoom', what: 'Weekly sync: “I’ll send the logo files Monday”' },
        { time: '12:04 PM', app: 'Slack', what: 'Ayaan shared a folder link in #brand' },
      ],
    },
    {
      q: 'Where did I see the Problem Set 4 deadline?',
      answer: 'In three places. All agree: Friday, 11:59 PM.',
      moments: [
        { time: 'Mon 10:14 AM', app: 'Slack', what: 'Announcement in #cs-201' },
        { time: 'Tue 8:30 AM', app: 'Mail', what: 'Email from the course instructor' },
        { time: 'Wed 9:02 PM', app: 'Docs', what: 'Course doc: submit one PDF' },
      ],
    },
  ] as { q: string; answer: string; moments: Moment[] }[],
};

export const calm = {
  heading: ['Built to stay', 'out of your way'],
  sentence: 'Meridius works next to you, never on top of you.',
  cards: [
    { lead: 'Its own display.', body: 'It works in a virtual display, so your cursor, keyboard and focus stay yours.' },
    { lead: 'Asks first.', body: 'Nothing is sent, submitted or deleted without your OK.' },
    { lead: 'Checks its work.', body: 'Every task ends with proof: the file exists, the tests pass, the receipt is saved.' },
  ],
  apps: 'Sees any app on your screen. Connects to these for more.',
};

export const privacy = {
  heading: 'Private by design',
  rows: [
    { big: 'Local', title: 'Stored on your Mac', body: 'Your timeline and memory live in a local database, not on our servers.' },
    { big: 'Never', title: 'Excluded means excluded', body: 'An app you exclude is never captured, not captured and hidden.' },
    { big: 'Yours', title: 'You choose the model', body: 'Run a local model, or a hosted one when a task needs it. Only the relevant pieces are sent.' },
  ],
};

export const faq = {
  heading: 'Frequently asked questions',
  items: [
    {
      q: 'What is Meridius?',
      a: 'A Mac companion that understands what you see and hear, remembers what you committed to, and does the work in a virtual display of its own.',
    },
    {
      q: 'How is it different from a chatbot or an AI agent?',
      a: 'Most assistants wait for a prompt and only know what you paste in or connect. Meridius learns from your screen, notices what needs doing, prepares it, asks you, does it, and checks the result.',
    },
    {
      q: 'Does it take control of my mouse and keyboard?',
      a: 'No. Meridius works in its own virtual display. A small floating mirror shows what it’s doing, and you can close it while the work carries on.',
    },
    {
      q: 'Where is my data stored?',
      a: 'On your Mac. When you use a hosted model, only the pieces a task needs are sent to that provider. With a local model, nothing leaves your Mac. You can pause, review and delete at any time.',
    },
    {
      q: 'Does it need integrations to work?',
      a: 'No. Meridius understands any app it can see. Integrations like Gmail, Slack and Notion add detail and help it confirm what it saw.',
    },
    {
      q: 'When can I use it?',
      a: 'Meridius is in early access for macOS. Request a seat and we’ll write when yours opens. Windows, Linux and mobile are on the roadmap.',
    },
  ],
};

export const closing = {
  title: 'The Mac companion that remembers.',
  sub: 'Request early access today.',
  placeholder: 'you@email.com',
  button: 'Request access',
  call: 'Prefer to talk first?',
  callLink: 'Book a call',
};
