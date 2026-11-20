export const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
] as const;

export const DEFAULT_WEEKLY_HOURS = [
  { weekday: 1, startTime: "09:00", endTime: "17:00", active: true },
  { weekday: 2, startTime: "09:00", endTime: "17:00", active: true },
  { weekday: 3, startTime: "09:00", endTime: "17:00", active: true },
  { weekday: 4, startTime: "09:00", endTime: "17:00", active: true },
  { weekday: 5, startTime: "09:00", endTime: "17:00", active: true },
  { weekday: 0, startTime: "09:00", endTime: "17:00", active: false },
  { weekday: 6, startTime: "09:00", endTime: "17:00", active: false },
] as const;

export type TimeSlot = {
  value: string;
  label: string;
};

function parseMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTimeValue(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatTimeLabel(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function buildSlots(startTime: string, endTime: string): TimeSlot[] {
  const start = parseMinutes(startTime);
  const end = parseMinutes(endTime);
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return [];

  const slots: TimeSlot[] = [];
  for (let cursor = start; cursor + 60 <= end; cursor += 60) {
    const value = formatTimeValue(cursor);
    slots.push({ value, label: formatTimeLabel(value) });
  }
  return slots;
}

export function getDateWeekday(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

export function getOpenSlotsForDate(input: {
  date: string;
  rules: Array<{
    weekday: number;
    startTime: string;
    endTime: string;
    active: boolean;
  }>;
  blockedDates: Array<{ date: string }>;
  busyAppointments: Array<{ preferredDate: string; preferredTime: string }>;
}) {
  if (input.blockedDates.some((item) => item.date === input.date)) {
    return [] as TimeSlot[];
  }

  const weekday = getDateWeekday(input.date);
  const rule = input.rules.find((item) => item.weekday === weekday && item.active);
  if (!rule) return [] as TimeSlot[];

  const taken = new Set(
    input.busyAppointments
      .filter((item) => item.preferredDate === input.date)
      .map((item) => item.preferredTime),
  );

  return buildSlots(rule.startTime, rule.endTime).filter(
    (slot) => !taken.has(slot.value),
  );
}

export function isDateOpen(input: {
  date: string;
  rules: Array<{ weekday: number; active: boolean }>;
  blockedDates: Array<{ date: string }>;
}) {
  if (input.blockedDates.some((item) => item.date === input.date)) return false;
  const weekday = getDateWeekday(input.date);
  return input.rules.some((item) => item.weekday === weekday && item.active);
}
