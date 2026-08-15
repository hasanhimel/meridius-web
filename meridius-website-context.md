# Meridius Website — Context

This is the full brief. Read it before writing anything. Everything below is either locked copy (use verbatim), or design direction (follow the reasoning, not just the hex codes).

---

## 1. What Meridius Actually Is

Meridius is a native macOS AI agent that runs your computer for you, without ever touching your screen. It opens a second, invisible display, one your Mac actually renders, not a cloud VM, not a background process pretending to be invisible. Your real apps open there, fully logged in, fully native. Meridius clicks, types, and navigates them. Your own screen and cursor never move. You can keep working the entire time, or talk to it out loud while it works.

That's the whole company in one idea: **a second display, not a trick.**

Every other computer-use tool on the market solves part of this and breaks somewhere else:
- **Codex Computer Use** avoids hijacking your cursor, but macOS occasionally forces the app it's controlling to the foreground anyway, on top of your work.
- **Claude Computer Use (via Cowork)** takes your entire screen and cursor outright. You watch it work or you wait.
- **Coasty** solved isolation by moving the task to a cloud VM, but that means it's not your machine, not your logged-in apps, not your real environment.
- **Hermes Agent (via cua-driver)** keeps the app backgrounded using undocumented macOS system calls, which can break on any OS update, and still runs on your one real display.

Meridius is the only one that gets both: a genuinely separate display, and it's still your Mac, your real apps, your real logins.

---

## 2. The One Thing The Site Has To Communicate

**Not** "AI agent." **Not** "productivity tool." One specific, physical fact:

> There are two displays. You only ever see one. Meridius lives on the other one.

If a visitor doesn't understand that within 3 seconds of landing, the site has failed, regardless of how it looks. This is a hardware-level separation, not a metaphor, and the design should make that concrete rather than abstract.

---

## 3. Locked Copy — Use Verbatim

### 50-character description
```
Computer-using AI that never touches your screen
```

### Product description (long form)
```
Meridius is a native Mac app that gives your computer a second display,
one your own Mac renders and fully controls, completely separate from
the screen in front of you. Meridius opens your real apps there and
clicks, types, and navigates them exactly like you would, while your
actual screen and cursor stay completely free.

You can talk to it like a person. It listens, remembers context from
earlier conversations, and handles tasks the moment you ask, without
you opening an app or writing a prompt.

It can also run on models hosted on your own machine, so nothing has
to leave your computer if you don't want it to.

Next, we're building Meridius Sync: multiple people's Meridius
instances working on the same shared project, each running locally on
its own machine, coordinating automatically, whether that's two
co-founders or an entire company running on a shared brain.
```

### Founder video script (for reference / possible embed)
```
Hi YC, I'm Himel, a computer science senior, and I'm building Meridius.
It's an AI that runs your Mac for you, without ever touching your screen.

Most AI tools like this take over your screen while they work. Meridius
doesn't. It works on a second screen your Mac makes just for it, so your
screen stays free and you keep working the whole time.

I built it alone in ten days, code, design, all of it. Now I need speed:
people who've done this before, and the money to move faster than I can
alone.

See you in San Francisco.
```

### Founder line
```
Himel Hasan — Founder & CEO. CS senior, Dhaka. Built the first working
Meridius prototype alone in 10 days.
```

### Proof point (only use if you want a proof/traction section — optional, keep it small if used)
```
58 people tested Meridius hands-on. 53 said yes immediately, including
someone who already pays for a competing tool and wants to switch.
```

---

## 4. Design Direction

### Ground the concept first
The subject is not "AI startup." The subject is **a second, hidden display running in parallel with the one you're looking at.** Every design decision should come from that fact, not from generic AI-product visual language. Avoid: warm cream + serif + terracotta, near-black + single neon accent with no conceptual reason for it, broadsheet/newspaper layouts. Those are defaults. This brief has a real, physical, literal thing to visualize, use it.

### Signature element: "The Ghost Layer"
The one thing this page should be remembered for: **a second, offset, semi-transparent layer of UI sitting slightly behind the real one, throughout the page.** Not just in the hero, everywhere. Buttons, screenshots, even body copy blocks can have a faint duplicate ghosted a few pixels behind them, like the page itself has two displays. This is the literal product concept turned into a design language, not decoration for its own sake.

