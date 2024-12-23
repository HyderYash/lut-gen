// Comprehensive analytics tracking for LUT Generator Pro

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      'page_path': path
    });
  }
};

// User Interaction Tracking
export const event = (type:string, w:string, method: string) => {
      // @ts-ignore
  trackEvent(type, w, method);
};
