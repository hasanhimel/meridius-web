/**
 * Outbound links for the marketing site. Kept in one place so they can be
 * swapped without touching components.
 *
 * TODO(founder): replace BOOK_CALL_URL with the real Cal.com / Calendly link
 * and confirm CONTACT_EMAIL before launch.
 */
export const CONTACT_EMAIL = 'hello@meridiusai.com';

export const BOOK_CALL_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Call with the Meridius founder'
)}&body=${encodeURIComponent(
  "Hi Himel,\n\nI'd like to talk about Meridius. A few times that work for me:\n\n- \n- \n\nThanks,"
)}`;
