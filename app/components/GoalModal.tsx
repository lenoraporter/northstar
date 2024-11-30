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
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </DialogTitle>
          <DialogDescription>
            Define your goal and set a timeframe for achievement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="goal-title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Goal Title
              </label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                placeholder="What do you want to achieve?"
                className="mt-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="goal-timeframe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Timeframe
              </label>
              <Select
                value={newGoal.timeframe}
                onValueChange={(value: '1year' | '3year' | '5year') =>
                  setNewGoal({ ...newGoal, timeframe: value })
                }
              >
                <SelectTrigger id="goal-timeframe" className="mt-2">
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
              <label
                htmlFor="goal-description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <Textarea
                id="goal-description"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                placeholder="Describe your goal in detail..."
                className="mt-2"
                rows={6}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                setEditingGoal(null);
                setNewGoal({ title: '', timeframe: '1year', description: '' });
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingGoal ? 'Update' : 'Create'} Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
