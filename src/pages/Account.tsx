import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Achievement } from "@/lib/achievements";
import { useAchievements } from "@/hooks/useAchievements";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const { achievements } = useAchievements();

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`display_name, avatar_url, leaderboard_opt_in`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setDisplayName(data.display_name || "");
        setAvatarUrl(data.avatar_url || "");
        setLeaderboardOptIn(data.leaderboard_opt_in || false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const updates = {
        id: user?.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        leaderboard_opt_in: leaderboardOptIn,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        throw error;
      }
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card className="bg-white rounded-xl shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
                {avatarUrl ? (
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      {displayName
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="leaderboard_opt_in">Show on Leaderboard</Label>
                <Switch
                  id="leaderboard_opt_in"
                  checked={leaderboardOptIn}
                  onCheckedChange={(checked) => setLeaderboardOptIn(checked)}
                />
              </div>

              <Button onClick={updateProfile} disabled={loading} className="rounded-lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Achievements</CardTitle>
              <CardDescription>
                Track your progress and view unlocked achievements.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {achievement.achieved ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <AchievementProgress achievement={achievement} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Loading achievements...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Danger Zone</CardTitle>
              <CardDescription>
                Careful, these actions can have serious consequences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={signOut}
                disabled={loading}
                className="rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  achieved: boolean;
  progress?: number;
  progressTarget?: number;
  achievedAt?: string;
}

const AchievementProgress = ({ achievement }: { achievement: Achievement }) => {
  // Handle both types of achievements: those with progress and those without
  const hasProgress = typeof achievement.progress !== 'undefined' && 
                     typeof achievement.progressTarget !== 'undefined';
                     
  // For achievements without progress tracking (like "first_victory"), 
  // we consider them either 0% or 100% complete
  const progressPercent = hasProgress 
    ? Math.min(100, Math.round((achievement.progress! / achievement.progressTarget!) * 100)) 
    : (achievement.achieved ? 100 : 0);
    
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{progressPercent}% complete</span>
        {hasProgress && (
          <span>{achievement.progress}/{achievement.progressTarget}</span>
        )}
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default Account;
