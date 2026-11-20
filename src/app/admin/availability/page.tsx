import {
  WEEKDAYS,
  ensureDefaultAvailability,
  getAvailabilitySnapshot,
} from "@/lib/availability";
import {
  addBlockedDateAction,
  removeBlockedDateAction,
  saveWeeklyHoursAction,
} from "@/lib/admin/availability-actions";

export default async function AdminAvailabilityPage() {
  await ensureDefaultAvailability();
  const { rules, blockedDates } = await getAvailabilitySnapshot();
  const ruleMap = Object.fromEntries(rules.map((rule) => [rule.weekday, rule]));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Availability</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Set weekly office hours and block dates. The booking form only offers
          open times.
        </p>
      </div>

      <section className="border border-brand-navy/10 bg-white p-6">
        <h3 className="font-display text-xl text-brand-navy">Weekly hours</h3>
        <p className="mt-2 text-sm text-brand-slate">
          Hours use 24-hour time. Slots are offered hourly up to the end time
          (for example 09:00-17:00 offers 9 AM through 4 PM).
        </p>

        <form action={saveWeeklyHoursAction} className="mt-6 space-y-3">
          {WEEKDAYS.map((day) => {
            const rule = ruleMap[day.value];
            return (
              <div
                key={day.value}
                className="grid items-center gap-3 border border-brand-navy/10 p-3 sm:grid-cols-[8rem_auto_1fr_1fr]"
              >
                <label className="flex items-center gap-2 text-sm text-brand-navy">
                  <input
                    type="checkbox"
                    name={`active_${day.value}`}
                    defaultChecked={Boolean(rule?.active)}
                    className="h-4 w-4 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
                  />
                  {day.label}
                </label>
                <span className="hidden text-xs uppercase tracking-[0.12em] text-brand-navy/45 sm:inline">
                  Open
                </span>
                <label className="block text-sm text-brand-slate">
                  <span className="sr-only">Start</span>
                  <input
                    type="time"
                    name={`start_${day.value}`}
                    defaultValue={rule?.startTime || "09:00"}
                    className="w-full border border-brand-navy/15 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-pink"
                  />
                </label>
                <label className="block text-sm text-brand-slate">
                  <span className="sr-only">End</span>
                  <input
                    type="time"
                    name={`end_${day.value}`}
                    defaultValue={rule?.endTime || "17:00"}
                    className="w-full border border-brand-navy/15 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-pink"
                  />
                </label>
              </div>
            );
          })}

          <button
            type="submit"
            className="mt-4 inline-flex bg-brand-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light"
          >
            Save weekly hours
          </button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-brand-navy/10 bg-white p-6">
          <h3 className="font-display text-xl text-brand-navy">
            Block a date
          </h3>
          <form action={addBlockedDateAction} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
                Date
              </span>
              <input
                type="date"
                name="date"
                required
                className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
                Reason (optional)
              </span>
              <input
                name="reason"
                placeholder="Holiday, travel, private appointments"
                className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
              />
            </label>
            <button
              type="submit"
              className="inline-flex bg-brand-pink px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink-dark"
            >
              Block date
            </button>
          </form>
        </div>

        <div className="border border-brand-navy/10 bg-white p-6">
          <h3 className="font-display text-xl text-brand-navy">
            Blocked dates
          </h3>
          <ul className="mt-5 divide-y divide-brand-navy/8">
            {blockedDates.length === 0 ? (
              <li className="py-4 text-sm text-brand-slate">
                No blocked dates yet.
              </li>
            ) : (
              blockedDates.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-brand-navy">{item.date}</p>
                    <p className="text-brand-slate">
                      {item.reason || "Unavailable"}
                    </p>
                  </div>
                  <form action={removeBlockedDateAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
