import { useState } from 'react';
import { Pencil, Save, X, Plus, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

interface ActionPlanListProps {
  milestones: GoalMilestone[];
  isEditing?: boolean;
  onEdit?: (milestoneId: string, updates: Partial<GoalMilestone>) => void;
}

export function ActionPlanList({
  milestones,
  isEditing,
  onEdit,
}: ActionPlanListProps) {
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GoalMilestone>>({});

  const startEditing = (milestone: GoalMilestone) => {
    setEditingMilestone(milestone.id);
    setEditForm(milestone);
  };

  const cancelEditing = () => {
    setEditingMilestone(null);
    setEditForm({});
  };

  const saveEdits = (milestoneId: string) => {
    onEdit?.(milestoneId, editForm);
    setEditingMilestone(null);
    setEditForm({});
  };

  const addSuggestedTask = (milestoneId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const updatedTasks = [
      ...(editForm.suggestedTasks || milestone.suggestedTasks),
      '',
    ];
    setEditForm({ ...editForm, suggestedTasks: updatedTasks });
  };

  const removeSuggestedTask = (milestoneId: string, index: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const updatedTasks = [
      ...(editForm.suggestedTasks || milestone.suggestedTasks),
    ];
    updatedTasks.splice(index, 1);
    setEditForm({ ...editForm, suggestedTasks: updatedTasks });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {milestones.map((milestone) => (
        <AccordionItem key={milestone.id} value={milestone.id}>
          <AccordionTrigger className="hover:no-underline">
            {editingMilestone === milestone.id ? (
              <div className="flex items-center gap-3 flex-1">
                <Input
                  value={editForm.title || milestone.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="flex-1"
                  placeholder="Milestone title"
                />
                <Input
                  type="number"
                  value={editForm.weight || milestone.weight}
                  onChange={(e) =>
                    setEditForm({ ...editForm, weight: Number(e.target.value) })
                  }
                  className="w-20"
                  min={1}
                  max={5}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-left">
                {milestone.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {milestone.suggestedTasks.length} suggested tasks
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto mr-4">
                  Weight: {milestone.weight}
                </Badge>
              </div>
            )}
          </AccordionTrigger>

          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {editingMilestone === milestone.id ? (
                <>
                  {/* Edit Description */}
                  <Textarea
                    value={editForm.description || milestone.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    placeholder="Milestone description"
                    className="w-full"
                    rows={3}
                  />

                  {/* Edit Suggested Tasks */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Suggested Tasks</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSuggestedTask(milestone.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(
                        editForm.suggestedTasks || milestone.suggestedTasks
                      ).map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={task}
                            onChange={(e) => {
                              const updatedTasks = [
                                ...(editForm.suggestedTasks ||
                                  milestone.suggestedTasks),
                              ];
                              updatedTasks[index] = e.target.value;
                              setEditForm({
                                ...editForm,
                                suggestedTasks: updatedTasks,
                              });
                            }}
                            placeholder="Task description"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              removeSuggestedTask(milestone.id, index)
                            }
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edit Actions */}
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => saveEdits(milestone.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {milestone.description}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(milestone)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {/* Display Suggested Tasks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Suggested Tasks</h4>
                    <ul className="space-y-2">
                      {milestone.suggestedTasks.map((task, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
