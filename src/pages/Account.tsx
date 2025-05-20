
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean | null;
}

const Account = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    async function getProfile() {
      try {
        setProfileLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    }

    getProfile();
  }, [user, loading, navigate]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="animate-pulse text-xl">Loading account...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">View and manage your account information</p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile?.display_name || "Profile"} />
                  ) : (
                    <AvatarFallback className="text-xl">{getInitials(profile?.display_name)}</AvatarFallback>
                  )}
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-medium">{profile?.display_name || "User"}</h3>
                  {profile?.bio && (
                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                  )}
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate("/settings")}
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p>{user?.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Account Created</h3>
                  <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Leaderboard Visibility</h3>
                  <p>{profile?.leaderboard_opt_in ? "Visible on leaderboard" : "Hidden from leaderboard"}</p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/settings")}
                    className="w-full"
                  >
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
