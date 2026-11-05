import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { getLenis } from '../motion';
import { NavMark } from '../brand/NavMark';
import { AccessForm } from './AccessForm';

export interface AccessDialogHandle {
  open: () => void;
}

/**
 * The early-access form in a modal, so the top buttons never send the
 * visitor away from where they are. A native <dialog>: focus is trapped,
 * Escape closes it, and the page behind is blurred and stops scrolling.
 */
export const AccessDialog = forwardRef<AccessDialogHandle>(function AccessDialog(_, ref) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const close = () => dialog.current?.close();

  useImperativeHandle(ref, () => ({
    open() {
      const d = dialog.current;
      if (!d || d.open) return;
      d.showModal();
      getLenis()?.stop();
      document.documentElement.classList.add('m-locked');
      window.setTimeout(() => input.current?.focus(), 60);
    },
  }));

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => {
      getLenis()?.start();
      document.documentElement.classList.remove('m-locked');
    };
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <dialog
      ref={dialog}
      className="m-dialog"
      aria-labelledby="access-dialog-title"
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="m-dialog__card">
        <button type="button" className="m-dialog__close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <NavMark size={36} tone="dark" />
        <h2 id="access-dialog-title">Request early access</h2>
        <p className="m-dialog__lead">Meridius is opening to a small group on macOS first. Leave your email and we’ll write when your seat is ready.</p>
        <AccessForm ref={input} compact />
      </div>
    </dialog>
  );
});
