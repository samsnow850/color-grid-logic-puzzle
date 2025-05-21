
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
    
    // Initialize Google Sign-In when script is loaded or already available
    const initializeGoogleButton = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        
        // Render the button
        if (buttonContainerRef.current) {
          // Clear previous content
          buttonContainerRef.current.innerHTML = '';
          
          // Create custom Google button
          const customButton = document.createElement('button');
          customButton.className = "flex items-center justify-center gap-2 w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors";
          
          // Handle Google sign-in click without using prompt method
          customButton.onclick = () => {
            if (window.google?.accounts?.id) {
              // Use renderButton method instead of prompt
              window.google.accounts.id.renderButton(
                customButton,
                { theme: 'filled_blue', size: 'large', text: buttonType === 'signin_with' ? 'signin_with' : 'signup_with' }
              );
              
              // Simulate a click to trigger the Google sign-in flow
              setTimeout(() => customButton.click(), 10);
            }
          };
          
          // Create logo image
          const logoImg = document.createElement('img');
          logoImg.src = "https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0.jpg";
          logoImg.className = "w-5 h-5 rounded-full";
          logoImg.alt = "Google logo";
          
          // Create text span
          const textSpan = document.createElement('span');
          textSpan.textContent = buttonType === "signin_with" ? "Sign in with Google" : "Sign up with Google";
          
          // Append elements
          customButton.appendChild(logoImg);
          customButton.appendChild(textSpan);
          buttonContainerRef.current.appendChild(customButton);
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

  return <div ref={buttonContainerRef} className="google-signin-button w-full"></div>;
};

export default GoogleAuthButton;
