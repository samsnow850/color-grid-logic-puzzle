
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Share2, Copy, Check, Twitter } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog = ({ open, onOpenChange }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };
  
  const handleShareToTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=I'm playing Color Grid Logic! Join me at&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterShareUrl, "_blank");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Game
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input 
            readOnly 
            value={shareUrl} 
            className="flex-1"
          />
          <Button 
            size="icon" 
            variant={copied ? "default" : "outline"} 
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="w-full sm:w-auto flex gap-2 items-center"
            onClick={handleShareToTwitter}
          >
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
