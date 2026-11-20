import { cacheTag } from "next/cache";
import { prisma } from "@/lib/db";
import {
  DEFAULT_WEEKLY_HOURS,
  getOpenSlotsForDate,
} from "@/lib/availability-utils";

export const AVAILABILITY_TAG = "availability";

export {
  WEEKDAYS,
  DEFAULT_WEEKLY_HOURS,
  buildSlots,
  formatTimeLabel,
  getDateWeekday,
  getOpenSlotsForDate,
  isDateOpen,
  type TimeSlot,
} from "@/lib/availability-utils";

type Snapshot = {
  rules: Array<{
    id: string;
    weekday: number;
    startTime: string;
    endTime: string;
    active: boolean;
  }>;
  blockedDates: Array<{
    id: string;
    date: string;
    reason: string | null;
    createdAt: Date;
  }>;
  busyAppointments: Array<{
    preferredDate: string;
    preferredTime: string;
  }>;
};

function defaultRulesSnapshot(): Snapshot["rules"] {
  return DEFAULT_WEEKLY_HOURS.map((rule) => ({
    id: `default-${rule.weekday}`,
    weekday: rule.weekday,
    startTime: rule.startTime,
    endTime: rule.endTime,
    active: rule.active,
  }));
}

export async function ensureDefaultAvailability() {
  const count = await prisma.availabilityRule.count();
  if (count > 0) return;

  await prisma.availabilityRule.createMany({
    data: DEFAULT_WEEKLY_HOURS.map((rule) => ({ ...rule })),
  });
}

async function loadAvailabilitySnapshot(): Promise<Snapshot> {
  try {
    const [rules, blockedDates, busyAppointments] = await Promise.all([
      prisma.availabilityRule.findMany({ orderBy: { weekday: "asc" } }),
      prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
      prisma.appointment.findMany({
        where: { status: { in: ["requested", "confirmed"] } },
        select: { preferredDate: true, preferredTime: true },
      }),
    ]);

    return {
      rules: rules.length > 0 ? rules : defaultRulesSnapshot(),
      blockedDates,
      busyAppointments,
    };
  } catch {
    return {
      rules: defaultRulesSnapshot(),
      blockedDates: [],
      busyAppointments: [],
    };
  }
}

export async function getAvailabilitySnapshot() {
  "use cache";
  cacheTag(AVAILABILITY_TAG);
  return loadAvailabilitySnapshot();
}

export async function assertSlotIsBookable(date: string, time: string) {
  const snapshot = await loadAvailabilitySnapshot();
  const openSlots = getOpenSlotsForDate({
    date,
    rules: snapshot.rules,
    blockedDates: snapshot.blockedDates,
    busyAppointments: snapshot.busyAppointments,
  });
  return openSlots.some((slot) => slot.value === time);
}
