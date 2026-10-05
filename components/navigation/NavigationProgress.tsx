'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, route navigation has finished
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Simulate smooth progress bar progression while route is loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating && progress < 85) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) return prev;
          const increment = Math.max(1, (85 - prev) * 0.15);
          return Math.min(85, prev + increment);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isNavigating, progress]);

  // Intercept all link clicks for instant 0ms visual feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignore right clicks or clicks with modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, hashes, downloads
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // Check if navigating to a different page
      const currentUrl = window.location.pathname + window.location.search;
      const targetUrl = href;

      if (currentUrl !== targetUrl && !targetUrl.startsWith('#')) {
        setIsNavigating(true);
        setProgress(28);
      }
    };

    const handlePopState = () => {
      setIsNavigating(true);
      setProgress(40);
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-gold via-gold-hi to-gold transition-all ease-out shadow-[0_0_12px_rgba(200,169,107,0.85)]"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '200ms' : '250ms',
          opacity: progress === 100 ? 0.7 : 1,
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <React.Suspense fallback={null}>
      <NavigationProgressContent />
    </React.Suspense>
  );
}
