import { useEffect, useState } from 'react';
import adminFaviconImage from 'figma:asset/99273e927721dde3c28053d1d770fc5ca66146d4.png';
import clientFaviconImage from 'figma:asset/e333d4109ffb720fd166b42f827befb945e189f1.png';

export default function Favicon() {
  // Use hash to determine if admin route (no react-router needed)
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const hash = window.location.hash;
    return hash.startsWith('#/admin');
  });

  useEffect(() => {
    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      setIsAdminRoute(hash.startsWith('#/admin'));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Choose favicon based on route
    const faviconImage = isAdminRoute ? adminFaviconImage : clientFaviconImage;
    const title = isAdminRoute ? '#fAdmin' : 'Banka výhodných nabídek | MONETA Bank';

    // Update favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconImage;

    // Update apple-touch-icon
    let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.href = faviconImage;

    // Update title
    document.title = title;
  }, [isAdminRoute]);

  return null;
}
