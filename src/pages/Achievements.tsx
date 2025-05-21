
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Medal, Trophy, Clock, User, Brain, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const AchievementCard = ({ achievement, index }: { achievement: any, index: number }) => {
  const icons = {
    "first_victory": <Trophy className="h-6 w-6 text-yellow-500" />,
    "easy_master": <Medal className="h-6 w-6 text-green-500" />,
    "hard_master": <Medal className="h-6 w-6 text-red-500" />,
    "speed_demon": <Clock className="h-6 w-6 text-blue-500" />,
    "no_help": <Brain className="h-6 w-6 text-purple-500" />,
    "daily_challenger": <Calendar className="h-6 w-6 text-orange-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`h-full ${achievement.achieved ? 'border-primary bg-primary/5' : 'bg-muted/30'}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg ${achievement.achieved ? 'bg-primary/10' : 'bg-muted'}`}>
              {icons[achievement.id] || <Trophy className="h-6 w-6 text-gray-400" />}
            </div>
            {achievement.achieved && (
              <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Unlocked
              </div>
            )}
          </div>
          <CardTitle className="text-lg mt-2">{achievement.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
          
          {achievement.progress !== undefined && achievement.progressTarget !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{achievement.progress}/{achievement.progressTarget}</span>
                <span className="text-muted-foreground">{Math.round((achievement.progress / achievement.progressTarget) * 100)}%</span>
              </div>
              <Progress value={(achievement.progress / achievement.progressTarget) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { achievements, loading, unlockedCount, totalCount, refresh } = useAchievements();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 bg-gradient-to-b from-background to-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Achievements</h1>
              <p className="text-muted-foreground mt-1">
                You've unlocked {unlockedCount} out of {totalCount} achievements
              </p>
            </div>
            
            {!user ? (
              <Button onClick={() => navigate('/auth')}>
                <User className="mr-2 h-4 w-4" />
                Sign in to track achievements
              </Button>
            ) : (
              <Button onClick={() => refresh()} variant="outline">
                Refresh achievements
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(null).map((_, i) => (
                <Card key={i} className="h-40 animate-pulse">
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="w-full h-full bg-muted/50 rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  index={index} 
                />
              ))}
            </div>
          )}
          
          {!user && (
            <div className="mt-8 bg-primary/10 p-4 rounded-lg">
              <p className="text-center text-muted-foreground">
                Sign in to track your achievements and compete on the leaderboard.
                <br />
                <Button 
                  variant="link" 
                  onClick={() => navigate('/auth')}
                  className="mt-2"
                >
                  Sign in now
                </Button>
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Achievements;
