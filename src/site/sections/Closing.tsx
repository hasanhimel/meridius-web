import { forwardRef } from 'react';
import { closing } from '../content';
import { AccessForm } from '../access/AccessForm';

/**
 * The close of the day: the page opened on a noon sky and ends at dusk, with
 * the early-access form in the middle of it.
 */
export const Closing = forwardRef<HTMLInputElement>(function Closing(_, inputRef) {
  return (
    <section id="access" className="m-closing" data-section aria-labelledby="access-title">
      <div className="m-closing__sky" aria-hidden="true">
        <span className="m-closing__sun" />
      </div>
      <div className="m-wrap m-closing__inner">
        <h2 id="access-title" data-reveal="words">
          {closing.title}
        </h2>
        <p className="m-closing__sub" data-reveal>
          {closing.sub}
        </p>
        <div className="m-closing__form" data-reveal>
          <AccessForm ref={inputRef} />
        </div>
      </div>
    </section>
  );
});
