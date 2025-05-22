
import { useEffect, useRef } from "react";

interface HCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err: any) => void;
  sitekey?: string;
}

declare global {
  interface Window {
    hcaptcha: any;
    onHcaptchaLoad: () => void;
  }
}

const HCaptcha = ({ 
  onVerify, 
  onExpire, 
  onError,
  sitekey = "5fb00a28-363c-43a6-b4e2-8fde90a40c3a" // Default sitekey
}: HCaptchaProps) => {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Load hCaptcha script if not already loaded
    if (!document.querySelector('script[src*="hcaptcha"]')) {
      const script = document.createElement('script');
      script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      
      // Add onload callback
      window.onHcaptchaLoad = () => {
        if (captchaRef.current && window.hcaptcha) {
          widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
            sitekey,
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
            theme: 'light',
            size: 'normal'
          });
        }
      };
      
      script.onload = window.onHcaptchaLoad;
      document.head.appendChild(script);
    } else if (window.hcaptcha && captchaRef.current) {
      // If script is already loaded, render captcha
      widgetIdRef.current = window.hcaptcha.render(captchaRef.current, {
        sitekey,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
        theme: 'light',
        size: 'normal'
      });
    }

    // Clean up on unmount
    return () => {
      if (window.hcaptcha && widgetIdRef.current !== null) {
        window.hcaptcha.reset(widgetIdRef.current);
        window.hcaptcha.remove(widgetIdRef.current);
      }
    };
  }, [onVerify, onExpire, onError, sitekey]);

  return <div ref={captchaRef} className="h-captcha mb-4"></div>;
};

export default HCaptcha;
