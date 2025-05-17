import React from 'react';

interface GoalActionsListProps {
  goalId?: string; // Add at least one property to avoid the empty interface warning
}

const GoalActionsList: React.FC<GoalActionsListProps> = () => {
  return (
    <div>
      <p>Goal Actions List Component</p>
    </div>
  );
};

export default GoalActionsList;
