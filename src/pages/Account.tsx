
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User, Mail, Lock, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAchievements } from "@/hooks/useAchievements";
import { Card } from "@/components/ui/card";

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { achievements, unlockedCount, totalCount } = useAchievements();
  
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
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    averageScore: 0,
    highestScore: 0
  });
  
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view this page");
      navigate("/auth");
      return;
    }
    
    setEmail(user.email || "");
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData) {
          setDisplayName(profileData.display_name || "");
          setBio(profileData.bio || "");
          setAvatarUrl(profileData.avatar_url || "");
          setLeaderboardOptIn(profileData.leaderboard_opt_in !== false); // Default to true if null
        }
        
        // Get user stats if available
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!statsError && statsData) {
          setStats({
            gamesPlayed: statsData.games_played || 0,
            gamesWon: statsData.games_won || 0,
            totalScore: statsData.total_score || 0,
            averageScore: statsData.average_score || 0,
            highestScore: statsData.highest_score || 0
          });
        }
      } catch (error: any) {
        console.error("Error fetching user data: ", error);
        toast.error(error.message || "Error loading user data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
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
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your account...</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-white border border-gray-100 rounded-lg p-1">
              <TabsTrigger value="profile" className="rounded-md">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-md">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="password" className="rounded-md">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </TabsTrigger>
              <TabsTrigger value="stats" className="rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
                Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32 border-2 border-primary">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName || "Profile"} />
                      ) : (
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
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
                          className="cursor-pointer rounded-lg"
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Change Photo
                            </>
                          )}
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
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        placeholder="Tell us about yourself" 
                        className="min-h-[100px] rounded-lg"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="leaderboardOptIn"
                        checked={leaderboardOptIn}
                        onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary rounded"
                      />
                      <Label htmlFor="leaderboardOptIn">Show me on leaderboards</Label>
                    </div>
                    
                    <Button 
                      onClick={updateProfile} 
                      disabled={saving}
                      className="rounded-lg"
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

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="email">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6">Email Address</h2>
                <div className="space-y-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" 
                      className="rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={updateEmail}
                    disabled={isSavingEmail}
                    className="rounded-lg"
                  >
                    {isSavingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Email"}
                  </Button>

                  <div className="mt-4 pt-4 text-sm text-muted-foreground">
                    <p>
                      After changing your email, you'll need to verify the new address.
                      Please check your inbox for a verification link.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="password">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6">Password</h2>
                <div className="space-y-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="rounded-lg"
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
                      className="rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={updatePassword}
                    disabled={isSavingPassword}
                    className="rounded-lg"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : "Change Password"}
                  </Button>
                  
                  <div className="mt-4 pt-4 text-sm text-muted-foreground">
                    <p>
                      Password must be at least 8 characters long. For better security,
                      use a combination of letters, numbers, and symbols.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="stats">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6">Your Game Stats</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-blue-500 text-sm font-medium">Games Played</div>
                      <div className="text-3xl font-bold mt-1">{stats.gamesPlayed}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-green-500 text-sm font-medium">Games Won</div>
                      <div className="text-3xl font-bold mt-1">{stats.gamesWon}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-purple-500 text-sm font-medium">Win Rate</div>
                      <div className="text-3xl font-bold mt-1">
                        {stats.gamesPlayed > 0 
                          ? `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%` 
                          : "0%"}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="text-yellow-600 text-sm font-medium">Total Score</div>
                      <div className="text-3xl font-bold mt-1">{stats.totalScore.toLocaleString()}</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-xl">
                      <div className="text-pink-500 text-sm font-medium">Average Score</div>
                      <div className="text-3xl font-bold mt-1">{stats.averageScore.toLocaleString()}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                      <div className="text-red-500 text-sm font-medium">Highest Score</div>
                      <div className="text-3xl font-bold mt-1">{stats.highestScore.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                  <h2 className="text-xl font-semibold mb-2">Achievements</h2>
                  <p className="text-muted-foreground mb-6">
                    You've unlocked {unlockedCount} out of {totalCount} achievements
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.slice(0, 3).map((achievement) => (
                      <Card key={achievement.id} className={`p-4 ${achievement.achieved ? 'bg-primary/5 border-primary/20' : 'bg-muted/10'}`}>
                        <h3 className="font-medium">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.progressTarget !== undefined && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.progressTarget}
                          </div>
                        )}
                        {achievement.achieved && (
                          <div className="mt-2 text-xs text-primary font-medium">Unlocked</div>
                        )}
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/achievements')}
                    className="mt-6 rounded-lg"
                  >
                    View all achievements
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Delete Account Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="rounded-2xl">
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
              <li>Your achievements and statistics</li>
              <li>Your saved preferences</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg">Cancel</Button>
            <Button variant="destructive" onClick={deleteAccount} className="rounded-lg">Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Account;
