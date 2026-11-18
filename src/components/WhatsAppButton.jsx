import React from 'react';

const WHATSAPP_NUMBER = '7874050009';
const WHATSAPP_URL = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Hotel Shree Daan, I would like to inquire about a booking.')}`;

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span className="floating-whatsapp-pulse" aria-hidden="true"></span>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.06 16.27C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.87 13.59C14.65 13.51 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.52 13.52 14.69C13.38 14.85 13.23 14.88 12.98 14.75C12.73 14.63 11.93 14.36 10.98 13.52C10.24 12.86 9.74 12.05 9.6 11.8C9.45 11.55 9.58 11.42 9.71 11.29C9.82 11.18 9.95 11.01 10.08 10.86C10.2 10.71 10.25 10.61 10.33 10.44C10.41 10.27 10.37 10.13 10.31 10C10.25 9.88 9.75 8.65 9.55 8.14C9.35 7.65 9.14 7.71 8.98 7.71C8.83 7.7 8.66 7.7 8.49 7.7C8.32 7.7 8.05 7.76 7.82 8.01C7.59 8.26 6.95 8.86 6.95 10.08C6.95 11.3 7.84 12.48 7.97 12.65C8.09 12.81 9.72 15.33 12.21 16.4C12.8 16.66 13.26 16.81 13.62 16.93C14.22 17.12 14.76 17.09 15.19 17.03C15.67 16.96 16.67 16.42 16.88 15.84C17.08 15.26 17.08 14.76 17.02 14.65C16.96 14.54 16.82 14.51 16.57 14.39Z" />
      </svg>
      <span className="floating-whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
