---
layout: post
title:  "Finding Multiple Security Issues on Agorapulse"
author: snapsec
categories: [Privilege-escalation,XSS,Log4Shell ]
image: assets/images/19/0.png
---





Agorapulse provides everything an organization could possibly need for social media marketing, monitoring, and management. Agorapulse is a full-featured social media management platform. Some of its features include a variety of ways to publish content, schedule posts, and report about social account usage. The software is used to create and schedule social media content, engage audiences, listen for key terms, and analyse social media performance.


## Approaching the target

The first step, as always, is to learn about the target app by interacting with its various features and functionalities. In this case the application's functionalities were extensive, and it allowed users to integrate other third-party accounts (complexity). At this stage, we appeared harmless and stealthily explored the app, understanding the *logic of the application* and making ourselves capable of using it. All of this was accomplished with the assistance of their *youtube channels, blogs, support channels, general search queries*, and so on. We investigated the *structure of API paths* and *HTTP requests* for various actions inside the application. We took note of the *IDs being used* so that we don't miss out on any **IDOR chances**. 


## Understanding their Permission Model

The agorapulse utilises a role-based access control model in their application, with roles classified into two categories:

- Organization role (Owner, Manager or a Member)
- Role on given social profile(s) (Admin, Editor, Moderator or Guest)

__Organization role:__

Organization roles define a user's permissions in terms of subscription and team settings. One can be the owner (1 per organization), a manager or a member within an orginsation

__Roles on social profiles:__

Roles on social profiles define permissions in terms of actions user is allowed to do on given social profile:
Editor - Editors have full access to the Inbox, Publishing, Reports
Moderator - Moderators have full access to Inbox, Listening, Publishing and Retweet Stuff.
Guest - Guests are in view-only mode, they cannot perform any publishing, replying or moderation actions

