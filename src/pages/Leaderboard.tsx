
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, UserCircle2, Crown, Award, Clock, Medal, XCircle, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define the Profile type
interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean;
}

// Define the ScoreEntry type
interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  difficulty: string;
  time_taken: number;
  created_at: string;
  profiles: Profile;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all-time");
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  
  useEffect(() => {
    fetchScores();
  }, [activeTab, difficultyFilter, timeFilter, user]);
  
  const fetchScores = async () => {
    setLoading(true);
    
    try {
      // Determine date range for filtering
      let dateConstraint = '';
      const now = new Date();
      
      if (timeFilter === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        dateConstraint = `created_at >= '${today}'`;
      } else if (timeFilter === 'this-week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        dateConstraint = `created_at >= '${oneWeekAgo.toISOString()}'`;
      } else if (timeFilter === 'this-month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        dateConstraint = `created_at >= '${oneMonthAgo.toISOString()}'`;
      }
      
      // Build difficulty filter
      const difficultyConstraint = difficultyFilter !== 'all' ? `difficulty = '${difficultyFilter}'` : '';
      
      // Combine constraints
      let constraints = [];
      if (dateConstraint) constraints.push(dateConstraint);
      if (difficultyConstraint) constraints.push(difficultyConstraint);
      
      // Filter by user if on 'me' tab
      if (activeTab === 'me' && user) {
        constraints.push(`user_id = '${user.id}'`);
      }
      
      // Build final query
      let query = supabase
        .from('game_scores')
        .select(`
          *,
          profiles:user_id(display_name, avatar_url, leaderboard_opt_in)
        `)
        .eq('completed', true)
        .order('score', { ascending: false });
      
      // Add constraints if any
      if (constraints.length > 0) {
        query = query.or(constraints.join(','));
      }
      
      // Execute query
      const { data: scoreData, error } = await query;
      
      if (error) {
        console.error('Error fetching leaderboard:', error);
        setScores([]);
        setUserRank(null);
        setLoading(false);
        return;
      }
      
      // Type assertion and filtering for leaderboard opt-in
      const typedScores = scoreData as unknown as Array<{
        id: string;
        user_id: string;
        score: number;
        difficulty: string;
        time_taken: number;
        created_at: string;
        profiles: Profile;
      }>;
      
      // Filter out users who opted out of leaderboard
      const filteredScores = typedScores.filter(score => {
        // For the 'me' tab, show the user's scores regardless of opt-in status
        if (activeTab === 'me' && user && score.user_id === user.id) {
          return true;
        }
        // For other tabs, respect the opt-in flag
        return score.profiles && score.profiles.leaderboard_opt_in !== false;
      });
      
      setScores(filteredScores);
      
      // Calculate user's rank if they are logged in
      if (user) {
        const userRankIndex = filteredScores.findIndex(score => score.user_id === user.id);
        setUserRank(userRankIndex >= 0 ? userRankIndex + 1 : null);
      } else {
        setUserRank(null);
      }
      
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setScores([]);
      setUserRank(null);
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Leaderboard</h1>
              <p className="text-muted-foreground">Compare your puzzle-solving skills with players worldwide</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 rounded-lg"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
          
          {filterOpen && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Time Period</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-full rounded-lg">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6 rounded-lg">
              <TabsTrigger value="all">Global Rankings</TabsTrigger>
              <TabsTrigger value="me" disabled={!user}>Your Rankings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {loading ? (
                <div className="py-20 text-center text-muted-foreground">
                  Loading leaderboard...
                </div>
              ) : scores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 rounded-tl-lg">Rank</th>
                        <th className="px-4 py-3">Player</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Difficulty</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3 rounded-tr-lg">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((score, index) => {
                        const isCurrentUser = user && score.user_id === user.id;
                        const displayName = score.profiles?.display_name || 'Anonymous';
                        
                        return (
                          <tr 
                            key={score.id} 
                            className={`border-t border-gray-100 ${isCurrentUser ? 'bg-purple-50' : ''} ${index % 2 === 1 ? 'bg-gray-50' : ''}`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {index < 3 ? (
                                  <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'}
                                  `}>
                                    {index === 0 && <Crown size={16} />}
                                    {index === 1 && <Award size={16} />}
                                    {index === 2 && <Medal size={16} />}
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700">
                                    {index + 1}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {score.profiles?.avatar_url ? (
                                  <img 
                                    src={score.profiles.avatar_url} 
                                    alt={score.profiles.display_name || 'Player'} 
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <UserCircle2 className="w-8 h-8 text-gray-400" />
                                )}
                                <span className={isCurrentUser ? 'font-bold' : ''}>{displayName}</span>
                                {isCurrentUser && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">You</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold">{score.score}</td>
                            <td className="px-4 py-3 capitalize">{score.difficulty}</td>
                            <td className="px-4 py-3">{formatTime(score.time_taken)}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDistanceToNow(new Date(score.created_at), { addSuffix: true })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No scores found</h3>
                  <p className="text-muted-foreground">
                    {difficultyFilter !== 'all' || timeFilter !== 'all-time' 
                      ? 'Try changing your filters to see more results' 
                      : 'Be the first to set a high score!'}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="me">
              {!user ? (
                <div className="py-20 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1">Sign in to view your rankings</h3>
                  <p className="text-muted-foreground mb-4">
                    Create an account to track your progress and see where you rank
                  </p>
                  <Button asChild>
                    <a href="/auth">Sign In</a>
                  </Button>
                </div>
              ) : loading ? (
                <div className="py-20 text-center text-muted-foreground">
                  Loading your scores...
                </div>
              ) : scores.length > 0 ? (
                <div>
                  {userRank !== null && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Trophy className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Your Global Rank</p>
                          <p className="font-bold text-lg">{userRank}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="rounded-lg">
                        <a href="#all" onClick={() => setActiveTab('all')}>View Global Ranking</a>
                      </Button>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-3 rounded-tl-lg">Score</th>
                          <th className="px-4 py-3">Difficulty</th>
                          <th className="px-4 py-3">Time</th>
                          <th className="px-4 py-3 rounded-tr-lg">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((score, index) => (
                          <tr 
                            key={score.id} 
                            className={index % 2 === 1 ? 'bg-gray-50' : ''}
                          >
                            <td className="px-4 py-3 font-bold">{score.score}</td>
                            <td className="px-4 py-3 capitalize">{score.difficulty}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                {formatTime(score.time_taken)}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatDistanceToNow(new Date(score.created_at), { addSuffix: true })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No scores yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Play some games to see your scores and rankings here
                  </p>
                  <Button asChild>
                    <a href="/game">Play a Game</a>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
