import { NavMark } from '../brand/NavMark';
import { Wordmark } from '../brand/Wordmark';
import { hero } from '../content';
import { Sky } from '../sections/Hero';
import { MacStory } from '../ui/MacStory';
import '../site.css';
import './og.css';

/**
 * The 1200 x 630 link-preview card (public/og.png), built from the hero's own
 * parts so it stays on-brand: the noon sky, the nav lockup, the headline, a
 * shortened hero sentence and the top of the MacBook. Open /og.html in the dev
 * server with reduced motion emulated (MacStory then shows its designed still)
 * and capture the 1200 x 630 viewport.
 */

/** The hero sentence up to "gets it done", which fits two lines at card size. */
const SENTENCE = `${hero.sentence.split(' in a display')[0]}.`;

export function OgCard() {
  return (
    <div className="m-site og">
      <section className="m-hero og-card">
        <Sky />
        <div className="og-brand">
          <NavMark size={34} tone="light" />
          <Wordmark height={17} className="m-wordmark" />
        </div>
        <h1 className="m-hero__title og-title">
          {hero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="m-hero__sentence og-sentence">{SENTENCE}</p>
        <div className="og-shot">
          <MacStory />
        </div>
      </section>
    </div>
  );
}