Read more about their [permission model](https://support.agorapulse.com/article/show/34664-how-do-i-manage-roles-for-my-team) here.



The list of a few vulnerabilities we discovered on agora pulse is provided below.



## 1 - RCE via Log4shell

Log4j has recently been discovered to be vulnerable to a number of security threats. A critical vulnerability was recently discovered in the log4j library. This flaw allows unauthenticated remote code execution on vulnerable servers and could be used to expose sensitive information from the vulnerable servers.


After some investigation, we discovered that log4j was used in their application/infrastructure somewhere, and we were able to send our payloads and receive DNS pingbacks from their vulnerable server.


![image](https://user-images.githubusercontent.com/88488902/196965064-21210527-1944-4644-9794-0c679ba73c22.png)


This *resulted in a DNS pingback* from the agora servers. After confirmation, we *exploited the vulnerability* by *reading various environment variables* of agorapulse servers without performing any sensitive *actions*. 


![image](https://user-images.githubusercontent.com/88488902/196965165-a77a7a2c-4c32-44d3-b90c-4e81296cdb1c.png)


You can go through detailed writeup about this vulnerability here [https://snapsec.co/blog/Log4shell-on-agorapulse/](https://snapsec.co/blog/Log4shell-on-agorapulse/).

## 2 - Accessing automatic scheduling reports

In agorapulse we can have our reports emailed to us automatically, so we don't need to worry about exporting them manually again. This feature is available as part of the [Power Reports add-on].
With the guest role in the organisation, a user has limited access to the organisation's social profile settings. The guest user is restricted from viewing the information contained in automatic scheduled reports.

However, we were able to identify a vulnerable endpoint with broken access control that lets an unauthorised role `guest` to gain access to restricted information about the `labels, automatic scheduled reports and Orginisation groups`.


```http
GET /api/bootstrap?accountId=[Account-id] HTTP/1.1
Host: manager.agorapulse.com 
Connection: close
Accept: application/json, text/plain, */* 
Authorization: Bearer [Value]
Agorapulse-Agent: manager-2021.08.03.0929 
Content-Type: application/json 
Origin: https://app.agorapulse.com 
Sec-Fetch-Site: same-site 
Sec-Fetch-Mode: cors 
Sec-Fetch-Dest: empty 
Referer: https://app.agorapulse.com/ 
Accept-Language: en-US,en;q=0.9
```


When the above request was forwarded with a guest user's authorization token, the response was `200 OK`, which also returned data such as information related to automatic scheduling reports, which included assignee emails, labels, and group names in that specific organisation.

![image](https://user-images.githubusercontent.com/88488902/197461247-7d8dc851-326b-4307-aab0-dcd3344985eb.png)


> Hence an attacker with a Guest role was able to escalate his privleges and access restricted information within the orginsation.

## 3 - Accessing sensitive organisation information

As mentioned previously agorapulse had various organisational roles with segregated permissions. One from the list was *guest role* which had no direct access to the *organization* but a few features like *posts to review*,  *likes*, etc. So this was a pretty good attack surface for finding a bunch of privilege escalation issues; at the beginning, We were unable to access various *instinctively vulnerable API paths* using the *credentials of the guest role*, until we came across an API endpoint.

```http
GET /api/organizations/[org-id]?organizationId=[org-id] HTTP/1.1
Host: manager.agorapulse.com 
Connection: close
Accept: application/json, text/plain, */* 
Authorization: Bearer [Value]
Agorapulse-Agent: manager-2021.08.03.0929 
Content-Type: application/json 
Origin: https://app.agorapulse.com 
Sec-Fetch-Site: same-site 
Sec-Fetch-Mode: cors 
Sec-Fetch-Dest: empty 
Referer: https://app.agorapulse.com/ 
Accept-Language: en-US,en;q=0.9
```

We premeditated the ids which were being used in the request and quickly identified that this id could return a set of various *information about the organization*, particularly *restricted to the guest role*.  


![image](https://user-images.githubusercontent.com/88488902/197373980-d4c02a75-f0f8-40bf-833d-00c0bbb6dc5e.png)


When we sent this request with the credentials of the guest role, we received a *200 OK* response with various *organization information*. The information included *scheduled calendars, email addresses of shared members, identification ids, meeting dates* and other information.


> Hence, It indicated an clear case of privilege escalation as guest role was able to leak un-authorized information about the organisation.


## 4 - Changing ROI settings from an Un-Authorized Role

Return on Investment (ROI) is a popular profitability metric used to evaluate how well an investment has performed. In agorapulse the ROI feature allows you to know the monthly value generated by your page.

With guest permission in an organization, the user has limited access to the organisation's social profile settings. Only users with admin rights can enable or disable the ROI settings for a particular page.


However, we were able to identify a Vulnerable API endpoint through which a user with guest permission was able to change the ROI settings of a page.

In the below request, by passing the id parameter of a page, a user with guest permission was able to change the ROI settings of any target page without any access to it.


```http
PUT /api/organizations/287159/workspaces/187160/settings/roi/accounts/facebook_574024 HTTP/1.1
Host: api.report.agorapulse.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Referer: https://app.agorapulse.com/
Agorapulse-Agent: manager-2021.08.04.1214
Authorization: Bearer VALUE
Content-Type: application/json
Content-Length: 118
Origin: https://app.agorapulse.com

{"roiEnabled":true,"postImpressionValue":5,"postLinkClickValue":1,"userEngagedValue":1,"accountUid":"facebook_574024"}
```






The above request returned a '200 OK' response, indicating that changes were made to the target page. By returning to the ROI setting of a page through an admin account, we were able to confirm that an attacker with the guest role was indeed able to change the ROI setting of the page.

![image](https://user-images.githubusercontent.com/88488902/197372663-b8c3e60d-4251-4dfc-8e60-9c564ff61c56.png)



> Hence, a guest role was able to change the ROI settings of a page.


## 5 - Changing general report settings like logo, timezone etc.

With guest permission in an organization, a user has no access to the general settings of social media profiles. Due to limited permissions, the guest user is not able to change the report settings. 

But we were able to identify a broken api path through which a user with guest permissions was able to change the general report settings of an organisation. The broken access on the vulnerable endpoint lets a guest change the timezone, author name, and logo for the reports.


Leveraging the above request, we can keep any random author for this organisation and also change the *timezone settings*, which can lead to disruption in automatic postings on accounts.

```http
PUT /api/organizations/287157/workspaces/187158/settings/accounts/facebook_574363 HTTP/1.1
Host: api.report.agorapulse.com
Connection: close
Content-Length: 124
Authorization: Bearer 
Agorapulse-Agent: manager-2021.08.10.0923
Content-Type: application/json
Origin: https://app.agorapulse.com
Referer: https://app.agorapulse.com/
Accept-Language: en-US,en;q=0.9

{"accountUid":"facebook_574363","authorName":"Waris","browserTimezoneEnabled":true,"locale":"en","timezone":"Asia/Calcutta"}
```

We also discovered that it was possible to change the author's Profile Picture by simply adding a new key (authorPictureUrl) in JSON request. So, if we send the above request with the authorization token of the guest and add a new key and value in JSON body which is authorPictureURl and then click on the send button, we can see the response is 200 ok, which means that a guest can change the author name, time zone, and profile picture without having any permissions.


```http
PUT /api/organizations/287157/workspaces/187158/settings/accounts/facebook_574363 HTTP/1.1
Host: api.report.agorapulse.com
Connection: close
Content-Length: 124
Authorization: Bearer 
Agorapulse-Agent: manager-2021.08.10.0923
Content-Type: application/json
Origin: https://app.agorapulse.com
Referer: https://app.agorapulse.com/
Accept-Language: en-US,en;q=0.9

{"accountUid":"facebook_574363","authorName":"Waris","authorPictureUrl":"PICTURE-URL","browserTimezoneEnabled":true,"locale":"en","timezone":"Asia/Calcutta"}
```

By returning to the Reports Sections of a target page through an admin account, we were able to confirm that an attacker with the guest role was indeed able to change the Custom Branding and other details like a Report Author of a target page.


![image](https://user-images.githubusercontent.com/88488902/197373702-64aabc9a-b347-416a-92c5-bbe96ec605db.png)


## 6 - Changing rules of inbox assistant from an unauthorized role

This issue was again identified in the *guest role*, which was the lowest-level role available in the organization. This role was *granted some basic read permissions* on limited features.

A feature implemented by agora for the automation of inbox messages was *inbox assistant*. Authorized users are able to create custom rules *by which the replies* to the *received messages* will be given. This feature was totally *unaccessible to the guest role*. 

If the administrator goes to 'organisational settings,' then to 'social profile,' and then to 'inbox assistant,' he can write the rules there or align the rules one after the other.


![image](https://user-images.githubusercontent.com/88488902/197373210-0c63d54c-953a-4b8f-aee3-c12984d1b305.png)

When the administrator changes the chronology of the rules by clicking on the *arrows*, the request looks like this:

```http
PUT /api/accounts/twitter_137253/rules HTTP/1.1
Host: inbox.agorapulse.com
Connection: close
Content-Length: 17
Authorization: Bearer REDACTED
sec-ch-ua-mobile: ?0
Agorapulse-Agent: manager-2021.08.03.0929
Content-Type: application/json
Origin: https://app.agorapulse.com
Accept-Language: en-US,en;q=0.9

{"from":2,"to":1}
```

We observed that the following request had no authorization checks in place and that it was possible to send it from a guest role in order to change the inbox rule chronology.

We received _200 OK_ after sending this request with the credentials of the *guest*, and the rule was moved to *different assistant*. We just need to get the *assistant name* which was leaked to the *guest via another GET request*. Using the name in the mentioned request, we were able to move the rules from this inbox assistant to another inbox assistant.


![image](https://user-images.githubusercontent.com/88488902/197374039-d83f19aa-71e8-4771-b8e1-5b1c93826c4d.png)


We also found that when we sent the following HTTP PUT request, the agorapulse application changed the chronological order of the assistant rules while leaking all of the inbox rules in the response. As a result, the guest role was able to leak information about the rules in the inbox assistant and even change their chronology.

## Fixing the issues

Following the implementation of their fixes, the agorapulse team requested a re-check on the vulnerabilities, and our team attempted to find any possible bypasses for the existing fixes. [Several techniques](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/403-and-401-bypasses
) were used to ensure that all fixes implemented on privilege escalation issues were not easily bypassed.




## About us

Snapsec is a Cyber security service company for rapidly growing SaaS businesses, we help you with an enhanced level of security to defend your critical networks and data at affordable charges for our services.

Please feel free to contact us at [support@snapsec.com](support@snapsec.com) if you’re seeking a company that appreciates your security and guarantees that you are completely protected from online security risks.
