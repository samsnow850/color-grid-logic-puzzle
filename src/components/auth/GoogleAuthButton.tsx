
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define Google API types
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAuthButtonProps {
  buttonType: "signin_with" | "signup_with";
  onSuccess?: () => void;
}

// Google Identity Services API initialization options
interface GoogleInitOptions {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

const GOOGLE_CLIENT_ID = "631765203877-09ko5kuh9gnufa2dcl595ip4q4ll1da9.apps.googleusercontent.com";

const GoogleAuthButton = ({ buttonType, onSuccess }: GoogleAuthButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Clean up
      return () => {
        document.body.removeChild(script);
      };
    }
    
    // Initialize Google Sign-In when script is loaded or already available
    const initializeGoogleButton = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
          auto_select: false,
          cancel_on_tap_outside: true,
        } as GoogleInitOptions);
        
        // Render the button
        if (buttonRef.current) {
          window.google.accounts.id.renderButton(
            buttonRef.current,
            { theme: "outline", size: "large", text: buttonType, width: 280 }
          );
        }
      } else {
        // If not available yet, try again in a moment
        setTimeout(initializeGoogleButton, 100);
      }
    };
    
    initializeGoogleButton();
  }, [buttonType]);

  const handleGoogleSignIn = async (response: GoogleCredentialResponse) => {
    try {
      if (response.credential) {
        // The redirect will be handled by Supabase based on settings in the Supabase dashboard
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
          options: {
            redirectTo: 'https://color-grid-logic-puzzle.lovable.app/account'
          } as any // Type assertion to bypass TypeScript checking for now
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in with Google successfully!");
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return <div ref={buttonRef} className="google-signin-button"></div>;
};

export default GoogleAuthButton;
