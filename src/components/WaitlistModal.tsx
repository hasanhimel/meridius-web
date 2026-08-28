import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check, Loader2 } from 'lucide-react';
import { joinWaitlist } from '../lib/supabase';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'throwawaymail.com',
  '10minutemail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'trashmail.com',
]);

function isDisposableEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(parts[1].trim());
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap field
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    // 1. Anti-bot honeypot defense (if bot filled the hidden field, silently fake success)
    if (honeypot.trim().length > 0) {
      setIsSubmitted(true);
      return;
    }

    // 2. Submission cooldown throttle (5 seconds)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      setErrorMsg('Please wait a few seconds before submitting again.');
      return;
    }
    setLastSubmitTime(now);

    // 3. Block disposable spam email domains
    if (isDisposableEmail(email)) {
      setErrorMsg('Please use a valid company or personal email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const result = await joinWaitlist({
      email: email.trim(),
      name: name.trim() || undefined,
      company: company.trim() || undefined
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(result.error || 'Failed to submit. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/30 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl frosted-glass p-8 shadow-2xl z-10 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-muted dark:text-cream-dim hover:text-charcoal dark:hover:text-cream transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
              Early Access
            </div>

            <h3 className="font-display font-semibold text-2xl text-charcoal dark:text-cream mb-2">
              Join the Waitlist
            </h3>
            <p className="text-sm text-charcoal-muted dark:text-cream-muted leading-relaxed mb-6 font-sans">
              We are onboarding users in weekly batches. Native macOS app with parallel execution and zero screen takeovers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Invisible Honeypot Field for Spam Bot Protection */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="b_company_verification">Leave this field blank</label>
                <input
                  type="text"
                  id="b_company_verification"
                  name="b_company_verification"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-charcoal-muted dark:text-cream-dim mb-1.5">
                  Work Email <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl frosted-glass-pill text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 text-sm focus:outline-none focus:border-charcoal/40 dark:focus:border-cream/30 transition-colors font-sans"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-charcoal-muted dark:text-cream-dim mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl frosted-glass-pill text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 text-sm focus:outline-none focus:border-charcoal/40 dark:focus:border-cream/30 transition-colors font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-charcoal-muted dark:text-cream-dim mb-1.5">
                    Company / Role
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Acme · Founder"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl frosted-glass-pill text-charcoal dark:text-cream placeholder-charcoal-muted/60 dark:placeholder-cream-muted/60 text-sm focus:outline-none focus:border-charcoal/40 dark:focus:border-cream/30 transition-colors font-sans"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-500 font-mono py-1">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-btn-primary w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Join the Waitlist</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-charcoal/10 dark:bg-cream/10 border border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>

            <h3 className="font-display font-semibold text-xl text-charcoal dark:text-cream">
              You're on the list
            </h3>

            <p className="text-sm text-charcoal-muted dark:text-cream-muted font-sans max-w-xs mx-auto">
              We'll send download instructions to <span className="text-charcoal dark:text-cream font-mono font-semibold">{email}</span> when your batch is ready.
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="cursor-btn-secondary px-5 py-2 rounded-full text-xs font-sans"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
