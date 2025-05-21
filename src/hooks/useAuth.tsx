
import { useEffect, useState, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient"; // Updated import from the renamed file
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  updateUserProfile: (firstName?: string, lastName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If a new user signs up/signs in, ensure their profile exists
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          setTimeout(() => {
            createOrUpdateUserProfile(session.user);
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          createOrUpdateUserProfile(session.user);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to ensure user profile exists in the profiles table
  const createOrUpdateUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Create new profile
        let displayName = '';
        
        // Try to get display name from metadata if available
        if (user.user_metadata) {
          if (user.user_metadata.full_name) {
            displayName = user.user_metadata.full_name;
          } else if (user.user_metadata.name) {
            displayName = user.user_metadata.name;
          } else if (user.user_metadata.first_name && user.user_metadata.last_name) {
            displayName = `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
          } else if (user.user_metadata.first_name) {
            displayName = user.user_metadata.first_name;
          }
        }
        
        // If no name was found, use email
        if (!displayName && user.email) {
          displayName = user.email.split('@')[0];
        }
        
        // Create profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            display_name: displayName,
            avatar_url: user.user_metadata?.avatar_url || null,
            leaderboard_opt_in: true
          });
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
    } catch (error) {
      console.error('Error checking/creating profile:', error);
    }
  };

  const updateUserProfile = async (firstName?: string, lastName?: string) => {
    if (!user) return;
    
    try {
      const displayName = firstName && lastName 
        ? `${firstName} ${lastName}` 
        : firstName || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
