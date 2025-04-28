"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';

type TimeSlot = {
  open: string;
  close: string;
};

type DaySchedule = {
  isOpen: boolean;
  timeSlots: TimeSlot[];
};

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const timeOptions = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h.toString().padStart(2, '0');
    const minute = m.toString().padStart(2, '0');
    timeOptions.push(`${hour}:${minute}`);
  }
}

export function RestaurantHours() {
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Monday: {
      isOpen: true,
      timeSlots: [{ open: '09:00', close: '22:00' }],
    },
    Tuesday: {
      isOpen: true,
      timeSlots: [{ open: '09:00', close: '22:00' }],
    },
    Wednesday: {
      isOpen: true,
      timeSlots: [{ open: '09:00', close: '22:00' }],
    },
    Thursday: {
      isOpen: true,
      timeSlots: [{ open: '09:00', close: '22:00' }],
    },
    Friday: {
      isOpen: true,
      timeSlots: [{ open: '09:00', close: '23:00' }],
    },
    Saturday: {
      isOpen: true,
      timeSlots: [{ open: '10:00', close: '23:00' }],
    },
    Sunday: {
      isOpen: true,
      timeSlots: [{ open: '10:00', close: '21:00' }],
    },
  });

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'open' | 'close', value: string) => {
    setSchedule((prev) => {
      const newTimeSlots = [...prev[day].timeSlots];
      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [field]: value,
      };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots,
        },
      };
    });
  };

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => {
      const lastSlot = prev[day].timeSlots[prev[day].timeSlots.length - 1];
      const newTimeSlots = [
        ...prev[day].timeSlots,
        { open: lastSlot.close, close: '22:00' },
      ];
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots,
        },
      };
    });
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => {
      const newTimeSlots = prev[day].timeSlots.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots.length ? newTimeSlots : [{ open: '09:00', close: '17:00' }],
        },
      };
    });
  };

  const copyToAllDays = (fromDay: string) => {
    const daySchedule = schedule[fromDay];
    const newSchedule = { ...schedule };
    
    for (const day of days) {
      if (day !== fromDay) {
        newSchedule[day] = {
          isOpen: daySchedule.isOpen,
          timeSlots: [...daySchedule.timeSlots.map(slot => ({ ...slot }))],
        };
      }
    }
    
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      {days.map((day) => {
        const daySchedule = schedule[day];
        return (
          <div key={day}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id={`${day}-toggle`}
                  checked={daySchedule.isOpen}
                  onCheckedChange={() => toggleDay(day)}
                />
                <Label htmlFor={`${day}-toggle`} className="font-medium">{day}</Label>
              </div>
              {day === 'Monday' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToAllDays(day)}
                >
                  Apply to all days
                </Button>
              )}
            </div>
            
            {daySchedule.isOpen && (
              <div className="mt-3 pl-10 space-y-3">
                {daySchedule.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={slot.open}
                      onValueChange={(value) => updateTimeSlot(day, index, 'open', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Open" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`open-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select
                      value={slot.close}
                      onValueChange={(value) => updateTimeSlot(day, index, 'close', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Close" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`close-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {daySchedule.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(day, index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => addTimeSlot(day)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time Slot
                </Button>
              </div>
            )}
            
            {day !== 'Sunday' && <Separator className="mt-4" />}
          </div>
        );
      })}
    </div>
  );
}