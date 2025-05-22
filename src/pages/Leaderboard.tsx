
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  difficulty: string;
  created_at: string;
  display_name?: string;
  avatar_url?: string;
}

interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "easy" | "hard">("all");
  const [userRank, setUserRank] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  useEffect(() => {
    fetchLeaderboardData();
  }, [filter]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // First, fetch profiles to associate with scores
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast({
          title: "Error fetching profiles",
          description: profilesError.message,
          variant: "destructive",
        });
        return;
      }

      const profileMap: Record<string, Profile> = {};
      if (profilesData) {
        profilesData.forEach((profile: Profile) => {
          profileMap[profile.id] = profile;
        });
      }
      setProfiles(profileMap);

      // Now fetch scores
      let query = supabase
        .from("game_scores")
        .select("*")
        .order("score", { ascending: false });

      if (filter !== "all") {
        query = query.eq("difficulty", filter);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        console.error("Error fetching leaderboard:", error);
        toast({
          title: "Error fetching leaderboard",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Process and map profiles to scores
      const processedScores: ScoreEntry[] = data.map((score: any) => ({
        id: score.id,
        user_id: score.user_id,
        score: score.score,
        difficulty: score.difficulty,
        created_at: score.created_at,
        display_name: profileMap[score.user_id]?.display_name || "Unknown Player",
        avatar_url: profileMap[score.user_id]?.avatar_url,
      }));

      setScores(processedScores);

      // Calculate user rank if user is logged in
      if (user) {
        const rank = processedScores.findIndex((score) => score.user_id === user.id) + 1;
        setUserRank(rank > 0 ? rank : null);
      }
    } catch (error) {
      console.error("Error in fetchLeaderboardData:", error);
      toast({
        title: "Error loading leaderboard",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Unknown date";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how your puzzle-solving skills compare to others
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Top Scores</CardTitle>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "easy" | "hard")}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="easy">Easy</TabsTrigger>
                  <TabsTrigger value="hard">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No scores available. Be the first to play and submit a score!
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 py-2 px-4 bg-muted/50 rounded-md font-medium text-sm">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5 md:col-span-4">Player</div>
                  <div className="col-span-3 text-center">Score</div>
                  <div className="hidden md:block md:col-span-2 text-center">Difficulty</div>
                  <div className="col-span-3 md:col-span-2 text-right">When</div>
                </div>

                {scores.map((score, index) => {
                  const isCurrentUser = user && score.user_id === user.id;
                  return (
                    <div
                      key={score.id}
                      className={`grid grid-cols-12 py-2 px-4 rounded-md items-center ${
                        isCurrentUser ? "bg-primary-foreground border border-primary" : "hover:bg-muted/20"
                      }`}
                    >
                      <div className="col-span-1 text-center font-medium">
                        {index + 1}
                        {index === 0 && <Trophy className="inline-block ml-1 h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="col-span-5 md:col-span-4 font-medium truncate">
                        {score.display_name}
                        {isCurrentUser && <Badge className="ml-2">You</Badge>}
                      </div>
                      <div className="col-span-3 text-center font-mono font-medium">
                        {score.score.toLocaleString()}
                      </div>
                      <div className="hidden md:block md:col-span-2 text-center">
                        <Badge variant={score.difficulty === "easy" ? "secondary" : "destructive"}>
                          {score.difficulty === "easy" ? "Easy" : "Hard"}
                        </Badge>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right text-xs text-muted-foreground">
                        {formatDate(score.created_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {userRank && userRank > scores.length && (
              <div className="mt-6 p-4 border border-dashed rounded-md">
                <p className="text-sm text-center text-muted-foreground">
                  Your best score ranks #{userRank} overall
                </p>
              </div>
            )}

            {!user && (
              <div className="mt-6 p-4 border border-dashed rounded-md">
                <p className="text-center">
                  <Button variant="outline" onClick={() => window.location.href = "/auth"}>
                    Sign In to Track Your Scores
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => window.location.href = "/game"}>Play Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
