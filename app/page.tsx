'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Target, Pencil, X, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type AlignmentDetails = {
  goalId: string;
  score: number;
  explanation: string;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  alignments: AlignmentDetails[];
};

const categories = [
  'Personal',
  'Work',
  'Health',
  'Learning',
  'Errands',
  'Other',
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Run',
    completed: false,
    category: 'Health',
    alignments: [],
  },
  {
    id: '2',
    title: 'Team Meeting',
    completed: false,
    category: 'Work',
    alignments: [],
  },
];

// Add this Goal type and initialGoals
type Goal = {
  id: string;
  title: string;
  timeframe: '1year' | '3year' | '5year';
  description?: string;
  createdAt: Date;
};

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Run Marathon',
    timeframe: '1year',
    description: 'Complete first marathon under 4:30:00',
    createdAt: new Date(),
  },
];

// Add a function to analyze task-goal alignment
const analyzeTaskAlignment = async (taskTitle: string, goals: Goal[]) => {
  if (goals.length === 0) {
    return { alignments: [] };
  }

  const alignments: AlignmentDetails[] = goals.map((goal) => {
    const taskLower = taskTitle.toLowerCase();
    const goalLower = goal.title.toLowerCase();
    const goalDescLower = goal.description?.toLowerCase() || '';

    // Direct alignment keywords (core activities)
    const directKeywords = ['run', 'running', 'marathon', 'training'];

    // Strong support keywords (essential preparation)
    const strongKeywords = ['shoes', 'hydration', 'stretching', 'recovery'];

    // Moderate support keywords (complementary activities)
    const moderateKeywords = ['workout', 'exercise', 'fitness', 'strength'];

    // Light support keywords (indirect benefits)
    const lightKeywords = ['sleep', 'nutrition', 'diet', 'rest'];

    let score = 0;
    let explanation = '';

    if (directKeywords.some((keyword) => taskLower.includes(keyword))) {
      score = 100;
      explanation = `This task is a core activity for your ${goal.title} goal`;
    } else if (strongKeywords.some((keyword) => taskLower.includes(keyword))) {
      score = 85;
      explanation = `This task is essential preparation for your ${goal.title} goal`;
    } else if (
      moderateKeywords.some((keyword) => taskLower.includes(keyword))
    ) {
      score = 70;
      explanation = `This task supports your ${goal.title} goal through complementary training`;
    } else if (lightKeywords.some((keyword) => taskLower.includes(keyword))) {
      score = 40;
      explanation = `This task indirectly benefits your ${goal.title} goal`;
    } else {
      score = 0;
      explanation = `This task doesn't seem to align with your ${goal.title} goal`;
    }

    return {
      goalId: goal.id,
      score,
      explanation,
    };
  });

  return { alignments };
};

// Add this function near the top with other helper functions
const detectTaskCategory = (taskTitle: string): string => {
  const taskLower = taskTitle.toLowerCase();
  let category = 'Other';

  // Health-related keywords
  if (
    taskLower.match(
      /\b(gym|workout|exercise|run|health|doctor|dentist|medicine|yoga|fitness|training|sleep|shoes)\b/
    )
  ) {
    category = 'Health';
  }

  // Work-related keywords
  if (
    taskLower.match(
      /\b(meeting|email|presentation|report|client|project|deadline|work|boss|colleague|interview)\b/
    )
  ) {
    category = 'Work';
  }

  // Learning-related keywords
  if (
    taskLower.match(
      /\b(study|learn|read|book|course|class|homework|research|practice|tutorial|lesson)\b/
    )
  ) {
    category = 'Learning';
  }

  // Errands-related keywords
  if (
    taskLower.match(
      /\b(buy|shop|grocery|store|pay|bill|bank|pickup|return|mail|post|clean|laundry)\b/
    )
  ) {
    category = 'Errands';
  }

  // Personal-related keywords
  if (
    taskLower.match(
      /\b(family|friend|call|visit|birthday|gift|hobby|movie|dinner|lunch|date|party)\b/
    )
  ) {
    category = 'Personal';
  }

  console.log(`Detecting category for "${taskTitle}": ${category}`); // Debug log
  return category;
};

