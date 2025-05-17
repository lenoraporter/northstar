import { CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  weight: number;
  completed: boolean;
  suggestedTasks: string[];
}

interface GoalActionsListProps {
  milestones: GoalMilestone[];
  onToggleMilestone?: (id: string) => void;
}

export function GoalActionsList({
  milestones,
  onToggleMilestone,
}: GoalActionsListProps) {
  // Calculate overall progress
  const completedWeight = milestones
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.weight, 0);
  const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
  const progress = Math.round((completedWeight / totalWeight) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Overall Progress</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={cn('p-4', milestone.completed && 'bg-muted/50')}
          >
            {/* Milestone Header */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleMilestone?.(milestone.id)}
                className="mt-1 hover:opacity-70 transition-opacity"
                aria-label={
                  milestone.completed
                    ? 'Mark as incomplete'
                    : 'Mark as complete'
                }
              >
                {milestone.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className={cn(
                      'font-medium',
                      milestone.completed &&
                        'line-through text-muted-foreground'
                    )}
                  >
                    {milestone.title}
                  </h4>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    Weight: {milestone.weight}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>

                {/* Suggested Tasks */}
                <div className="mt-3 pt-3 border-t">
                  <h5 className="text-sm font-medium mb-2">Suggested Tasks:</h5>
                  <ul className="space-y-1">
                    {milestone.suggestedTasks.map((task, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
