import { AppIcon } from '../brand/AppIcon';
import { BOOK_CALL_URL, CONTACT_EMAIL } from '../../config';

export function Footer({ onRequest }: { onRequest: () => void }) {
  const year = new Date().getFullYear();
  return (
    <footer className="m-footer">
      <div className="m-wrap">
        <div className="m-footer__top">
          <div>
            <span className="m-footer__brand">
              <AppIcon size={26} />
              Meridius
            </span>
            <p className="m-footer__about">The Mac companion that remembers what matters and does the work.</p>
          </div>
          <nav aria-label="Product">
            <h3>Product</h3>
            <ul>
              <li><a href="#capabilities">Capabilities</a></li>
              <li><a href="#display">How it works</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h3>Company</h3>
            <ul>
              <li><a href={BOOK_CALL_URL}>Book a call</a></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>Contact</a></li>
            </ul>
          </nav>
          <nav aria-label="Get started">
            <h3>Get started</h3>
            <ul>
              <li>
                <button type="button" onClick={onRequest}>
                  Request early access
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="m-footer__base">
          <span>© {year} Meridius. All rights reserved.</span>
          <span>Made for macOS</span>
        </div>
      </div>
    </footer>
  );
}
