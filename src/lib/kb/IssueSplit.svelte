<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import tickets from '#lib/data/tickets-4471.json';
  import { ISSUES, splitTicket, type Issue } from '#lib/kb/split';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  let { ticket }: { ticket: number } = $props();

  const groups = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const total = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const misTagged = $derived(groups.reduce((n, g) => n + g.misTagged, 0));
  const issueNo = (i: Issue) => (tickets.issues as Record<string, number>)[i];
  const url = (n: number) => `https://github.com/${tickets.repo}/issues/${n}`;
</script>

<p class="sum">
  <strong>{total}</strong> reports in #{ticket} · <strong>{groups.length}</strong>
  {groups.length === 1 ? 'issue' : 'issues'} · <strong>{groups.filter((g) => issueNo(g.issue)).length}</strong> with a ticket of their own
</p>

<table>
  <thead>
    <tr><th>ticket</th><th>issue</th><th>reports</th><th>tenants</th><th>came in by</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.issue)}
      {@const n = issueNo(g.issue)}
      <tr class:open={!n}>
        <td>{#if n}<a href={url(n)}>{tickets.repo}#{n}</a>{:else}none yet{/if}</td>
        <td><code>{g.issue}</code> {ISSUES[g.issue]}</td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td class="small">{g.channels}</td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">Intake's tag disagrees with the issue for {misTagged} of {total} reports. Read the tenant, not the tag.</p>

<style>
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
</style>
