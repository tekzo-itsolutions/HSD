import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const timer = setTimeout(() => {
        const tabsNav = document.querySelector('.spa-tabs-nav');
        if (pathname.includes('spa-details') && tabsNav) {
          const offset = 85;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = tabsNav.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: Math.max(0, elementPosition - offset),
            behavior: 'smooth'
          });
          return;
        }

        const element = document.getElementById(id);
        if (element) {
          const offset = 85;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: Math.max(0, elementPosition - offset),
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
    // Otherwise, scroll to top on page change
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
