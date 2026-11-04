import { faq } from '../content';
import { ChevronIcon } from '../ui/icons';

export function Faq() {
  return (
    <section id="faq" className="m-section m-wrap m-faq" data-section aria-labelledby="faq-title">
      <h2 id="faq-title" className="m-h2" data-reveal="words">
        {faq.heading}
      </h2>
      <div data-reveal>
        {faq.items.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>
              {item.q}
              <ChevronIcon />
            </summary>
            <p className="m-faq__a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