Hero treatment: a real macOS window (Safari, Notes, whatever) sits in the foreground, sharp, fully interactive-looking. Behind and slightly offset, a second, blurred/ghosted version of a different app window sits in a darker plane, implying it's on the other display, working, while the foreground stays untouched. This should be the first thing anyone sees.

### Token system

**Color** (named, not generic):
- `--void: #0B0D10` — the base background. Not pure black. This is "the screen you're not looking at."
- `--surface: #14171C` — foreground panel/card background, one step up from void.
- `--foreground: #E8EAED` — primary text, soft white, not stark.
- `--ghost: #3A4048` — the offset/ghosted layer color. Desaturated, low-contrast, literally represents "the other display."
- `--signal: #5B8CFF` — a cool, electric blue. This is the one accent color, used sparingly, representing the second display "glowing" faintly. Not the generic near-black+acid-green combo, this blue is chosen specifically because it reads as a monitor glow in a dark room, tied directly to the product concept.
- `--signal-dim: #5B8CFF` at 15% opacity — used for the ghost layer's edge glow only.

**Type**:
- Display face: **Söhne** or **General Sans** (geometric, precise, slightly technical without being a coding font). Used at large sizes with tight tracking for headlines.
- Body face: **Inter** at moderate weight, comfortable line-height. Neutral, readable, gets out of the way.
- Utility/data face: **JetBrains Mono** or **IBM Plex Mono**, used only for small labels, the "second display" indicator text, or any technical annotation, reinforcing the systems-level, precise feel without going full "hacker terminal."

**Layout concept** (ASCII):
```
┌─────────────────────────────────────┐
│  [nav: wordmark]      [CTA: small]   │
├─────────────────────────────────────┤
│                                       │
│   HERO: two-plane visual              │
│   ┌──────────┐                        │
│   │ real app │  ┄┄┄┐ ghosted app     │
│   │ (sharp)  │     │ (offset, blur)  │
│   └──────────┘     └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌  │
│                                       │
│   "Computer-using AI that never       │
│    touches your screen."              │
│                                       │
├─────────────────────────────────────┤
│  Section: How it actually works       │
│  (short, 3 beats, not a feature grid) │
├─────────────────────────────────────┤
│  Section: Why not just [competitor]   │
│  (one honest paragraph, no logos)     │
├─────────────────────────────────────┤
│  Founder line + CTA                   │
└─────────────────────────────────────┘
```

Keep it to one long scroll. No mega-nav, no pricing table yet (there's no live product to sell), no testimonial carousel (don't fabricate social proof). This is a pre-launch page for a solo founder, it should read as confident and minimal, not like it's compensating with sections it doesn't have content for.

### Motion
One orchestrated moment, not scattered effects: on load, the ghosted background window should very subtly drift, a slow, almost imperceptible float, like something is actually running back there. That's it. No scroll-jacking, no parallax overload. Respect `prefers-reduced-motion`.

### What to avoid
- No stock illustrations of robots, brains, or circuit boards.
- No gradient-mesh backgrounds.
- No "trusted by" logo row (you don't have customers yet, don't fake it).
- No generic feature-grid with icon + 3-word title + 1-sentence description × 6. If you list features, make it 3 beats max, written as sentences, not a grid.
- No emoji in headings.

---

## 5. Starter Code

