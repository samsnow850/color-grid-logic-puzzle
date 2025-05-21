
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);
  
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view this page");
      navigate("/auth");
      return;
    }
    
    async function getProfile() {
      try {
        setLoading(true);
        
        // Get profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
          setLeaderboardOptIn(data.leaderboard_opt_in !== false); // Default to true if null
        }
      } catch (error: any) {
        console.error("Error fetching profile: ", error);
        toast.error(error.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [user, navigate]);
  
  async function updateProfile() {
    try {
      setSaving(true);
      
      if (!user) throw new Error("No user logged in");
      
      // Check if profile exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // Prepare update data
      const updates = {
        id: user.id,
        display_name: displayName,
        bio: bio,
        avatar_url: avatarUrl,
        leaderboard_opt_in: leaderboardOptIn,
        updated_at: new Date().toISOString(),
      };
      
      let error;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
          
        error = updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ ...updates, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile: ", error);
      toast.error(error.error_description || error.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Profile</h1>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="How do you want to be known?"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Tell us about yourself" 
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input 
                id="avatar" 
                value={avatarUrl} 
                onChange={(e) => setAvatarUrl(e.target.value)} 
                placeholder="https://example.com/your-image.jpg"
              />
              {avatarUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="leaderboardOptIn"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <Label htmlFor="leaderboardOptIn">Show me on leaderboards</Label>
            </div>
            
            <Button 
              className="w-full md:w-auto" 
              onClick={updateProfile} 
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
