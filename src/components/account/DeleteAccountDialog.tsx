
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HCaptcha from "@/components/auth/HCaptcha";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSignOut: () => Promise<void>;
}

const DeleteAccountDialog = ({
  open,
  onOpenChange,
  userId,
  onSignOut
}: DeleteAccountDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

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

  const deleteAccount = async () => {
    if (!captchaToken) {
      toast.error("Please complete the captcha verification.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { 
          user_id: userId,
          captchaToken
        }
      });
      
      if (error) throw error;
      
      await onSignOut();
      navigate("/");
      toast.success("Your account has been deleted");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>All your data will be permanently removed, including:</p>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
            <li>Your profile information</li>
            <li>Your game progress and scores</li>
            <li>Your saved preferences</li>
          </ul>
          
          <div className="my-4">
            <p className="text-sm font-medium mb-2">Please verify that you are human:</p>
            <HCaptcha 
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
              onError={handleCaptchaError}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={deleteAccount}
            disabled={loading || !captchaToken}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
