import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserCircle2, Mail, Lock, UserX2, Bell, Gamepad2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import DeleteAccountDialog from "@/components/account/DeleteAccountDialog";

const profileFormSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name cannot exceed 30 characters"),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional().nullable(),
  leaderboard_opt_in: z.boolean().default(true),
});

const passwordFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const preferenceFormSchema = z.object({
  showGridNumbers: z.boolean().default(true),
  highContrastMode: z.boolean().default(false),
  soundEffects: z.boolean().default(true),
  backgroundMusic: z.boolean().default(true),
});

interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean | null;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      leaderboard_opt_in: true,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const preferenceForm = useForm<z.infer<typeof preferenceFormSchema>>({
    resolver: zodResolver(preferenceFormSchema),
    defaultValues: {
      showGridNumbers: true,
      highContrastMode: false,
      soundEffects: true,
      backgroundMusic: true,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    emailForm.setValue("email", user.email || "");

    async function getProfile() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setProfile(data);
        setAvatarUrl(data?.avatar_url || null);
        
        profileForm.reset({
          display_name: data?.display_name || "",
          bio: data?.bio || "",
          leaderboard_opt_in: data?.leaderboard_opt_in !== false,
        });
        
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    // Load user preferences from localStorage
    const preferences = JSON.parse(localStorage.getItem("gamePreferences") || "{}");
    preferenceForm.reset({
      showGridNumbers: preferences.showGridNumbers !== false,
      highContrastMode: preferences.highContrastMode === true,
      soundEffects: preferences.soundEffects !== false,
      backgroundMusic: preferences.backgroundMusic !== false,
    });

    getProfile();
  }, [user, navigate]);

  async function updateProfile(values: z.infer<typeof profileFormSchema>) {
    try {
      if (!user) return;
      setIsSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: values.display_name,
          bio: values.bio,
          leaderboard_opt_in: values.leaderboard_opt_in,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setProfile({
        ...profile!,
        display_name: values.display_name,
        bio: values.bio,
        leaderboard_opt_in: values.leaderboard_opt_in,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateEmail(values: z.infer<typeof emailFormSchema>) {
    try {
      if (user?.email === values.email) {
        toast.info("This is already your current email");
        return;
      }
      
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({ email: values.email });
      
      if (error) throw error;
      
      toast.success("Email update initiated. Check your inbox for confirmation.");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
    } finally {
      setIsSaving(false);
    }
  }

  async function updatePassword(values: z.infer<typeof passwordFormSchema>) {
    try {
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({ password: values.password });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSaving(false);
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
      
      // Update the profile state to reflect the change
      if (profile) {
        setProfile({
          ...profile,
          avatar_url: publicURL.publicUrl
        });
      }
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Error uploading avatar");
    } finally {
      setUploading(false);
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

  function updatePreferences(values: z.infer<typeof preferenceFormSchema>) {
    localStorage.setItem("gamePreferences", JSON.stringify(values));
    toast.success("Game preferences updated");
  }

  function resetPreferences() {
    const defaultPreferences = {
      showGridNumbers: true,
      highContrastMode: false,
      soundEffects: true,
      backgroundMusic: true,
    };
    
    localStorage.setItem("gamePreferences", JSON.stringify(defaultPreferences));
    preferenceForm.reset(defaultPreferences);
    toast.success("Game preferences reset to defaults");
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 2);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background via-background to-purple-50/30 dark:to-purple-900/5">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <UserCircle2 className="mr-2 h-7 w-7 text-primary" />
              Account & Settings
            </h1>
            <p className="text-muted-foreground mb-8">Customize your experience and manage your profile</p>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  <span>Game Settings</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="border shadow-md">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent border-b pb-8">
                    <CardTitle className="flex items-center">
                      <UserCircle2 className="mr-2 h-5 w-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your profile details and photo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={profile?.display_name || "Profile"} />
                          ) : (
                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                              {getInitials(profile?.display_name)}
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
                      
                      <div className="flex-1 w-full">
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="display_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Tell us a bit about yourself" 
                                      className="resize-none" 
                                      {...field} 
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="leaderboard_opt_in"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Leaderboard Visibility</FormLabel>
                                    <FormDescription>
                                      Show your profile on the public leaderboard
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full"
                              disabled={isSaving}
                            >
                              {isSaving ? "Saving..." : "Save Profile"}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <div className="space-y-6">
                  {/* Email Update */}
                  <Card className="border shadow-md">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border-b">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <CardTitle>Email Address</CardTitle>
                      </div>
                      <CardDescription>Update your email address</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(updateEmail)} className="space-y-4">
                          <FormField
                            control={emailForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" variant="outline" disabled={isSaving}>
                            {isSaving ? "Updating..." : "Update Email"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  {/* Password Update */}
                  <Card className="border shadow-md">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border-b">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        <CardTitle>Password</CardTitle>
                      </div>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" variant="outline" disabled={isSaving}>
                            {isSaving ? "Updating..." : "Change Password"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  {/* Account Deletion */}
                  <Card className="border border-destructive/40 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 dark:to-transparent border-b">
                      <div className="flex items-center gap-2">
                        <UserX2 className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-destructive">Delete Account</CardTitle>
                      </div>
                      <CardDescription>Permanently delete your account and all data</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        This action cannot be undone. It will permanently delete your account and remove all your data from our servers.
                      </p>
                      <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Game Settings Tab */}
              <TabsContent value="preferences">
                <Card className="border shadow-md">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-primary" />
                        <CardTitle>Game Settings</CardTitle>
                      </div>
                    </div>
                    <CardDescription>Customize your gameplay experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <Form {...preferenceForm}>
                      <form onSubmit={preferenceForm.handleSubmit(updatePreferences)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" /></svg>
                            </span>
                            Grid Display Options
                          </h3>
                          <FormField
                            control={preferenceForm.control}
                            name="showGridNumbers"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal">Show grid numbers</FormLabel>
                                  <FormDescription>
                                    Display grid coordinates to help with puzzle solving
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={preferenceForm.control}
                            name="highContrastMode"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal">High contrast mode</FormLabel>
                                  <FormDescription>
                                    Enhance visibility with higher contrast colors
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                            </span>
                            Sound Settings
                          </h3>
                          <FormField
                            control={preferenceForm.control}
                            name="soundEffects"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal">Enable sound effects</FormLabel>
                                  <FormDescription>
                                    Play sounds for game interactions
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={preferenceForm.control}
                            name="backgroundMusic"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal">Enable background music</FormLabel>
                                  <FormDescription>
                                    Play relaxing background music during gameplay
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-sm flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded">
                              <Bell className="h-4 w-4 text-primary" />
                            </span>
                            Notifications
                          </h3>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <label className="text-base font-medium">Game Reminders</label>
                              <p className="text-sm text-muted-foreground">
                                Receive daily puzzle notifications
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <label className="text-base font-medium">New Achievements</label>
                              <p className="text-sm text-muted-foreground">
                                Get notified about new achievements
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetPreferences}
                          >
                            Reset to Defaults
                          </Button>
                          <Button type="submit">Save Settings</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        {/* Delete Account Confirmation Dialog */}
        <DeleteAccountDialog 
          open={showDeleteConfirm} 
          onOpenChange={setShowDeleteConfirm}
          userId={user?.id || ''}
          onSignOut={signOut}
        />
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Account;
