
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

interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
    leaderboard_opt_in: boolean | null;
  };
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
  const { data: scores, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url,
            leaderboard_opt_in
          )
        `)
        .order("score", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Filter out users who have opted out of the leaderboard
      const filteredScores = data.filter(score => 
        score.profiles?.leaderboard_opt_in !== false
      );
      
      return filteredScores as ScoreEntry[];
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");
  
  const filteredScores = scores?.filter((score) => {
    if (timeFilter === "all") return true;
    
    const scoreDate = new Date(score.created_at);
    const now = new Date();
    
    if (timeFilter === "month") {
      // Filter for scores in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return scoreDate >= thirtyDaysAgo;
    }
    
    if (timeFilter === "week") {
      // Filter for scores in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return scoreDate >= sevenDaysAgo;
    }
    
    return true;
  });

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

  useEffect(() => {
    // Refresh leaderboard data on mount
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground mb-6">See how players rank in Color Grid Logic</p>
          
          <div className="flex gap-2 mb-6">
            <Button 
              variant={timeFilter === "all" ? "default" : "outline"} 
              onClick={() => setTimeFilter("all")}
            >
              All Time
            </Button>
            <Button 
              variant={timeFilter === "month" ? "default" : "outline"} 
              onClick={() => setTimeFilter("month")}
            >
              This Month
            </Button>
            <Button 
              variant={timeFilter === "week" ? "default" : "outline"} 
              onClick={() => setTimeFilter("week")}
            >
              This Week
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => refetch()}
              title="Refresh leaderboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-24 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-500">Error loading leaderboard data. Please try again later.</p>
                <Button onClick={() => refetch()} className="mt-4">Retry</Button>
              </div>
            ) : filteredScores && filteredScores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScores.map((score, index) => (
                    <TableRow key={score.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {score.profiles?.avatar_url ? (
                              <AvatarImage src={score.profiles.avatar_url} />
                            ) : (
                              <AvatarFallback>{getInitials(score.profiles?.display_name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{getDisplayName(score)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{score.score}</TableCell>
                      <TableCell className="text-right">{formatDate(score.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No scores have been recorded yet.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About Scoring</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="mb-4">
                Scores in Color Grid Logic are calculated based on several factors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>The time it takes to complete the puzzle</li>
                <li>The difficulty level you're playing on</li>
                <li>The number of incorrect attempts</li>
              </ul>
              <Separator className="my-4" />
              <p>
                To appear on the leaderboard, you need to be signed in to your account when you complete a puzzle.
                You can opt out of appearing on the leaderboard in your <a href="/settings" className="text-primary underline">account settings</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
