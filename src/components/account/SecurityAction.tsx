
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import HCaptcha from "@/components/auth/HCaptcha";

interface SecurityActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  requireVerification?: boolean;
  onAction: () => Promise<void>;
}

const SecurityAction = ({
  title,
  description,
  buttonText,
  buttonVariant = "default",
  requireVerification = false,
  onAction
}: SecurityActionProps) => {
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(requireVerification);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };
  
  const handleCaptchaExpire = () => {
    setCaptchaToken("");
    toast.warning("Captcha expired. Please verify again.");
  };

  const handleCaptchaError = () => {
    toast.error("Captcha error. Please try again.");
  };

  const handleClick = async () => {
    if (requireVerification && !captchaToken) {
      setNeedsVerification(true);
      return;
    }
    
    try {
      setLoading(true);
      await onAction();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Action failed. Please try again.");
    } finally {
      setLoading(false);
      setCaptchaToken("");
      setNeedsVerification(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {needsVerification && (
        <div className="my-4">
          <p className="text-sm text-muted-foreground mb-2">Please verify that you are human:</p>
          <HCaptcha 
            onVerify={handleCaptchaVerify}
            onExpire={handleCaptchaExpire}
            onError={handleCaptchaError}
          />
        </div>
      )}
      
      <Button 
        variant={buttonVariant} 
        onClick={handleClick}
        disabled={loading || (needsVerification && !captchaToken)}
      >
        {loading ? "Processing..." : buttonText}
      </Button>
    </div>
  );
};

export default SecurityAction;
