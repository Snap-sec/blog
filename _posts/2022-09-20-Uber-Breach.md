---
layout: post
title:  "Uber Breach - Few Security Takeaways"
author: snapsec
categories: [ uber ]
image: assets/images/18/1.png
---


On 15 September, UBER acknowledged that it was responding to a "cybersecurity incident" and had contacted law authorities about the hack. An individual claiming to be an 18-year-old hacker claimed credit for the attack. On Thursday night, the attacker reportedly tweeted, "Hi I declare I am a hacker and UBER has suffered a data breach," in a channel on UBER's Slack. The hacker claimed to have compromised a variety of Uber accounts and cloud services.

The public message below was posted by a hacker on behalf of the Uber account for bug hunters on the bug bounty platform HackerOne, informing everyone of this incident

![1](/blog/assets/images/18/7.jpeg)



## How did UBER Got Compromised:

Following the incident, a member of the security community communicated with an attacker via telegram. This is a brief screenshot of that communication.

![1](/blog/assets/images/18/2.png)

The attacker admits in the screenshot that he used social engineering to hack an Uber employee, then used his VPN to access Uber's internal network and searched there for possibilities to escalate privileges.

Let's break it down into further steps to understand what exactly happend.

**Attacker Stealing UBER Employees Credentials**

The attacker has been quite open about how they hacked into the corporate network of UBER. 


Its obvious that the first step was to grab the credentials of an employee, So an attacker used an fake UBER login page, to trick UBER employee into logging into his fake page and get his credentials. However It appears that UBER uses MFA (Duo) push notifications for its internal staff. And to actually gain access to the hacked employees account, The attacker had to bypass the 2FA.

**Attacker Bypassing 2FA**

Even though 2FA is a good security measure which can prevent attackers from gaining access to compromised account but MFA itself can be prone to Social engineering Attacks.  

Among the attacks MFA is prone to ,MFA fatigue Attack is one of one of them, *Multi factor [authentication](https://portswigger.net/daily-swig/authentication) (MFA) fatigue is the name given to a technique used by adversaries to flood a user’s authentication app with push notifications in the hope they will accept and therefore enable an attacker to gain entry to an account or device.*

Read more about **[MFA fatigue attacks](https://portswigger.net/daily-swig/mfa-fatigue-attacks-users-tricked-into-allowing-device-access-due-to-overload-of-push-notifications)** *from PortSwigger Blog*

**Attacker Accessing the VPN** 

Once an employee was hacked, the attacker appears to have utilized that victim's existing VPN access to pivot to the internal network. Generally, Internal infrastructure is frequently less audited and appraised than external infrastructure. From the screenshot, it’s clearly mentioned that he Scanned the internal network for more resource and services to exploit.

**Attacker Finding a Sensitive Powershell Script**

While scanning the internal network of an UBER team, The attacker appears to have discovered an internal network share containing scripts and privileged credentials, granting them access to the wide varity of Systems . Below is the list of Environments that were compromised by attacker

- Slack
- Google Workspace Admin
- AWS Accounts
- HackerOne Admin
- SentinelOne EDR
- vSphere
- Financial Dashboards

To Support his claim the attacker shared several screenshots of UBER's internal environment, including their GDrive, VCenter, sales metrics, Slack, and even their EDR portal. Click [Here](https://twitter.com/BillDemirkapi/status/1570602545017683968?s=20&t=dCzHPOq-jOuYBmm9Xe3VYQ) to view images.


## What Are Some Good Lessons To Take From This Security Incident



Let’s go back to the story where it actually started, The attacker compromised an Employee by exploiting not a Security Vulnerability in any of their services but using an Social Engineering Attack which lead attacker to steal Credentials of an Employee.

**Mitigating the greatest security vulnerability: Humans**

According to an IBM research, human error is the root cause of 95% of cyber security breaches. In other words, if human error could be completely eradicated, 19 out of 20 cyber breaches may not have occurred at all!

This emphasizes that people who work within the organization should be educated on a constant schedule about their roles and responsibilities in keeping the company safe. This may be accomplished by good privilege management and adequate security trainings inside organizations.

So just to keep it precise and crisp, Humans within the organisation needs continuous patches and updates exactly the way your softwares do and that can be done by providing them with proper cyber security awareness and trainings.

**Running More Phishing Campaign's**

 

Phishing is popular with cybercriminals because it enables them to steal financial and personal information by exploiting human behavior. Due to the fact that just one mistake by one employee clicking on one link could result in fraud, a data breech, huge costs, and damage the company’s reputation, By preparing your staff to recognize and report social engineering threats, You may easily reduce your chances of being hacked by using a social engineering approach.

Anti-phishing and security training programs educate staff on the many sorts of attacks, how to spot subtle signals, and how to report questionable emails to your IT department. Phishing simulations are commonly used in training to test and reinforce good employee behavior. Advanced technologies offer extremely changeable attack simulations for a wide range of vectors, including speech, text messages, and finding physical media. Vishing, also known as voice phishing, employs a phone message to entice potential victims to call back and provide personal information. Fake caller-ID information is frequently used by cybercriminals to make calls appear to be from a reputable organization or business. Smishing, also known as SMS phishing, is a type of phishing that uses text messages to trick victims into giving account information or installing malware.

So continuous simulating phishing attacks against your orginisation and indentifying employees with vulnerable behaviours and training them should be an important aspect of your company's cybersecurity.

**Using Phishing Resistant MFA**

Phishing-resistant MFA is multi-factor authentication (MFA) that is resistant to attempts to compromise or subvert the authentication process. Phishing attacks, such as spear phishing, brute force attacks, man-in-the-middle attacks, replay attacks, and credential stuffing, are frequently used to accomplish this. It is possible to prevent phishing attacks within an authentication mechanism by mandating that each party prove their identity as well as their intent through deliberate action. Contrary to popular belief, passwords, SMS and other One-Time Passwords (OTP), security questions, and even push notifications are not considered phishing resistant mechanisms because they are all vulnerable to some or all of the aforementioned attacks. By using a FIDO authenticator, for instance, MFA can prevent phishing attacks and also improve user experience. Red more about it [Here](https://blog.hypr.com/what-is-phishing-resistant-mfa).

**Setting up a policy for Storage of Sensitive Information**

Lack of controls in place to ensure that all categories of data are handled appropriately as a result of not setting policies to systematically and consistently classify their data. This results in an ignorance of where their sensitive data is located.

For example, if a company has a policy that says any data set that contains personally identifying information is considered to be “sensitive” and has to be encrypted both in transit across a network and at rest, and the company has implemented technical controls to enforce that policy, it is very likely that the data set is safe.

There is also a user education dimension to this problem - users need to understand the sensitivity of the data they work with and their role in keeping it safe. In many cases, this involves educating users about what *not* to do.


*Every organisation is prone to cyber attacks, no matter how big or how small they are, because criminals are more interested in exploiting vulnerabilities than specific organisations*. But Every breach has some lessons to take, Infact there is much more uber breach had brought to us but as for now Let's consider these few points and move on from this astonishing breach of 2022.


## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
 
