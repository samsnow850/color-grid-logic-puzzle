
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { HelpCircle, Mail, Lock, User, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const profileFormSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters").max(30, "Name cannot exceed 30 characters"),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
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

const Settings = () => {
  const { user, session, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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
    if (loading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    emailForm.setValue("email", user.email || "");

    async function getProfile() {
      try {
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
  }, [user, loading, navigate]);

  async function updateProfile(values: z.infer<typeof profileFormSchema>) {
    try {
      if (!user) return;
      
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
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  }

  async function updateEmail(values: z.infer<typeof emailFormSchema>) {
    try {
      if (user?.email === values.email) {
        toast.info("This is already your current email");
        return;
      }
      
      const { error } = await supabase.auth.updateUser({ email: values.email });
      
      if (error) throw error;
      
      toast.success("Email update initiated. Check your inbox for confirmation.");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
    }
  }

  async function updatePassword(values: z.infer<typeof passwordFormSchema>) {
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
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

  async function deleteAccount() {
    try {
      const { error } = await supabase.auth.admin?.deleteUser(user!.id);
      
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
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="animate-pulse text-xl">Loading settings...</div>
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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account and preferences</p>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="help">Help & Support</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile details and photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="w-24 h-24 border-2 border-primary">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={profile?.display_name || "Profile"} />
                        ) : (
                          <AvatarFallback className="text-xl">
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
                          
                          <Button type="submit" className="w-full">Save Profile</Button>
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <CardTitle>Email Address</CardTitle>
                    </div>
                    <CardDescription>Update your email address</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Button type="submit">Update Email</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                {/* Password Update */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <CardTitle>Password</CardTitle>
                    </div>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Button type="submit">Change Password</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                {/* Account Deletion */}
                <Card className="border-destructive">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-destructive" />
                      <CardTitle className="text-destructive">Delete Account</CardTitle>
                    </div>
                    <CardDescription>Permanently delete your account and all data</CardDescription>
                  </CardHeader>
                  <CardContent>
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
            
            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Game Preferences</CardTitle>
                  <CardDescription>Customize your gameplay experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...preferenceForm}>
                    <form onSubmit={preferenceForm.handleSubmit(updatePreferences)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">Grid Display Options</h3>
                        <FormField
                          control={preferenceForm.control}
                          name="showGridNumbers"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Show grid numbers</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={preferenceForm.control}
                          name="highContrastMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">High contrast mode (accessibility)</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">Sound Settings</h3>
                        <FormField
                          control={preferenceForm.control}
                          name="soundEffects"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Enable sound effects</FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={preferenceForm.control}
                          name="backgroundMusic"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">Enable background music</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetPreferences}
                        >
                          Reset to Defaults
                        </Button>
                        <Button type="submit">Save Preferences</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Language & Theme (Coming Soon)</CardTitle>
                  <CardDescription>These features will be available in a future update</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 opacity-70">
                    <div className="flex items-center justify-between">
                      <span>Language</span>
                      <Button disabled variant="outline">English</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Theme</span>
                      <Button disabled variant="outline">Light / Dark</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Help & Support Tab */}
            <TabsContent value="help">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <CardTitle>Help & FAQs</CardTitle>
                    </div>
                    <CardDescription>Frequently asked questions and game instructions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowHelpFAQ(true)}
                    >
                      View FAQ & Game Instructions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowBugReport(true)}
                    >
                      Report a Bug
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <CardTitle>Legal Resources</CardTitle>
                    </div>
                    <CardDescription>Important legal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button asChild variant="outline" className="w-full">
                      <a href="/privacy-policy">Privacy Policy</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/terms-of-use">Terms of Use</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <a href="/contact">Contact Us</a>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>Check out these exciting features coming to Color Grid Logic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowComingSoon(true)}
                    >
                      Preview Upcoming Features
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
      
      {/* Help & FAQ Modal */}
      <Dialog open={showHelpFAQ} onOpenChange={setShowHelpFAQ}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Help & FAQs</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How to Play</h3>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Select a difficulty level (Easy, Medium, or Hard)</li>
                <li>Fill the grid so that each row, column, and region contains each color exactly once</li>
                <li>Click on an empty cell to select it, then click on a color from the palette or use number keys</li>
                <li>The game is complete when all cells are correctly filled</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Troubleshooting Login</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>If you can't login, try resetting your password</li>
                <li>Make sure to check your spam folder for verification emails</li>
                <li>Clear your browser cache and cookies if you're experiencing persistent issues</li>
                <li>If problems persist, contact support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What to do if the puzzle won't load?</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Refresh the page</li>
                <li>Try using a different browser</li>
                <li>Check your internet connection</li>
                <li>Disable any ad-blockers or extensions that might interfere</li>
                <li>If the issue continues, report it using the bug report form</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bug Report Modal */}
      <Dialog open={showBugReport} onOpenChange={setShowBugReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Bug</DialogTitle>
            <DialogDescription>
              Please describe the issue you're experiencing in detail.
            </DialogDescription>
          </DialogHeader>
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const description = formData.get("description") as string;
              const timestamp = new Date().toISOString();
              const subject = `Bug Report: Color Grid Logic (${timestamp})`;
              const body = `
                Bug Description:
                ${description}
                
                App Version: 1.0.0
                Time: ${timestamp}
                User Agent: ${navigator.userAgent}
              `;
              window.location.href = `mailto:support@colorgridlogic.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              setShowBugReport(false);
              toast.success("Bug report email prepared");
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Bug Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe what happened and what you expected to happen"
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>This will generate an email with automatically included technical information to help us diagnose the issue.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowBugReport(false)}>Cancel</Button>
              <Button type="submit">Send Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Coming Soon Modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Coming Soon to Color Grid Logic</DialogTitle>
            <DialogDescription>
              Check out these exciting features we're working on
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-bold mb-2">Multiplayer Mode</h3>
              <p className="text-sm text-muted-foreground mb-4">Challenge your friends to races or collaborate on harder puzzles.</p>
              <div className="text-xs text-primary">Coming Summer 2025</div>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-bold mb-2">Puzzle of the Day</h3>
              <p className="text-sm text-muted-foreground mb-4">A new daily challenge with special rewards and a dedicated leaderboard.</p>
              <div className="text-xs text-primary">Coming June 2025</div>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-bold mb-2">Custom Puzzle Creator</h3>
              <p className="text-sm text-muted-foreground mb-4">Design your own puzzles and share them with the community.</p>
              <div className="text-xs text-primary">Coming Fall 2025</div>
            </div>
            <div className="border rounded-lg p-4 bg-muted/20">
              <h3 className="font-bold mb-2">Timed Challenge Mode</h3>
              <p className="text-sm text-muted-foreground mb-4">Test your speed against the clock with escalating difficulty.</p>
              <div className="text-xs text-primary">Coming July 2025</div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close Preview</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Settings;
