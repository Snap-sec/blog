# Escalating broken access control vulnerability to affect integrity and availability of shared resource.

Broken access control vulnerability let's an attcker to bypass access control checks(link our previous article) by modifying url, internal application checks, or api requests. Once this flaw is identified it can be leveraged to perform *privilege escaltion, viewing unauthorized content,  change or delete content or resource and can also lead to take over administration at worst*.

The keyfactor to perform escalation of an attack depends on the simple fact, "How well are you able to understand the application" and its characteristics. On occasions we get our hands on information which we are not allowed to read with present role which definitely  is a possible *information leakage bug* but what about escalating that *information leakage* to something more severe by using the *leaked information*. All this is possibel if *one can connect* to the jargon used by the *application* servers in their responses or requests.

In the same context we will explain how we were able to escalate the broken access control to affect the *integrity and availlability of a shared resource* which in this case was a *form in a workspcae* shared with us. We were only able to *escalate it and affect* the other features because we had interacted with the app like non tech simple user.  We had noted various behaviours  and features of the app resolutely. This is where it paid off!

{{something pic}}

As usual when we came across the role based application our testing is incomplete unless we try every possible  way to *find broken access controls and privilege escalation bugs*. These issues are very familiar to our team and hardly any app * escapes us without these issues being reported in bulk*. 

##  Where did we found BAC

In this case *admin shares his workspace with another user*  as a viewer who can only view the content in the *shared workspace* . From now on we will call the *shared user an attacker*. Attacker in his account possess his own workspaces as well completely unshared. The fact worth noting here was *attacker* was able to move *forms or surveys* from his personal *workspaces* into the admins workspaces but *vice versa* was impossible. Yet, *impossibility is where* possibility is hidden.

{{Diagram showing diff workspace interaction}}

 Observing the http request responsible to move a *form or survey*  across the *workspaces* keenly we found  that *PATCH* request on api endpoint was using the form id of the one that is being moved like this:

```
PATCH /forms/<Form-ID-> HTTP/1.1
```

It also *associated a new path* with it via *the json body in the same request*.The *json body* is self explanatory but still for convenience *it replaced the path of the *form id* used in endpoint with a *new path* that contains *the workspace id that will nest the form from now on*. JSON body is as below:

```
[{"op":"replace","path":"/workspace","value":{"href":"https://api.company.com/workspaces/<new workspace id>"}}]
```

In totality the  vulnerable *request* is as below:

```http
PATCH /forms/<Form-ID-in-Shared-Workspace> HTTP/1.1 
Host: api.typeform.com 
Connection: close 
Content-Length: 100 Authorization: Bearer <Token> Origin: https://admin.typeform.com User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 Content-Type: application/json Accept: */* Referer: https://admin.typeform.com/workspaces/k5jwbB Accept-Language: en-US,en;q=0.9 

[{"op":"replace","path":"/workspace","value":{"href":"https://api.typeform.com/workspaces/<Attackers-Private-Space>"}}]
```

We were electrified to *move* admins forms into our own workspace, this was attained by just using the *form id* of admin in the api path of above request and using *aattckers* own workspace id in the *json body* below. Yes! we were able to *move* admins forms or surveys into our own account via broken access control on the above *api path*.


## Escalation to affect the integrity and availability

Though by nature of the app we knew the important assets to it were **the froms and the surveys** these things were the fundamentals and groundwork of the whole application. This made us to *brain storm more* about it. We concluded the following :

### Integrity

Since we were able to move *forms* into our personal  workspace alongwith the submitted *responses* , *votes* or other submissions.  Suppose the *form was a survey to select a manager* and *people* voted on different *names*  and the attacker was able to move this form into his *personal space* he can *now delete* the responses and move it back to the *admins workspace*.

There were no notifications or any mechanism that could let admin know *the form was moved in or from* his workspace. Thus we could delete the *responses* on a *survey* without letting admin know that could affect the results.


{[screenshot} or something necessary

### Availability

Once attacker moved the *form* in our his *personal space* he can now delete the *form or survey* as well without the proper privileges to do so. Hence impacting the *availability of the form* as well.

## Summary

- Broken access on the api endpoint ``` PATCH /forms/<Form-ID-> HTTP/1.1```   let's an attacker to move a form or survey into his own workspace.

- He can edit the *responses* of the form and then can transfer back it into admins workspce and impacting the integrity of the *form*.

- Attacker can also *delete* teh form after movingit into his own workspcae,  impacting its *availability*.

How well one may be able to escalate an issue depends on the fact that how well he/she can use the app as a normal user.


### Fix

The fix should be simple  
if owner of the token and the owner of the form ID in the PATCH request is the same then move the form or else reject the request

```
if (GetUserName(request.token())==GetUserName(FormID))
{
Move(Form,WorkspaceID);
}
else
{
Access_denied();
}
```

>Do it uaself or whatevr u like








### One more thing is i guess we need to add bounty details as well for the first few writeups and that section may include:

Reported on: 
Resolve:
or whatever

* 
