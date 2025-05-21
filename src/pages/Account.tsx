
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CalendarIcon, 
  Edit2Icon, 
  Trophy, 
  User, 
  Mail,
  Star,
  Award,
  Save
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean | null;
  created_at: string | null;
}

interface GameStat {
  played: number;
  won: number;
  best_time: number | null;
  highest_score: number | null;
}

const Account = () => {
  const { user, session, loading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);
  const [gameStats, setGameStats] = useState<GameStat>({
    played: 0,
    won: 0,
    best_time: null,
    highest_score: null
  });

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
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setLeaderboardOptIn(data.leaderboard_opt_in !== false);
        }
        
        // Mock game stats - in a real app, these would come from the database
        const mockStats = {
          played: Math.floor(Math.random() * 50),
          won: Math.floor(Math.random() * 25),
          best_time: Math.floor(Math.random() * 300) + 60,
          highest_score: Math.floor(Math.random() * 1000) + 500
        };
        
        setGameStats(mockStats);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setProfileLoading(false);
      }
    }

    getProfile();
  }, [user, loading, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: bio,
          leaderboard_opt_in: leaderboardOptIn,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update the profile state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          display_name: displayName,
          bio: bio,
          leaderboard_opt_in: leaderboardOptIn
        };
      });
      
      // Also update in Auth context if applicable
      if (updateUserProfile) {
        await updateUserProfile(displayName);
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };
  
  const formatTime = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full mx-auto">
            <div className="animate-pulse space-y-8">
              <Skeleton className="h-12 w-1/3" />
              <div className="grid gap-8 md:grid-cols-3">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg md:col-span-2" />
              </div>
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.display_name || displayName || 'Player'}!</p>
            </div>
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:row-span-2">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.display_name || "Profile"} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {getInitials(displayName || profile?.display_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="text-center text-xl font-semibold"
                  />
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  <User className="h-3 w-3" /> 
                  {user?.id && user.id.substring(0, 8)}
                </CardDescription>
                
                <div className="mt-4 text-sm text-center">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Add a short bio..."
                    className="text-center"
                    rows={3}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </div>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Joined
                  </div>
                  <span className="text-sm font-medium">
                    {user?.created_at ? 
                      format(new Date(user.created_at), 'MMM d, yyyy') : 
                      "Unknown"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard Visibility
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="leaderboard-visibility" 
                    checked={leaderboardOptIn}
                    onCheckedChange={setLeaderboardOptIn}
                  />
                  <Label htmlFor="leaderboard-visibility">{leaderboardOptIn ? "Visible" : "Hidden"}</Label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/settings")}
                >
                  Account Settings
                </Button>
              </CardFooter>
            </Card>
            
            {/* Game Stats Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Game Statistics</CardTitle>
                    <CardDescription>Your gameplay performance</CardDescription>
                  </div>
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-muted-foreground text-sm mb-1">Games Played</div>
                    <div className="text-2xl font-bold">{gameStats.played}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-muted-foreground text-sm mb-1">Games Won</div>
                    <div className="text-2xl font-bold">{gameStats.won}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-muted-foreground text-sm mb-1">Best Time</div>
                    <div className="text-2xl font-bold">{formatTime(gameStats.best_time)}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-muted-foreground text-sm mb-1">Highest Score</div>
                    <div className="text-2xl font-bold">{gameStats.highest_score || "N/A"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Achievements */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Your latest accomplishments</CardDescription>
                  </div>
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <Trophy className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium">First Victory</div>
                        <div className="text-sm text-muted-foreground">Won your first puzzle</div>
                      </div>
                    </div>
                    <Badge>Earned</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Quick Solver</div>
                        <div className="text-sm text-muted-foreground">Completed a puzzle in under 2 minutes</div>
                      </div>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Persistent Player</div>
                        <div className="text-sm text-muted-foreground">Played 5 days in a row</div>
                      </div>
                    </div>
                    <Badge variant="outline">2/5 Complete</Badge>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  View All Achievements
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-700"
              onClick={() => navigate("/game")}
            >
              Start New Game
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
