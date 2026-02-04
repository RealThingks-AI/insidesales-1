import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Pencil, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAllUsers } from '@/hooks/useUserDisplayNames';
import { useModuleRecordNames } from '@/hooks/useModuleRecords';
import { ActionItem, ActionItemStatus, ActionItemPriority } from '@/hooks/useActionItems';

interface ActionItemsKanbanProps {
  actionItems: ActionItem[];
  onEdit: (actionItem: ActionItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ActionItemStatus) => void;
}

const statusColumns: {
  id: ActionItemStatus;
  label: string;
  color: string;
  bgColor: string;
  badgeBg: string;
}[] = [{
  id: 'Open',
  label: 'Open',
  color: 'text-blue-600',
  bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  badgeBg: 'bg-blue-500 text-white'
}, {
  id: 'In Progress',
  label: 'In Progress',
  color: 'text-yellow-600',
  bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  badgeBg: 'bg-yellow-500 text-white'
}, {
  id: 'Completed',
  label: 'Completed',
  color: 'text-green-600',
  bgColor: 'bg-green-100 dark:bg-green-900/30',
  badgeBg: 'bg-green-500 text-white'
}, {
  id: 'Cancelled',
  label: 'Cancelled',
  color: 'text-gray-500',
  bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  badgeBg: 'bg-gray-500 text-white'
}];

const priorityConfig: Record<ActionItemPriority, {
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  Low: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    borderColor: 'border-l-blue-500'
  },
  Medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-l-yellow-500'
  },
  High: {
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    borderColor: 'border-l-red-500'
  }
};

const moduleLabels: Record<string, string> = {
  deals: 'Deal',
  leads: 'Lead',
  contacts: 'Contact'
};

export function ActionItemsKanban({
  actionItems,
  onEdit,
  onDelete,
  onStatusChange
}: ActionItemsKanbanProps) {
  const {
    getUserDisplayName
  } = useAllUsers();

  // Get all linked record names
  const itemsWithModules = actionItems.map(item => ({
    module_type: item.module_type,
    module_id: item.module_id
  }));
  const {
    getRecordName
  } = useModuleRecordNames(itemsWithModules);

  const getItemsByStatus = (status: ActionItemStatus) => {
    return actionItems.filter(item => item.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    const {
      destination,
      source,
      draggableId
    } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId as ActionItemStatus;
    onStatusChange(draggableId, newStatus);
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return format(date, 'dd-MM-yy');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-x-auto">
        {statusColumns.map(column => {
          const items = getItemsByStatus(column.id);
          return (
            <div key={column.id} className="flex flex-col min-w-[280px]">
              {/* Column Header */}
              <div className={cn('rounded-t-lg px-4 py-3 flex items-center justify-between', column.bgColor)}>
                <span className={cn('font-semibold', column.color)}>{column.label}</span>
                <Badge className={cn('h-6 min-w-6 flex items-center justify-center', column.badgeBg)}>
                  {items.length}
                </Badge>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps} 
                    className={cn(
                      'flex-1 p-2 bg-muted/30 rounded-b-lg min-h-[300px] space-y-2',
                      snapshot.isDraggingOver && 'bg-muted/50'
                    )}
                  >
                    {items.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                        No items
                      </div>
                    ) : (
                      items.map((item, index) => {
                        const priority = priorityConfig[item.priority];
                        const linkedRecordName = getRecordName(item.module_type, item.module_id);
                        const isHighPriority = item.priority === 'High';
                        
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <Card 
                                ref={provided.innerRef} 
                                {...provided.draggableProps} 
                                {...provided.dragHandleProps} 
                                className={cn(
                                  'cursor-pointer hover:shadow-md transition-all group border-l-4',
                                  isHighPriority ? priority.borderColor : 'border-l-transparent',
                                  snapshot.isDragging && 'shadow-lg rotate-[2deg] scale-[1.02]'
                                )}
                              >
                                <CardContent className="p-3 space-y-1.5">
                                  {/* Title */}
                                  <span className="text-sm line-clamp-3">{item.title}</span>

                                  {/* Description */}
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}

                                  {/* Linked Record - Plain text */}
                                  {item.module_id && linkedRecordName && (
                                    <div className="text-xs text-muted-foreground">
                                      {moduleLabels[item.module_type]}: {linkedRecordName}
                                    </div>
                                  )}

                                  {/* Footer: Due Date, Assignee, and Actions */}
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                      {item.due_date && (
                                        <div className="flex items-center gap-1">
                                          <CalendarIcon className="h-3 w-3" />
                                          <span>{formatDueDate(item.due_date)}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{item.assigned_to ? getUserDisplayName(item.assigned_to) : 'Unassigned'}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6" 
                                        onClick={e => {
                                          e.stopPropagation();
                                          onEdit(item);
                                        }}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 text-destructive hover:text-destructive" 
                                        onClick={e => {
                                          e.stopPropagation();
                                          onDelete(item.id);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
