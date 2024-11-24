'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Target } from 'lucide-react';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

// Define our Task type
type Task = {
  id: string;
  title: string;
  completed: boolean;
  alignment: number;
  goalAligned?: string;
};

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Run',
    completed: false,
    alignment: 90,
    goalAligned: 'Marathon Training',
  },
  {
    id: '2',
    title: 'Team Meeting',
    completed: false,
    alignment: 45,
    goalAligned: 'Career Growth',
  },
];

export default function Home() {
  // Replace useState with useLocalStorage
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Add new task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      alignment: 0,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

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
          <Button type="submit">Add</Button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </div>
                {task.goalAligned && (
                  <div className="flex items-center gap-2">
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
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

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

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No tasks yet. Add some tasks to get started!
        </div>
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
