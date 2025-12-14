import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  plannedDate: string;
  status: string;
  priority: string;
  estimatedCost: number;
  vendor: string;
}

interface PlanCalendarViewProps {
  plans: Plan[];
  onPlanClick?: (plan: Plan) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "bg-emerald-500";
    case "pending": return "bg-amber-500";
    case "draft": return "bg-slate-400";
    default: return "bg-slate-400";
  }
};

const getPriorityBorder = (priority: string) => {
  switch (priority) {
    case "high": return "border-l-red-500";
    case "medium": return "border-l-blue-500";
    case "low": return "border-l-slate-400";
    default: return "border-l-slate-400";
  }
};

export function PlanCalendarView({ plans, onPlanClick }: PlanCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const getPlansForDay = (date: Date) => {
    return plans.filter(plan => isSameDay(new Date(plan.plannedDate), date));
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Calendar View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center bg-slate-100 rounded-lg">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-9 w-9">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-4 font-semibold text-slate-700 min-w-[140px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-9 w-9">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-slate-600">Draft</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-semibold text-slate-500"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for alignment */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-32 bg-slate-50/50 rounded-lg" />
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dayPlans = getPlansForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "h-32 p-2 rounded-lg border transition-colors overflow-hidden",
                  isCurrentDay 
                    ? "bg-blue-50/50 border-blue-200" 
                    : "bg-white border-slate-100 hover:border-blue-200"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isCurrentDay ? "text-blue-600" : "text-slate-700"
                )}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[88px]">
                  {dayPlans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => onPlanClick?.(plan)}
                      className={cn(
                        "text-xs p-1.5 rounded cursor-pointer border-l-2 bg-slate-50 hover:bg-slate-100 transition-colors truncate",
                        getPriorityBorder(plan.priority)
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", getStatusColor(plan.status))} />
                        <span className="truncate font-medium text-slate-700">{plan.item}</span>
                      </div>
                    </div>
                  ))}
                  {dayPlans.length > 3 && (
                    <div className="text-xs text-blue-600 font-medium pl-1">
                      +{dayPlans.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
