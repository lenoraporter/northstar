'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Target, Pencil, X, Check, Tag } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define Task type
type Task = {
  id: string;
  title: string;
  completed: boolean;
  alignment: number;
  goalAligned?: string;
  category: string;
};

// Define categories
const categories = [
  'Personal',
  'Work',
  'Health',
  'Learning',
  'Errands',
  'Other',
];

// Initial tasks for demo
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Run',
    completed: false,
    alignment: 90,
    goalAligned: 'Marathon Training',
    category: 'Health',
  },
  {
    id: '2',
    title: 'Team Meeting',
    completed: false,
    alignment: 45,
    goalAligned: 'Career Growth',
    category: 'Work',
  },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Other');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      alignment: 0,
      category: newTaskCategory,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
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

  const filteredTasks = selectedCategory
    ? tasks.filter((task) => task.category === selectedCategory)
    : tasks;

  // Category color mapping
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

  // Task statistics
  const getTaskStats = () => {
    return categories.map((category) => ({
      category,
      total: tasks.filter((task) => task.category === category).length,
      completed: tasks.filter(
        (task) => task.category === category && task.completed
      ).length,
    }));
  };

  if (!isClient) {
    return null;
  }
  return (
    <main className="max-w-2xl mx-auto p-6">
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What do you need to do today?"
            className="w-full p-4 text-lg"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px]">
                {newTaskCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setNewTaskCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit">Add</Button>
        </div>
      </form>

      {/* Category filter */}
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
                        {task.goalAligned && (
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className={`text-sm ${
                                task.alignment >= 70
                                  ? 'text-green-600'
                                  : task.alignment >= 40
                                  ? 'text-yellow-600'
                                  : 'text-gray-500'
                              }`}
                            >
                              {task.alignment}% aligned with {task.goalAligned}
                            </div>
                            <Brain className="w-4 h-4 text-purple-600" />
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
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Target className="w-4 h-4" />
          Manage Goals
        </Button>
      </div>
    </main>
  );
}
