
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

const GOOGLE_CLIENT_ID = "631765203877-09ko5kuh9gnufa2dcl595ip4q4ll1da9.apps.googleusercontent.com";

const GoogleAuthButton = ({ buttonType, onSuccess }: GoogleAuthButtonProps) => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Initialize Google Sign-In when script is loaded
    const initializeGoogleButton = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        
        // Render the button directly using Google's method
        if (buttonContainerRef.current) {
          // Clear previous content
          buttonContainerRef.current.innerHTML = '';
          
          // Create a div for Google's button
          const buttonElement = document.createElement('div');
          buttonContainerRef.current.appendChild(buttonElement);
          
          // Use Google's renderButton method
          window.google.accounts.id.renderButton(
            buttonElement,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: buttonType,
              width: buttonContainerRef.current.offsetWidth,
              logo_alignment: 'left'
            }
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

  return <div ref={buttonContainerRef} className="google-signin-button w-full h-10"></div>;
};

export default GoogleAuthButton;
