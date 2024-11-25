'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Target, Pencil, X, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  // Add this to handle client/server mismatch
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Add this useEffect
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
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Start editing a task
  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditingTitle(task.title);
  };

  // Save edited task
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

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditingTitle('');
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

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  if (!isClient) {
    return null; // or a loading spinner
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
          <Button type="submit">Add</Button>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
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
        ))}
      </div>

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

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No tasks yet. Add some tasks to get started!
        </div>
      )}

      <div className="mt-8">
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Target className="w-4 h-4" />
          Manage Goals
        </Button>
      </div>
    </main>
  );
}
