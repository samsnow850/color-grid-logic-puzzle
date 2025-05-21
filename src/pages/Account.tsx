import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, TrendingUp, Award, Trophy, Medal } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import PageWrapper from "@/components/PageWrapper";

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // New state for user statistics
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    averageScore: 0,
    totalPlayTime: 0,
    winRate: 0,
    achievements: 0,
    position: 0,
    lastPlayed: null
  });
  
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view this page");
      navigate("/auth");
      return;
    }
    
    setEmail(user.email || "");
    
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
        
        // Fetch user stats from scores table
        const { data: scoresData, error: scoresError } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!scoresError && scoresData) {
          // Calculate statistics from scores data
          const totalGames = scoresData.length;
          const totalScore = scoresData.reduce((sum, game) => sum + (game.score || 0), 0);
          const highScore = scoresData.length > 0 ? Math.max(...scoresData.map(game => game.score || 0)) : 0;
          const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
          const lastPlayed = scoresData.length > 0 ? new Date(scoresData[0].created_at) : null;
          
          // Get user ranking from leaderboard
          const { data: leaderboardData, error: leaderboardError } = await supabase
            .from('scores')
            .select('user_id, score')
            .order('score', { ascending: false })
            .limit(100);
            
          let position = 0;
          if (!leaderboardError && leaderboardData) {
            const userIndex = leaderboardData.findIndex(entry => entry.user_id === user.id);
            position = userIndex !== -1 ? userIndex + 1 : 0; 
          }
          
          // Update stats state
          setUserStats({
            gamesPlayed: totalGames,
            highScore: highScore,
            averageScore: avgScore,
            totalPlayTime: Math.floor(Math.random() * 300), // Mock data for play time in minutes
            winRate: Math.min(Math.floor(Math.random() * 100), 100), // Mock data for win rate
            achievements: Math.floor(Math.random() * 10), // Mock data for achievements
            position: position,
            lastPlayed: lastPlayed
          });
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

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!user || !event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;
      
      setUploading(true);
      
      // Remove old avatar if exists
      if (avatarUrl) {
        const oldFilePath = avatarUrl.split('/').pop();
        if (oldFilePath) {
          await supabase.storage.from("avatars").remove([oldFilePath]);
        }
      }
      
      // Upload new avatar
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURL } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicURL.publicUrl })
        .eq("id", user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(publicURL.publicUrl);
      toast.success("Avatar updated successfully");
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Error uploading avatar");
    } finally {
      setUploading(false);
    }
  }

  async function updateEmail() {
    try {
      if (user?.email === email) {
        toast.info("This is already your current email");
        return;
      }
      
      setIsSavingEmail(true);
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast.success("Email update initiated. Check your inbox for confirmation.");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
    } finally {
      setIsSavingEmail(false);
    }
  }

  async function updatePassword() {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      setIsSavingPassword(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function deleteAccount() {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user!.id }
      });
      
      if (error) throw error;
      
      await signOut();
      navigate("/");
      toast.success("Your account has been deleted");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <PageWrapper 
      loadingTitle="Account" 
      loadingDescription="Loading your profile"
      loadingColor="pink"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12 px-4 bg-white">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            
            {/* New: Game Statistics Section */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">My Game Statistics</h2>
              
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Games Played</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center py-2">
                        <div className="text-2xl font-bold">{userStats.gamesPlayed}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">High Score</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center py-2">
                        <div className="text-2xl font-bold">{userStats.highScore}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center py-2">
                        <div className="text-2xl font-bold">{userStats.averageScore}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Last Game Played</h3>
                    <p className="text-gray-600">{formatDate(userStats.lastPlayed)}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Win Rate</span>
                        <span className="text-sm font-medium">{userStats.winRate}%</span>
                      </div>
                      <Progress value={userStats.winRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Achievements</span>
                        <span className="text-sm font-medium">{userStats.achievements}/10</span>
                      </div>
                      <Progress value={userStats.achievements * 10} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-sm font-medium">
                            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                            Total Play Time
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{userStats.totalPlayTime} mins</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-sm font-medium">
                            <Award className="h-4 w-4 mr-2 text-purple-500" />
                            Achievements Earned
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{userStats.achievements}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="leaderboard" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-sm font-medium">
                        <Medal className="h-4 w-4 mr-2 text-blue-500" />
                        Your Leaderboard Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userStats.position > 0 ? (
                        <div className="text-center py-4">
                          <p className="text-4xl font-bold text-purple-600">#{userStats.position}</p>
                          <p className="text-gray-500 mt-1">out of top 100 players</p>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">Play more games to rank on the leaderboard!</p>
                          <Button 
                            onClick={() => navigate('/game')} 
                            className="mt-3"
                          >
                            Play Now
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-center mt-2">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/leaderboard')}
                      className="flex items-center"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" /> 
                      View Full Leaderboard
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-24 h-24 border-2 border-primary">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName || "Profile"} />
                    ) : (
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex items-center gap-2">
                    <label htmlFor="avatar-upload">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="cursor-pointer"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Change Photo"}
                      </Button>
                      <input 
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex-1 w-full space-y-4">
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
                    onClick={updateProfile} 
                    disabled={saving}
                    className="w-full md:w-auto"
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
            </div>
            
            {/* Email Update */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Email Address</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" 
                  />
                </div>
                <Button 
                  onClick={updateEmail}
                  disabled={isSavingEmail}
                >
                  {isSavingEmail ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </div>
            
            {/* Password Update */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Password</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                </div>
                <Button 
                  onClick={updatePassword}
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? "Updating..." : "Change Password"}
                </Button>
              </div>
            </div>
            
            {/* Account Deletion */}
            <div className="bg-white p-6 rounded-lg shadow border border-destructive">
              <h2 className="text-xl font-semibold text-destructive mb-4">Delete Account</h2>
              <p className="mb-4 text-muted-foreground">
                This action cannot be undone. It will permanently delete your account and remove all your data from our servers.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </main>
        
        {/* Delete Account Confirmation */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
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
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
};

export default Account;
