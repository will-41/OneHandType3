import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, Lock, Star, Target, Zap, Award } from "lucide-react";
import type { Achievement } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked?: boolean;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

const AchievementBadge = ({ 
  achievement, 
  isUnlocked = false, 
  size = "md",
  showDescription = true 
}: AchievementBadgeProps) => {
  const getIcon = () => {
    switch (achievement.category) {
      case "speed":
        return <Zap className={cn("text-yellow-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg"
        })} />;
      case "accuracy":
        return <Target className={cn("text-green-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md", 
          "h-8 w-8": size === "lg"
        })} />;
      case "consistency":
        return <Star className={cn("text-blue-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg"
        })} />;
      case "milestone":
        return <Trophy className={cn("text-purple-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg"
        })} />;
      case "special":
        return <Award className={cn("text-orange-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg"
        })} />;
      default:
        return <Trophy className={cn("text-gray-500", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg"
        })} />;
    }
  };

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case "common":
        return "border-gray-300 bg-gray-50";
      case "rare":
        return "border-blue-300 bg-blue-50";
      case "epic":
        return "border-purple-300 bg-purple-50";
      case "legendary":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getRarityText = () => {
    return achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1);
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 border-2",
        {
          [getRarityColor()]: isUnlocked,
          "opacity-60 grayscale": !isUnlocked,
          "hover:shadow-md hover:scale-105": isUnlocked,
          "cursor-default": !isUnlocked,
        }
      )}
      role="img"
      aria-label={`Achievement: ${achievement.title}. ${isUnlocked ? "Unlocked" : "Locked"}`}
    >
      <CardContent className={cn("flex gap-3", {
        "p-3": size === "sm",
        "p-4": size === "md",
        "p-6": size === "lg"
      })}>
        <div className="flex-shrink-0 relative">
          {isUnlocked ? (
            getIcon()
          ) : (
            <div className="relative">
              {getIcon()}
              <Lock className="absolute -bottom-1 -right-1 h-3 w-3 text-muted-foreground bg-background rounded-full p-0.5" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn("font-semibold leading-tight", {
              "text-sm": size === "sm",
              "text-base": size === "md",
              "text-lg": size === "lg"
            })}>
              {achievement.title}
            </h4>
            
            <Badge 
              variant="outline" 
              className={cn("flex-shrink-0", {
                "text-xs px-1 py-0": size === "sm",
                "text-xs": size === "md",
                "text-sm": size === "lg"
              })}
            >
              {getRarityText()}
            </Badge>
          </div>
          
          {showDescription && (
            <p className={cn("text-muted-foreground mt-1", {
              "text-xs": size === "sm",
              "text-sm": size === "md",
              "text-base": size === "lg"
            })}>
              {achievement.description}
            </p>
          )}
          
          {achievement.points && (
            <div className={cn("flex items-center gap-1 mt-2", {
              "text-xs": size === "sm",
              "text-sm": size === "md"
            })}>
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-muted-foreground">
                {achievement.points} points
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;
