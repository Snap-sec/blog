---
layout: post
title:  "Vulnerability Groups - Giving Your Findings List a Shape"
author: snapsec
categories: [ Product,Vulnerability-management]
image: assets/images/vulnerability-groups.png
---

## Introdution

A mature vulnerability management program doesn't struggle with a lack of findings—it struggles with making sense of them.

As organizations onboard vulnerability scanners, penetration test reports, bug bounty submissions, and third-party assessments, the number of findings grows quickly. Before long, security teams are working from a vulnerability list containing hundreds or even thousands of records.

The challenge isn't collecting vulnerabilities. It's answering the operational questions that arise every day.

- **How many Cross-Site Scripting (XSS) findings are still unresolved?**
- **Have we closed everything reported during the Q1 web application penetration test?**
- **A newly disclosed CVE affects one of our technology stacks—how many assets are impacted?**
- **Are access control issues becoming a recurring trend across our applications?**

These questions can be answered with filters, but only temporarily. Once the filters are cleared, the context disappears. The next person often recreates the same search using slightly different criteria, leading to inconsistent counts and duplicated effort.

**Vulnerability Groups** in Snapsec VM solve this by turning related vulnerabilities into persistent, reusable collections. Instead of repeatedly rebuilding the same views, security teams can organize findings into named groups that remain available for reporting, remediation, and ongoing tracking.

---

## A Group Turns Findings into Actionable Context

![Image 1](/assets/images/vulnerability-groups-custom.png)

**Custom tab, the group grid**

The **Custom** tab is where the value of Vulnerability Groups becomes immediately clear. Each card represents a named group of related vulnerabilities, along with **Open** and **Resolved** counts that provide an instant view of remediation progress.

Without opening a single group, you can quickly see which initiatives still require attention and which have been completed. For example, **Web App Pen-Test Q1** has no open findings, while **Encryption & TLS Issues** and **Legacy System Review** still contain unresolved vulnerabilities.

Beyond Custom groups, Snapsec VM also organizes findings **By CVE** and **By CWE**, giving teams multiple ways to understand and prioritize their vulnerabilities. Together, these views help transform a long list of findings into organized, actionable work.

---

## Custom Groups: Organize Findings Around Your Workflow

![Image 2](/assets/images/vulnerability-groups-create.png)

**Create Vulnerability List dialog**

Creating a Custom Group is intentionally simple—just provide a name and description, then add the relevant findings. The flexibility comes from **how** you choose to organize your vulnerabilities.

Some teams group findings by engagement, such as **Web App Pen-Test Q1** or **Web App Pen-Test Q2**, making it easy to track remediation for a specific assessment. Others group vulnerabilities by category, such as **Encryption & TLS Issues** or **Auth & Session Management**, to address similar issues together. Groups can also represent ownership, business units, or ongoing risk initiatives like **Legacy System Review**.

The key is consistency. A clear naming convention makes groups easy to find, easier to maintain, and more valuable for reporting over time.

---

## By CVE: Understand Your Exposure

![Image 3](/assets/images/vulnerability-groups-cve.png)

**By CVE tab**

While Custom Groups organize findings around your workflow, the **By CVE** view automatically groups vulnerabilities by their associated **Common Vulnerabilities and Exposures (CVE)** identifiers.

This view is particularly useful when a new security advisory is released. Instead of searching through individual findings, you can quickly see how many vulnerability records are associated with a specific CVE and prioritize remediation accordingly.

Whether responding to an emerging vulnerability or answering customer security questionnaires, the **By CVE** view provides a fast, centralized way to assess your organization's exposure to known vulnerabilities.

---

## By CWE: Identify Recurring Weaknesses

![Image 4](/assets/images/vulnerability-groups-cwe.png)

**By CWE tab**

While the **By CVE** view highlights exposure to known vulnerabilities, the **By CWE** view groups findings by their underlying software weakness. This helps security teams identify recurring patterns that may require broader remediation efforts.

For example, a high concentration of findings under **Improper Access Control (CWE-284)** or **Sensitive Information Exposure (CWE-200)** can indicate areas where secure development practices, code reviews, or architectural improvements deserve greater attention.