This is a working starting point implementing the token system and the hero's two-plane concept. Plain HTML/CSS, no framework needed for a single page, drop into a Vite or plain static project and deploy to Vercel.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Meridius — Computer-using AI that never touches your screen</title>
<style>
  :root {
    --void: #0B0D10;
    --surface: #14171C;
    --foreground: #E8EAED;
    --ghost: #3A4048;
    --signal: #5B8CFF;
    --signal-dim: rgba(91, 140, 255, 0.15);
    --font-display: 'General Sans', 'Söhne', -apple-system, sans-serif;
    --font-body: 'Inter', -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--void);
    color: var(--foreground);
    font-family: var(--font-body);
    line-height: 1.6;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 48px;
    font-family: var(--font-mono);
    font-size: 14px;
    letter-spacing: 0.02em;
  }

  .nav-cta {
    border: 1px solid var(--ghost);
    padding: 8px 16px;
    border-radius: 4px;
    color: var(--foreground);
    text-decoration: none;
    transition: border-color 0.2s ease;
  }
  .nav-cta:hover { border-color: var(--signal); }

  .hero {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px;
    position: relative;
  }

  /* Two-plane visual: real window sharp in front, ghost window offset behind */
  .plane-wrap {
    position: relative;
    width: 100%;
    max-width: 720px;
    height: 340px;
    margin-bottom: 56px;
  }

  .window {
    position: absolute;
    border-radius: 10px;
    border: 1px solid var(--ghost);
    overflow: hidden;
  }

  .window-real {
    width: 480px;
    height: 300px;
    left: 50%;
    top: 20px;
    transform: translateX(-65%);
    background: var(--surface);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    z-index: 2;
  }

  .window-ghost {
    width: 480px;
    height: 300px;
    left: 50%;
    top: 60px;
    transform: translateX(-35%);
    background: var(--surface);
    opacity: 0.35;
    filter: blur(1.5px);
    border-color: var(--signal-dim);
    box-shadow: 0 0 40px var(--signal-dim);
    z-index: 1;
    animation: drift 8s ease-in-out infinite;
  }

  @keyframes drift {
    0%, 100% { transform: translateX(-35%) translateY(0px); }
    50% { transform: translateX(-35%) translateY(-6px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .window-ghost { animation: none; }
  }

  .window-titlebar {
    height: 32px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--ghost);
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 6px;
  }

  .dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--ghost);
  }

  .ghost-label {
    position: absolute;
    left: 50%;
    top: 60px;
    transform: translateX(-35%);
    margin-top: 310px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--signal);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 600;
    letter-spacing: -0.02em;
    max-width: 780px;
    line-height: 1.15;
  }

  .subhead {
    margin-top: 20px;
    font-size: 18px;
    color: var(--ghost);
    max-width: 560px;
  }

  .cta-row {
    margin-top: 40px;
    display: flex;
    gap: 16px;
  }

  .cta-primary {
    background: var(--signal);
    color: var(--void);
    padding: 14px 28px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 15px;
  }

  section {
    max-width: 680px;
    margin: 0 auto;
    padding: 96px 24px;
  }

  section h2 {
    font-family: var(--font-display);
    font-size: 28px;
    margin-bottom: 24px;
  }

  section p {
    color: #B4B8BE;
    font-size: 16px;
  }

  footer {
    text-align: center;
    padding: 64px 24px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--ghost);
  }
</style>
</head>
<body>

<nav>
  <span>MERIDIUS</span>
  <a href="#" class="nav-cta">See you in San Francisco</a>
</nav>

<div class="hero">
  <div class="plane-wrap">
    <div class="window window-real">
      <div class="window-titlebar">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>
    <div class="window window-ghost">
      <div class="window-titlebar">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
      </div>
    </div>
    <div class="ghost-label">running on the other display</div>
  </div>

  <h1>Computer-using AI that never touches your screen.</h1>
  <p class="subhead">
    Meridius runs your Mac on a second display it creates just for it.
    Your screen stays yours. It gets the work done.
  </p>

  <div class="cta-row">
    <a href="#" class="cta-primary">Join the waitlist</a>
  </div>
</div>

<section>
  <h2>There are two displays. You only see one.</h2>
  <p>
    Meridius opens your real apps, Safari, Notes, Finder, on a second
    display your own Mac renders. Not a cloud VM. Not a browser tab.
    A real, separate display. It clicks, types, and gets work done there
    while your screen and your cursor stay exactly where you left them.
  </p>
</section>

<footer>
  Built by Himel Hasan · Dhaka → San Francisco
</footer>

</body>
</html>
```

This is intentionally minimal, one section beyond the hero. Expand section 2 (how it works) and section 3 (why not X) using the copy in Section 3 of this doc, but keep the whole page to one scroll if possible. Don't add sections just to fill space.

---

## 6. Fonts To Actually License/Load

- General Sans → free, via Fontshare (fontshare.com), embeddable.
- Inter → free, Google Fonts.
- JetBrains Mono → free, Google Fonts / JetBrains directly.

All three are free for commercial use, no budget needed.

---

## 7. Deployment

Static HTML/CSS, no backend needed for v1. Push to a GitHub repo, connect to Vercel, deploy. Free tier covers this entirely. Domain (meridiusai.com) can be pointed at it later without touching the code.
