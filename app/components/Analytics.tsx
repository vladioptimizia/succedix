'use client';

import { useEffect } from 'react';

declare global {
      interface Window {
              dataLayer: any[];
              gtag: (...args: any[]) => void;
              fbq: (...args: any[]) => void;
      }
}

export default function Analytics() {
      useEffect(() => {
              // Initialize GA4
              const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
              if (ga4Id && typeof window !== 'undefined') {
                        // Load GA4 script
                        const script = document.createElement('script');
                        script.async = true;
                        script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
                        document.head.appendChild(script);
                  
                        // Initialize gtag
                        window.dataLayer = window.dataLayer || [];
                        function gtag(...args: any[]) {
                                    window.dataLayer.push(args);
                        }
                        gtag('js', new Date());
                        gtag('config', ga4Id);
                        window.gtag = gtag;
              }
          
              // Initialize Meta Pixel
              const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
              if (pixelId && typeof window !== 'undefined') {
                        window.fbq =
                                    window.fbq ||
                                    function (...args: any[]) {
                                                  (window.fbq as any).q = (window.fbq as any).q || [];
                                                  ((window.fbq as any).q as any[]).push(args);
                                    };
                        window.fbq('init', pixelId);
                        window.fbq('track', 'PageView');
                  
                        // Load Meta Pixel script
                        const fbscript = document.createElement('script');
                        fbscript.async = true;
                        fbscript.src = 'https://connect.facebook.net/en_US/fbevents.js';
                        document.head.appendChild(fbscript);
              }
          
              // Track page views on route change
              const handleRouteChange = () => {
                        if (window.gtag) {
                                    window.gtag('event', 'page_view', {
                                                  page_path: window.location.pathname,
                                    });
                        }
                        if (window.fbq) {
                                    window.fbq('track', 'PageView');
                        }
              };
          
              window.addEventListener('popstate', handleRouteChange);
              return () => {
                        window.removeEventListener('popstate', handleRouteChange);
              };
      }, []);
    
      return null;
}'use client';

import { useEffect } from 'react';

export default function Analytics() {
    useEffect(() => {
          // Initialize GA4
                  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
          if (ga4Id && typeof window !== 'undefined') {
                  // Load GA4 script
            const script = document.createElement('script');
                  script.async = true;
                  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
                  document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
                  function gtag() {
                            window.dataLayer.push(arguments);
                  }
                  gtag('js', new Date());
                  gtag('config', ga4Id);
                  window.gtag = gtag;
          }

                  // Initialize Meta Pixel
                  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
          if (pixelId && typeof window !== 'undefined') {
                  window.fbq =
                            window.fbq ||
                            function () {
                                        (window.fbq.q = window.fbq.q || []).push(arguments);
                            };
                  window.fbq.push(['init', pixelId]);
                  window.fbq('track', 'PageView');

            // Load Meta Pixel script
            const fbscript = document.createElement('script');
                  fbscript.async = true;
                  fbscript.src = 'https://connect.facebook.net/en_US/fbevents.js';
                  document.head.appendChild(fbscript);
          }

                  // Track page views on route change
                  const handleRouteChange = () => {
                          if (window.gtag) {
                                    window.gtag('event', 'page_view', {
                                                page_path: window.location.pathname,
                                    });
                          }
                          if (window.fbq) {
                                    window.fbq('track', 'PageView');
                          }
                  };

                  window.addEventListener('popstate', handleRouteChange);
          return () => {
                  window.removeEventListener('popstate', handleRouteChange);
          };
    }, []);

  return null;
}
