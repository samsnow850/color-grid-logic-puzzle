
// Fix the profile relation issue in Leaderboard.tsx
// We need to update the type definition and how we handle the response

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

// Fix the filtering logic
const filteredScores = scoresData ? scoresData
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

// When returning the scores:
return filteredScores as ScoreEntry[];
