// Splits a merged ticket into the issues inside it. causes.ts tells parser from hint by tenant;
// a report the desk read as a one-day move (desk-notes.json) is neither: its date shifts, it does not swap.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Issue = Cause | 'shift' | 'unplaced';

export const ISSUES: Record<Issue, string> = {
  parser: 'The shared parser reads day-first dates month first: day and month swap.',
  hint: 'The booking-v3 form hint says MM/DD/YYYY, the form reads day first: dates typed as told swap.',
  shift: 'Dates move back one day across time zones: no swap, a one-day move.',
  unplaced: 'No tenant on file, or a month-first tenant: no cause yet.',
};

export function issueOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Issue {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type IssueGroup = { issue: Issue; reports: Report[]; tenants: number; channels: string; misTagged: number; firstSeen: string; lastSeen: string };

export function splitTicket(all: Report[], ticket: number, tenantOf: (r: Report) => Tenant | undefined, oneDayMove: readonly string[]): IssueGroup[] {
  const by = new Map<Issue, Report[]>();
  for (const r of uniqueById(all).filter((r) => r.mergedInto === ticket)) {
    const i = issueOf(r, tenantOf(r), oneDayMove);
    by.set(i, [...(by.get(i) ?? []), r]);
  }
  return [...by.entries()]
    .map(([issue, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      const ch = rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {});
      return {
        issue,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        channels: Object.entries(ch).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ×${n}`).join(' · '),
        // Intake only knows parser and hint; anything else it tags is a guess that missed.
        misTagged: rs.filter((r) => r.meta.intakeTag !== issue).length,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}