By revealing which weakness categories appear most frequently, the **By CWE** view helps teams prioritize secure coding initiatives, measure improvement over time, and focus remediation efforts where they can have the greatest impact.

---

## Drilling in: where a group becomes work

A group provides a high-level summary, but selecting it opens the underlying vulnerability list where remediation work begins. Whether you enter from a **CVE** or **CWE** group, you're taken to the same detailed view with all associated findings.

![Image 5](/assets/images/vulnerability-groups-cve-list.png)

**vulnerability list opened from a CVE group**

Each finding includes key details such as **severity, owner, age, and status**, while the state histogram provides a complete view of the remediation lifecycle. Beyond simple open and closed states, Snapsec VM supports statuses such as **In Review**, **Triaged**, **Retest**, **Fixed in Staging**, **Resolved**, **Risk Accepted**, **False Positive**, and **Not Applicable**.

These states provide valuable context throughout the remediation process. For example, **Fixed in Staging** indicates that a fix has been implemented but is not yet in production, while **Risk Accepted** preserves an auditable record of approved business decisions instead of treating them as resolved. Similarly, **False Positive** and **Duplicate** help maintain accurate metrics without losing historical context, and **Retest** ensures findings are verified before closure.

![Image 6](/assets/images/vulnerability-groups-cwe-list.png)

**vulnerability list opened from a CWE group, with a filter applied**

The same vulnerability list can also be accessed through a **CWE** group, where additional filters help narrow the scope further. Combining grouping with filtering enables teams to focus on related findings, prioritize remediation efficiently, and address vulnerabilities with similar characteristics as a coordinated effort rather than treating every finding in isolation.

---

## How Vulnerability Groups Support Day-to-Day Operations

Vulnerability Groups are designed to support everyday vulnerability management—not just reporting.

Security teams can use **Custom Groups** to monitor ongoing assessments and remediation efforts, **By CVE** to quickly evaluate exposure when new vulnerabilities are disclosed, and **By CWE** to identify recurring weakness patterns that may require broader remediation or secure development improvements.

By organizing findings into meaningful groups, Snapsec VM helps teams move beyond managing individual vulnerabilities and focus on remediation as structured, trackable work. Instead of repeatedly filtering long lists of findings, teams can work from persistent views that provide consistent visibility throughout the vulnerability lifecycle.

---

## From Findings to Structured Remediation

A vulnerability list shows you **what** was found.

**Vulnerability Groups** help you understand **how those findings relate to one another and how to act on them**.

This distinction becomes increasingly important as vulnerability programs scale. When security teams manage hundreds or thousands of findings from vulnerability scanners, penetration tests, bug bounty submissions, and third-party assessments, treating every finding as an isolated record can quickly become inefficient.

Vulnerability Groups provide persistent context around those findings.

A penetration testing team can create a Custom Group for a specific engagement and continue tracking its findings throughout remediation.

A vulnerability management team can use the **By CVE** view to quickly understand the organization's exposure when a new vulnerability is disclosed.

Security and development teams can use **By CWE** to identify recurring weaknesses and determine whether broader secure development or architectural improvements are required.

This creates a more structured workflow:

**Organize → Review → Prioritize → Remediate → Retest → Resolve**

Instead of repeatedly rebuilding the same filters, teams can return to the same group and continue working from an established scope.

---

## Conclusion

A vulnerability list shows you **what** was found. **Vulnerability Groups** help you understand **how those findings relate to one another and how to act on them**.

Whether you're tracking findings from a penetration test, responding to a newly disclosed CVE, or identifying recurring weakness patterns through CWE, Vulnerability Groups provide a structured way to organize, prioritize, and monitor remediation efforts.

By turning individual findings into persistent, meaningful groups, Snapsec VM enables security teams to collaborate more effectively, track progress with confidence, and manage vulnerabilities with greater consistency throughout their lifecycle.

## CTA

**Ready to simplify vulnerability management?**

**Book a demo of Snapsec VM and see Vulnerability Groups in action.**
