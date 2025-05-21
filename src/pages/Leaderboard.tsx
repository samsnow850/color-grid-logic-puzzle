import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Award, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean | null;
}

interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
  difficulty: string;
  time_taken: number;
  profiles?: Profile | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"all" | "month" | "week">("all");

  const { data: scores, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard", difficulty, timeRange],
    queryFn: async () => {
      // Build query for game scores
      let query = supabase
        .from("game_scores")
        .select(`
          id,
          user_id,
          score,
          difficulty,
          time_taken,
          created_at,
          profiles:user_id(
            display_name,
            avatar_url,
            leaderboard_opt_in
          )
        `)
        .eq("completed", true)
        .order("score", { ascending: false })
        .limit(50);
      
      // Apply difficulty filter if needed
      if (difficulty !== "all") {
        query = query.eq("difficulty", difficulty);
      }
      
      // Apply time range filter if needed
      if (timeRange !== "all") {
        const now = new Date();
        let filterDate = new Date();
        
        if (timeRange === "week") {
          filterDate.setDate(now.getDate() - 7);
        } else if (timeRange === "month") {
          filterDate.setDate(now.getDate() - 30);
        }
        
        query = query.gte("created_at", filterDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Filter out entries where user has opted out of leaderboard
      return data.filter(entry => {
        // If profiles is null or has no leaderboard_opt_in property, default to including the entry
        if (!entry.profiles || entry.profiles.leaderboard_opt_in === null) {
          return true;
        }
        // Otherwise, only include if they've opted in
        return entry.profiles.leaderboard_opt_in !== false;
      }) as ScoreEntry[];
    },
    refetchOnWindowFocus: false,
  });

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "#";
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = (score: ScoreEntry) => {
    if (score.profiles?.display_name) {
      return score.profiles.display_name;
    }
    return `Player ${score.user_id.substring(0, 6)}`;
  };

  // Highlight current user's scores
  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  useEffect(() => {
    // Handle scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Refresh leaderboard data on mount
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-2 md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">See how players rank in Color Grid Logic</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={() => refetch()}
                title="Refresh leaderboard"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <Tabs defaultValue="filters" className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Time Range</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant={timeRange === "all" ? "default" : "outline"} 
                        onClick={() => setTimeRange("all")}
                        className="rounded-lg"
                      >
                        All Time
                      </Button>
                      <Button 
                        size="sm"
                        variant={timeRange === "month" ? "default" : "outline"} 
                        onClick={() => setTimeRange("month")}
                        className="rounded-lg"
                      >
                        This Month
                      </Button>
                      <Button 
                        size="sm"
                        variant={timeRange === "week" ? "default" : "outline"} 
                        onClick={() => setTimeRange("week")}
                        className="rounded-lg"
                      >
                        This Week
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="md:hidden" />
                  <Separator orientation="vertical" className="hidden md:block h-auto" />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Difficulty</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        variant={difficulty === "all" ? "default" : "outline"} 
                        onClick={() => setDifficulty("all")}
                        className="rounded-lg"
                      >
                        All
                      </Button>
                      <Button 
                        size="sm"
                        variant={difficulty === "easy" ? "default" : "outline"} 
                        onClick={() => setDifficulty("easy")}
                        className="rounded-lg"
                      >
                        Easy
                      </Button>
                      <Button 
                        size="sm"
                        variant={difficulty === "hard" ? "default" : "outline"} 
                        onClick={() => setDifficulty("hard")}
                        className="rounded-lg"
                      >
                        Hard
                      </Button>
                      <Button 
                        size="sm"
                        variant={difficulty === "daily" ? "default" : "outline"} 
                        onClick={() => setDifficulty("daily")}
                        className="rounded-lg"
                      >
                        Daily
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                {isLoading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-6 w-24 ml-auto" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-500">Error loading leaderboard data. Please try again later.</p>
                    <Button onClick={() => refetch()} className="mt-4 rounded-lg">Retry</Button>
                  </div>
                ) : scores && scores.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Rank</TableHead>
                          <TableHead>Player</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead className="text-right">Time</TableHead>
                          <TableHead className="text-right hidden md:table-cell">Difficulty</TableHead>
                          <TableHead className="text-right hidden md:table-cell">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scores.map((score, index) => (
                          <TableRow 
                            key={score.id}
                            className={isCurrentUser(score.user_id) ? "bg-primary/5" : undefined}
                          >
                            <TableCell className="font-medium">
                              {index === 0 && (
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 text-yellow-500 mr-1" />
                                  {index + 1}
                                </div>
                              )}
                              {index === 1 && (
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 text-gray-400 mr-1" />
                                  {index + 1}
                                </div>
                              )}
                              {index === 2 && (
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 text-amber-600 mr-1" />
                                  {index + 1}
                                </div>
                              )}
                              {index > 2 && index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {score.profiles?.avatar_url ? (
                                    <AvatarImage src={score.profiles.avatar_url} />
                                  ) : (
                                    <AvatarFallback>{getInitials(score.profiles?.display_name)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <span className={isCurrentUser(score.user_id) ? "font-medium" : ""}>
                                    {getDisplayName(score)}
                                  </span>
                                  {isCurrentUser(score.user_id) && (
                                    <span className="text-xs text-primary ml-2">(You)</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold">{score.score.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <span className="flex items-center justify-end">
                                <Clock className="h-3 w-3 mr-1 opacity-70" />
                                {formatTime(score.time_taken)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">
                              <span className={`px-2 py-1 rounded-full text-xs 
                                ${score.difficulty === "easy" ? "bg-green-100 text-green-800" : ""}
                                ${score.difficulty === "hard" ? "bg-red-100 text-red-800" : ""}
                                ${score.difficulty === "daily" ? "bg-blue-100 text-blue-800" : ""}
                              `}>
                                {score.difficulty.charAt(0).toUpperCase() + score.difficulty.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">{formatDate(score.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No scores found for the selected filters.</p>
                    <Button variant="outline" onClick={() => {
                      setDifficulty("all");
                      setTimeRange("all");
                    }} className="mt-4 rounded-lg">
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </Tabs>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">About Scoring</h2>
              <p className="mb-4">
                Scores in Color Grid Logic are calculated based on several factors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Base Score:</strong> Easy (100 points), Medium (200 points), Hard (300 points), Daily (250 points)
                </li>
                <li>
                  <strong>Time Bonus:</strong> Faster completion times earn higher scores
                </li>
                <li>
                  <strong>Error Penalty:</strong> Fewer incorrect attempts result in higher scores
                </li>
              </ul>
              <Separator className="my-4" />
              <p className="flex items-center">
                {!user ? (
                  <>
                    To appear on the leaderboard, you need to be signed in when completing puzzles.
                    <Button variant="link" className="ml-1 p-0" asChild>
                      <Link to="/auth">Sign in now</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    You can opt out of appearing on the leaderboard in your 
                    <Button variant="link" className="mx-1 p-0" asChild>
                      <Link to="/account">account settings</Link>
                    </Button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
