---
layout: post
title: "How to Build an SLA-Driven Vulnerability Management Process"
author: snapsec
categories: [Vulnerability Management, Pentesting]
description: "Learn how to set remediation SLAs by severity, track compliance, handle violations and report progress so vulnerabilities get fixed on time."
featured: false
hidden: false
---

> **Key takeaways**
>
> - Set remediation deadlines by severity, and decide exactly how days are counted.
> - Track compliance continuously, not just at the end of the quarter.
> - Treat each violation as something to act on, not only a number to report.
> - Use owner-level results to find overloaded teams, not to blame individuals.
> - Send SLA reports to stakeholders automatically, on a fixed schedule.

Without deadlines, vulnerability remediation tends to drift. Findings get worked on when teams have time, which in practice means critical issues get attention and everything else waits. After a few months, it's hard to tell whether the backlog is under control or slowly growing.

Service level agreements (SLAs) give remediation a timeline. Each finding gets a deadline based on its severity, and the team can see at any moment which findings are on track, which are close to their deadline, and which have missed it. When we review remediation programs with clients, the ones that work well almost always have clear SLAs that someone actually monitors.

Here's how we recommend setting one up, and how Snapsec VM supports each step.

## Set timelines by severity

Start by deciding how long each severity level has to be fixed. There's no universal standard, and the right numbers depend on your risk appetite, your compliance obligations and how quickly your teams can realistically deploy fixes. A common starting point is 7 days for critical findings, 30 for high, 60 for medium and 90 for low.

It's also worth deciding how days are counted. If weekends don't count toward the deadline, a critical finding reported on a Friday afternoon gets a more realistic window. Public holidays can be handled the same way.

![SLA settings in Snapsec VM](/assets/images/sla-settings.png)

<p align="center"><em>Remediation timelines per severity, with weekend and holiday rules.</em></p>

In Snapsec VM, the SLA setup covers timelines for each severity, which weekend days count toward the calculation, and holiday exceptions imported from a calendar file. Setting these once means every finding gets its deadline automatically and consistently.

Whatever numbers you choose, write them into your vulnerability management policy and make sure the teams fixing the issues have agreed to them. SLAs that engineering teams consider unrealistic tend to be ignored.

## Decide when the clock starts

This sounds minor, but it causes a lot of disagreement later. The most common options are the date a finding is reported and the date it's confirmed during triage.

Starting at the report date is simpler and harder to game, but it means time spent on triage counts against the owner. Starting at triage is fairer to engineering teams, but it only works if triage itself happens quickly. Whichever you choose, apply it to every finding and document it, so there's no argument about whether a finding is actually late.

## Watch compliance continuously

An SLA only helps if someone looks at it before deadlines pass. A monthly or quarterly review usually finds problems after they've already happened.

The key numbers are simple: how many findings are compliant, how many are at risk of missing their deadline, how many have already breached, and how many still have no owner. Unassigned findings deserve particular attention, because without an owner, nobody is working on them.

![SLA dashboard in Snapsec VM](/assets/images/sla-dashboard.png)

<p align="center"><em>Compliant, at-risk, breached and unassigned findings, with violations by severity and department.</em></p>

Breaking violations down by severity and department shows where the problem is. A handful of breached low-severity findings spread across teams is a different situation from critical findings breaching in one department.

## Act on violations

A breached SLA should lead to a decision, not just appear in a report. For each violation, one of four things usually needs to happen: the finding needs more resources, its blocker needs to be escalated, the risk needs to be formally accepted, or the deadline was unrealistic and the policy needs revisiting.

![SLA violations in Snapsec VM](/assets/images/sla-violations.png)

<p align="center"><em>Every breached finding with its assessment, severity, owner and time overdue.</em></p>

A list of violations with the owner and time overdue makes these conversations specific. It's much easier to agree on next steps for "the IDOR on invoice download, four days overdue, owned by James" than for "24 breached findings".

Keep in mind that some findings breach for legitimate reasons, such as waiting on a vendor patch. Recording those as blockers means the conversation can focus on removing the obstacle rather than on who is at fault.

## Make accountability visible

Looking at SLA compliance per owner shows patterns that totals hide. One owner with 63% compliance and another with 91% might have very different workloads, very different systems, or very different levels of support.

![SLA leaderboard in Snapsec VM](/assets/images/sla-leaderboard.png)

<p align="center"><em>Breached, at-risk and compliant findings per owner, with a compliance percentage.</em></p>

We'd recommend using this view to start conversations, not to rank people. Low compliance often means an owner has too many findings, depends on another team, or owns systems that are hard to patch. Those are problems leadership can help with, but only once they're visible.

## Send reports automatically

Stakeholders shouldn't have to log in to find out whether remediation is on track. A short SLA report sent on a fixed schedule keeps security leadership, engineering managers and, where relevant, executives informed without anyone having to prepare it by hand.

![SLA weekly reports in Snapsec VM](/assets/images/sla-weekly-reports.png)

<p align="center"><em>Automated SLA reports sent to stakeholders on a set schedule.</em></p>

Snapsec VM can send SLA reports automatically to a list of recipients, at a chosen frequency, day and time. A weekly report on Monday morning works well for most teams, because it sets priorities for the week ahead.

## Handling exceptions

Some findings won't be fixed within their SLA, and some won't be fixed at all. Both need a documented path rather than being quietly left to breach.

If a fix is delayed for a legitimate reason, record a blocker so the delay is explained. If the organization decides not to fix a finding, handle it as a formal risk acceptance, with a justification, compensating controls, an approver and a review date. Either way, the SLA data stays honest, and nobody has to explain an unexplained breach later.

## Conclusion

SLAs turn vulnerability remediation from a list of open issues into a set of commitments with dates attached. The process doesn't need to be complicated: sensible timelines by severity, clear rules for counting days, continuous monitoring, a response to every violation, and regular reporting to the people who need to know.

Snapsec VM handles each part of this. SLA timelines, weekend rules and holiday calendars are set once and applied to every finding. The SLA dashboard, violations list and owner leaderboard show where remediation stands, and weekly reports keep stakeholders informed automatically. **[Explore the live demo](https://suite.snapsec.co/demo)** to see how it works.

## Frequently asked questions

**What are typical vulnerability remediation SLAs?**

Many organizations use something close to 7 days for critical, 30 for high, 60 for medium and 90 for low severity findings. Compliance frameworks, customer contracts and internal policy can all require shorter timelines, so check those before setting yours.

**Should SLAs be based on CVSS or on risk?**

Most organizations start with severity because it's simple and easy to audit. Over time, it's worth adjusting timelines for context, such as shorter deadlines for internet-facing assets or for vulnerabilities known to be exploited in the wild.

**What should happen when a finding breaches its SLA?**

Someone should decide what happens next: add resources, escalate a blocker, formally accept the risk, or review whether the timeline was realistic. A breach that nobody acts on is just a number in a report.

**Should weekends count toward SLA deadlines?**

It depends on whether your teams deploy fixes on weekends. If they don't, excluding weekends gives more realistic deadlines, especially for critical findings with short timelines.