export default function Home() {
  // Client-side rendering check
  const [isClient, setIsClient] = useState(false);

  // Task state
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Goal state
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', initialGoals);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    timeframe: '1year' as const,
    description: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Task functions
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAnalyzing(true);

    const analysis = await analyzeTaskAlignment(newTaskTitle, goals);
    const detectedCategory = detectTaskCategory(newTaskTitle);
    console.log(`Adding task with category: ${detectedCategory}`); // Debug log

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: detectedCategory,
      alignments: analysis.alignments || [],
    };

    console.log('New task object:', newTask); // Debug log
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAnalyzing(false);
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (taskId: string) => {
    if (!editingTitle.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: editingTitle.trim() } : task
      )
    );
    setEditingTask(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditingTitle('');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Goal functions
  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGoal.title.trim()) return;

    if (editingGoal) {
      // Update existing goal
      setGoals(
        goals.map((goal) =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                title: newGoal.title,
                timeframe: newGoal.timeframe,
                description: newGoal.description,
              }
            : goal
        )
      );
    } else {
      // Add new goal
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        timeframe: newGoal.timeframe,
        description: newGoal.description,
        createdAt: new Date(),
      };
      setGoals([...goals, goal]);
    }

    // Reset form
    setShowGoalModal(false);
    setEditingGoal(null);
    setNewGoal({ title: '', timeframe: '1year', description: '' });
  };

  const startEditingGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      timeframe: goal.timeframe,
      description: goal.description || '',
    });
    setShowGoalModal(true);
  };

  const deleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter((goal) => goal.id !== goalId));
    }
  };

  // Helper functions
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Personal: 'bg-blue-100 text-blue-800',
      Work: 'bg-purple-100 text-purple-800',
      Health: 'bg-green-100 text-green-800',
      Learning: 'bg-yellow-100 text-yellow-800',
      Errands: 'bg-orange-100 text-orange-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.Other;
  };

  const getTaskStats = () => {
    return categories.map((category) => ({
      category,
      total: tasks.filter((task) => task.category === category).length,
      completed: tasks.filter(
        (task) => task.category === category && task.completed
      ).length,
    }));
  };

  // Filter tasks based on selected category
  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;

  if (!isClient) {
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      {/* Task Input Form */}
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What do you need to do today?"
            className="w-full p-4 text-lg"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Button variant="outline" className="min-w-[120px]" disabled>
            {newTaskTitle ? detectTaskCategory(newTaskTitle) : 'Category'}
          </Button>
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Analyzing...
              </>
            ) : (
              'Add'
            )}
          </Button>
        </div>
      </form>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Task List */}
      <AnimatePresence>
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <div className="flex-1">
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="flex-1"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit(task.id);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => saveEdit(task.id)}
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className={`font-medium ${
                              task.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            {task.title}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                              task.category
                            )}`}
                          >
                            {task.category}
                          </span>
                        </div>
                        {!editingTask && (
                          <div className="mt-2 space-y-2">
                            {task.alignments?.length > 0 ? (
                              task.alignments.map((alignment) => {
                                const goal = goals.find(
                                  (g) => g.id === alignment.goalId
                                );
                                return (
                                  <div
                                    key={alignment.goalId}
                                    className="flex items-center gap-2 bg-gray-50 rounded-md p-2"
                                  >
                                    <div className="flex-shrink-0">
                                      <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                          alignment.score >= 70
                                            ? 'bg-green-100 text-green-700'
                                            : alignment.score >= 40
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}
                                      >
                                        {alignment.score}%
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {goal?.title}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {alignment.explanation}
                                      </div>
                                    </div>
                                    <Target className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                No goal alignments found
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {editingTask !== task.id && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(task)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      {/* Task Actions */}
      {tasks.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {tasks.filter((t) => !t.completed).length} tasks remaining
          </div>
          {tasks.some((t) => t.completed) && (
            <Button variant="outline" size="sm" onClick={clearCompleted}>
              Clear completed
            </Button>
          )}
        </div>
      )}

      {/* Task Statistics */}
      {tasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Task Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getTaskStats().map(
              ({ category, total, completed }) =>
                total > 0 && (
                  <Card key={category} className="p-4">
                    <div
                      className={`text-sm ${getCategoryColor(
                        category
                      )} inline-block px-2 py-1 rounded-full mb-2`}
                    >
                      {category}
                    </div>
                    <div className="text-2xl font-bold">
                      {completed}/{total}
                    </div>
                    <div className="text-sm text-gray-500">tasks completed</div>
                  </Card>
                )
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 mt-8 p-8 border-2 border-dashed rounded-lg"
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-sm text-gray-400">
            Add your first task to get started!
          </p>
        </motion.div>
      )}

      {/* Goals Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Goals</h3>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowGoalModal(true)}
          >
            <Target className="w-4 h-4" />
            Add Goal
          </Button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {goal.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {goal.timeframe === '1year'
                      ? '1 Year'
                      : goal.timeframe === '3year'
                      ? '3 Years'
                      : '5 Years'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditingGoal(goal)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <GoalModal
        show={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        editingGoal={editingGoal}
        onSubmit={handleGoalSubmit}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        setEditingGoal={setEditingGoal}
      />
    </main>
  );
}

type GoalModalProps = {
  show: boolean;
  onClose: () => void;
  editingGoal: Goal | null;
  onSubmit: (e: React.FormEvent) => void;
  newGoal: {
    title: string;
    timeframe: '1year' | '3year' | '5year';
    description: string;
  };
  setNewGoal: (goal: any) => void;
  setEditingGoal: (goal: Goal | null) => void;
};

const GoalModal = ({
  show,
  onClose,
  editingGoal,
  onSubmit,
  newGoal,
  setNewGoal,
  setEditingGoal,
}: GoalModalProps) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Goal Title</label>
            <Input
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Timeframe</label>
            <Select
              value={newGoal.timeframe}
              onValueChange={(value: '1year' | '3year' | '5year') =>
                setNewGoal({ ...newGoal, timeframe: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="3year">3 Years</SelectItem>
                <SelectItem value="5year">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              placeholder="Describe your goal in detail..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                setEditingGoal(null);
                setNewGoal({ title: '', timeframe: '1year', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editingGoal ? 'Update' : 'Add'} Goal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
