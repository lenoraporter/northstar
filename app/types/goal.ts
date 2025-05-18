export type Goal = {
  id: string;
  title: string;
  timeframe: '1year' | '3year' | '5year';
  description?: string;
  createdAt: Date;
  milestones: {
    id: string;
    title: string;
    weight: number;
  }[];
  alignedTasks: {
    id: string;
    title: string;
    completed: boolean;
    alignments: {
      milestoneId: string;
      alignment: number;
    }[];
  }[];
};
