---
layout: post
title:  "Uber Breach - Few Security Takeaways"
author: snapsec
categories: [ uber ]
image: assets/images/18/1.png
---


On 15 September, UBER acknowledged that it was responding to a "cybersecurity incident" and had contacted law authorities about the hack. An individual claiming to be an 18-year-old hacker claimed credit for the attack. On Thursday night, the attacker reportedly tweeted, "Hi I declare I am a hacker and UBER has suffered a data breach," in a channel on UBER's Slack. The hacker claimed to have compromised a variety of Uber accounts and cloud services.

## How did UBER Got Compromised:

**Grabbing UBER Employees Credentials**

The attacker has been quite open about how they hacked into the corporate network of UBER. 

![1](/blog/assets/images/18/2.png)

Its obvious that the first step was to grab the credentials of an employee, So an attacker used an fake UBER login page, to trick UBER employee into logging into his fake page and get his credentials. However It appears that UBER uses MFA (Duo) push notifications for its internal staff. And to actually gain access to the hacked employees account, The attacker had to bypass the 2FA.

**Bypassing 2FA**

Even though 2FA is a good security measure which can prevent attackers from gaining access to compromised account but MFA itself can be prone to Social engineering Attacks.  

Among the attacks MFA is prone to ,MFA fatigue Attack is one of one of them, *Multi factor [authentication](https://portswigger.net/daily-swig/authentication) (MFA) fatigue is the name given to a technique used by adversaries to flood a user’s authentication app with push notifications in the hope they will accept and therefore enable an attacker to gain entry to an account or device.*

Read more about **[MFA fatigue attacks](https://portswigger.net/daily-swig/mfa-fatigue-attacks-users-tricked-into-allowing-device-access-due-to-overload-of-push-notifications)** *from PortSwigger Blog*

**Accessing the VPN** 

Once an employee was hacked, the attacker appears to have utilized that victim's existing VPN access to pivot to the internal network. Generally, Internal infrastructure is frequently less audited and appraised than external infrastructure. From the screenshot, it’s clearly mentioned that he Scanned the internal network for more resource and services to exploit.

**Finding a Sensitive Powershell Script**

While scanning the internal network of an UBER team, The attacker appears to have discovered an internal network share containing scripts and privileged credentials, granting them access to the wide varity of Systems . Below is the list of Environments that were compromised by attacker

- Slack
- Google Workspace Admin
- AWS Accounts
- HackerOne Admin
- SentinelOne EDR
- vSphere
- Financial Dashboards

To Support his claim the attacker shared several screenshots of UBER's internal environment, including their GDrive, VCenter, sales metrics, Slack, and even their EDR portal.

![1](/blog/assets/images/18/3.jpeg){:height="400px" width="400px"}
![1](/blog/assets/images/18/4.jpeg){:height="400px" width="400px"}
![1](/blog/assets/images/18/5.jpeg){:height="400px" width="400px"}
![1](/blog/assets/images/18/6.jpeg){:height="400px" width="400px"}





## What are some good lesson to take from the breach

Let’s go back to the story where it actually started, The attacker compromised an Employee by exploiting not a Security Vulnerability in any of their services but using an Social Engineering Attack which lead attacker to steal Credentials of an Employee.

**Mitigating the greatest security vulnerability: Humans**

According to an IBM research, human error is the root cause of 95% of cyber security breaches. In other words, if human error could be completely eradicated, 19 out of 20 cyber breaches may not have occurred at all!

This emphasizes that people who work within the organization should be educated on a constant schedule about their roles and responsibilities in keeping the company safe. This may be accomplished by good privilege management and adequate security trainings inside organizations.

So just to keep it precise and crisp, Humans within the organisation needs continuous patches and updates exactly the way your softwares do.

**Running More Phishing Campaign's**

 

Phishing is popular with cybercriminals because it enables them to steal financial and personal information by exploiting human behavior. Due to the fact that just one mistake by one employee clicking on one link could result in fraud, a data breech, huge costs, and damage the company’s reputation, By preparing your staff to recognize and report social engineering threats, phishing simulation protects your company from these threats.

So continuous simulation and training help your employees fight phishing attacks and other cyber security threats should be a fundamental part of your security.

**Using Phishing Resistant MFA**

Phishing-resistant MFA is multi-factor authentication (MFA) that is resistant to attempts to compromise or subvert the authentication process. Phishing attacks, such as spear phishing, brute force attacks, man-in-the-middle attacks, replay attacks, and credential stuffing, are frequently used to accomplish this. It is possible to prevent phishing attacks within an authentication mechanism by mandating that each party prove their identity as well as their intent through deliberate action. Contrary to popular belief, passwords, SMS and other One-Time Passwords (OTP), security questions, and even push notifications are not considered phishing resistant mechanisms because they are all vulnerable to some or all of the aforementioned attacks. By using a FIDO authenticator, for instance, MFA can prevent phishing attacks and also improve user experience. Red more about it [Here](https://blog.hypr.com/what-is-phishing-resistant-mfa).

**Setting up a policy for Storage of Sensitive Information**

Lack of controls in place to ensure that all categories of data are handled appropriately as a result of not setting policies to systematically and consistently classify their data. This results in an ignorance of where their sensitive data is located.

For example, if a company has a policy that says any data set that contains personally identifying information is considered to be “sensitive” and has to be encrypted both in transit across a network and at rest, and the company has implemented technical controls to enforce that policy, it is very likely that the data set is safe.

There is also a user education dimension to this problem - users need to understand the sensitivity of the data they work with and their role in keeping it safe. In many cases, this involves educating users about what *not* to do.

[https://twitter.com/imranparray101/status/1570635827348385792?s=20&t=m6KXmnaZz7D2rg894A9t_w](https://twitter.com/imranparray101/status/1570635827348385792?s=20&t=m6KXmnaZz7D2rg894A9t_w)

*Every organisation is prone to cyber attacks, no matter how big or how small they are, because criminals are more interested in exploiting vulnerabilities than specific organisations*. But Every breach has some lessons to take, Infact there is much more uber breach had brought to us but as for now Let's consider these few points and move on from this astonishing breach of 2022.
