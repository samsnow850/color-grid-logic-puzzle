
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';

// Update the ScoreEntry interface
interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  difficulty: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
    leaderboard_opt_in?: boolean;
  } | null;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('scores')
          .select(`
            id,
            user_id,
            score,
            difficulty,
            created_at,
            profiles (
              display_name,
              avatar_url,
              leaderboard_opt_in
            )
          `)
          .order('score', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching scores:', error);
          return;
        }

        // Fix the filtering logic
        const filteredScores = data ? data
          .filter((score) => {
            // Only include scores where the profile doesn't exist or has leaderboard_opt_in not set to false
            return !score.profiles || score.profiles.leaderboard_opt_in !== false;
          })
          .map(score => ({
            id: score.id,
            user_id: score.user_id,
            score: score.score,
            difficulty: score.difficulty,
            created_at: score.created_at,
            profiles: score.profiles
          })) : [];

        setScores(filteredScores as ScoreEntry[]);
      } catch (err) {
        console.error('Unexpected error fetching scores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredScores = activeTab === 'all' 
    ? scores 
    : scores.filter(score => score.difficulty === activeTab);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const isCurrentUser = (userId: string) => user && user.id === userId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">See how you rank among other players.</p>
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            
            {user ? null : (
              <Button variant="outline" onClick={() => window.location.href = "/auth"}>
                Sign in to compete
              </Button>
            )}
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Loading scores...</p>
                </div>
              </div>
            ) : filteredScores.length > 0 ? (
              <div className="bg-card rounded-lg shadow overflow-hidden">
                <Table>
                  <TableCaption>Top scores for {activeTab === 'all' ? 'all difficulties' : activeTab + ' difficulty'}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((entry, index) => (
                      <TableRow key={entry.id} className={isCurrentUser(entry.user_id) ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          {index === 0 && (
                            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 w-8 h-8">
                              <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8">
                              <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="inline-flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950 w-8 h-8">
                              <Trophy className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                            </div>
                          )}
                          {index > 2 && (
                            <span className="inline-flex items-center justify-center w-8 h-8">{index + 1}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {entry.profiles?.avatar_url ? (
                                <AvatarImage src={entry.profiles.avatar_url} alt={entry.profiles.display_name || 'User'} />
                              ) : (
                                <AvatarFallback>
                                  {entry.profiles?.display_name ? getInitials(entry.profiles.display_name) : 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span>
                              {entry.profiles?.display_name || 'Anonymous User'}
                              {isCurrentUser(entry.user_id) && (
                                <Badge variant="outline" className="ml-2">You</Badge>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">{entry.score.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={entry.difficulty === 'easy' ? 'secondary' : 'destructive'}>
                            {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {formatDate(entry.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-card rounded-lg shadow p-12 text-center">
                <h3 className="text-lg font-medium mb-2">No scores yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to join the leaderboard!</p>
                <Button onClick={() => window.location.href = "/game"}>Play Now</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
