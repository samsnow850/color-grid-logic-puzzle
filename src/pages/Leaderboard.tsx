
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { scrollToTop } from "@/lib/utils";
import { Trophy, Medal, Clock, Calendar, Activity } from "lucide-react";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  leaderboard_opt_in: boolean | null;
}

interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  difficulty: string;
  created_at: string;
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

const Leaderboard = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "easy" | "hard">("all");
  const [userRank, setUserRank] = useState<number | null>(null);
  
  const { data: scores, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard", timeFilter, difficultyFilter],
    queryFn: async () => {
      try {
        // Get the scores
        let query = supabase
          .from("scores")
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
          .order("score", { ascending: false });
        
        // Apply difficulty filter if not "all"
        if (difficultyFilter !== "all") {
          query = query.eq("difficulty", difficultyFilter);
        }
        
        // Apply time filter
        if (timeFilter !== "all") {
          const now = new Date();
          let daysBack = timeFilter === "month" ? 30 : 7;
          const filterDate = new Date();
          filterDate.setDate(now.getDate() - daysBack);
          const isoDate = filterDate.toISOString();
          
          query = query.gte("created_at", isoDate);
        }
        
        // Get the data
        const { data: scoresData, error: scoresError } = await query.limit(100);
        
        if (scoresError) throw scoresError;
        
        // Filter out users who have opted out of leaderboard
        const filteredScores: ScoreEntry[] = scoresData.filter((score) => {
          return !score.profiles || score.profiles.leaderboard_opt_in !== false;
        });
        
        // Find the current user's position, if logged in
        if (user) {
          const userIndex = filteredScores.findIndex(score => score.user_id === user.id);
          setUserRank(userIndex !== -1 ? userIndex + 1 : null);
        } else {
          setUserRank(null);
        }
        
        return filteredScores;
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        throw err;
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  useEffect(() => {
    scrollToTop();
    refetch();
  }, [refetch]);

  const getInitials = (name: string | null) => {
    if (!name) return "#";
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = (score: ScoreEntry) => {
    if (score.profiles?.display_name) {
      return score.profiles.display_name;
    }
    return `Player ${score.user_id.substring(0, 6)}`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Easy</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Medium</Badge>;
      case "hard":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Hard</Badge>;
      default:
        return null;
    }
  };

  const TopThreePlayers = () => {
    if (!scores || scores.length < 3) return null;
    
    return (
      <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
        {/* Second Place */}
        <Card className="border-silver overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-900 p-4 flex items-center justify-center border-b">
            <Medal className="h-12 w-12 text-gray-400" />
          </div>
          <CardContent className="pt-4 text-center">
            <Avatar className="h-16 w-16 mx-auto border-2 border-gray-300">
              {scores[1].profiles?.avatar_url ? (
                <AvatarImage src={scores[1].profiles.avatar_url} />
              ) : (
                <AvatarFallback>{getInitials(scores[1].profiles?.display_name)}</AvatarFallback>
              )}
            </Avatar>
            <h3 className="font-bold mt-2">{getDisplayName(scores[1])}</h3>
            <div className="text-2xl font-bold text-gray-500">{scores[1].score.toLocaleString()}</div>
            {getDifficultyBadge(scores[1].difficulty)}
          </CardContent>
        </Card>
        
        {/* First Place */}
        <Card className="border-gold -mt-4 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-yellow-100 to-amber-50 dark:from-yellow-900/30 dark:to-amber-800/30 p-6 flex items-center justify-center border-b">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardContent className="pt-6 text-center">
            <Avatar className="h-20 w-20 mx-auto border-4 border-yellow-300">
              {scores[0].profiles?.avatar_url ? (
                <AvatarImage src={scores[0].profiles.avatar_url} />
              ) : (
                <AvatarFallback>{getInitials(scores[0].profiles?.display_name)}</AvatarFallback>
              )}
            </Avatar>
            <h3 className="font-bold text-lg mt-2">{getDisplayName(scores[0])}</h3>
            <div className="text-3xl font-bold text-yellow-600">{scores[0].score.toLocaleString()}</div>
            {getDifficultyBadge(scores[0].difficulty)}
          </CardContent>
        </Card>
        
        {/* Third Place */}
        <Card className="border-bronze overflow-hidden">
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/30 p-4 flex items-center justify-center border-b">
            <Medal className="h-12 w-12 text-orange-500" />
          </div>
          <CardContent className="pt-4 text-center">
            <Avatar className="h-16 w-16 mx-auto border-2 border-orange-300">
              {scores[2].profiles?.avatar_url ? (
                <AvatarImage src={scores[2].profiles.avatar_url} />
              ) : (
                <AvatarFallback>{getInitials(scores[2].profiles?.display_name)}</AvatarFallback>
              )}
            </Avatar>
            <h3 className="font-bold mt-2">{getDisplayName(scores[2])}</h3>
            <div className="text-2xl font-bold text-orange-500">{scores[2].score.toLocaleString()}</div>
            {getDifficultyBadge(scores[2].difficulty)}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background via-background to-purple-50/30 dark:to-purple-900/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">Compete with players worldwide in Color Grid Logic</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="col-span-1 bg-gradient-to-br from-primary/5 to-transparent border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Time Period Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time Period</label>
                      <Tabs 
                        defaultValue={timeFilter} 
                        onValueChange={(val) => setTimeFilter(val as "all" | "month" | "week")}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
                          <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                          <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    {/* Difficulty Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Difficulty</label>
                      <Tabs 
                        defaultValue={difficultyFilter} 
                        onValueChange={(val) => setDifficultyFilter(val as "all" | "easy" | "hard")}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="easy" className="text-xs">Easy</TabsTrigger>
                          <TabsTrigger value="hard" className="text-xs">Hard</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    {/* Refresh Button */}
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => refetch()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                      Refresh
                    </Button>
                    
                    {/* User Rank */}
                    {user && userRank && (
                      <div className="bg-primary/10 p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Your Rank</h3>
                        <p className="text-2xl font-bold text-primary">{userRank}</p>
                        <p className="text-xs text-muted-foreground">
                          out of {scores?.length || 0} players
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="col-span-1 md:col-span-3">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : error ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-red-500 mb-4">Error loading leaderboard data. Please try again.</p>
                      <Button onClick={() => refetch()}>Retry</Button>
                    </CardContent>
                  </Card>
                ) : scores && scores.length > 0 ? (
                  <>
                    <TopThreePlayers />
                    
                    <Card className="border shadow">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="w-16 text-center">Rank</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scores.map((score, index) => (
                            <TableRow 
                              key={score.id} 
                              className={user && score.user_id === user.id ? "bg-primary/5" : ""}
                            >
                              <TableCell className="font-medium text-center">
                                {index === 0 && (
                                  <span className="md:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-700">
                                    <Trophy className="h-3 w-3" />
                                  </span>
                                )}
                                {index === 1 && (
                                  <span className="md:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300/20 text-gray-600">
                                    <Medal className="h-3 w-3" />
                                  </span>
                                )}
                                {index === 2 && (
                                  <span className="md:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-300/20 text-orange-600">
                                    <Medal className="h-3 w-3" />
                                  </span>
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
                                  <span className={user && score.user_id === user.id ? "font-semibold" : ""}>
                                    {getDisplayName(score)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getDifficultyBadge(score.difficulty)}
                              </TableCell>
                              <TableCell className="text-right font-bold">{score.score.toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                                <span className="flex items-center justify-end gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(score.created_at)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No scores have been recorded yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <Card className="mt-8 border shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
                  <span>About Scoring</span>
                </CardTitle>
                <CardDescription>Learn how scores are calculated in Color Grid Logic</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/5 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Time</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Solve puzzles faster to earn higher scores. Every second counts!
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                      <h3 className="font-medium">Difficulty</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hard puzzles award more points than easy ones. Challenge yourself!
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>
                      <h3 className="font-medium">Mistakes</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fewer mistakes mean higher scores. Be precise with your placements.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md text-center mt-2">
                  <p>
                    Sign in to appear on the leaderboard. Opt out in your 
                    <a href="/account" className="text-primary hover:underline ml-1">account settings</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default Leaderboard;
