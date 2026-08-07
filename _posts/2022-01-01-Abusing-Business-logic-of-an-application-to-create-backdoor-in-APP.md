---
layout: post
title:  "Abusing Business Logic of an Application to create backdoor in a form APP"
author: imran
categories: [ broken-access-control,article]
image: assets/images/BD/0.png
---




Working with a target [having](https://google.com) various *access roles* and functionalities always gives us goosebumps. This time it was a design flaw in the *application logic* that we reformed to create a *backdoor* which revealed us all of the *response details* submitted on the *form or survey* created by the admin.

![1](/assets/images/BD/1.png)



The target is a well known *platform* that was specialized in *creating forms and surveys* which could then be used *anywhere*. Since *creating the form or survey* involved different roles with specific *permissions*. Like, *an admin* can invite *a form designer* or a *copywriter* for the convenience of creating *beautiful and reliable forms* for his *audience*. As soon as the above roles *provided the service* they were removed from that *particular form or survey* and it was no longer collaborated with them. In general they *had no access* to the *form or survey functionalities*.





# Abusing the logic and creating a backdoor

>Everything is created twice, first in the *mind* and then we start the manifestation in *reality*.

Same was case with this, we brainstormed about the fact that *the roles like form designer and copywriter* have *write access on the form or survey*  of the admin but once they are *removed as collaborators* they can no longer have access on any part of the *form or survey*.

![1](/assets/images/BD/2.gif)



The forms or the surveys were dynamic  by nature as *they can be used to get the responses* and only *admin and people invited to the workspace had the access to view the responses* submitted on the form. The *responses can vary* from *personal information to any other sensitive information*  with respect to the objective of form. Analysing  the *submitted responses*  we came to know that admin can generate an `form Report` which can be shared with any un-authenticated users and allow them to view all of the responses on the form.  Browsing the specific url *anyone can view the responses of the form or survey* and sadly it *only editors and admins of the form can generate the response urls*.

![1](/assets/images/BD/3.png)



As we knew *that copywriters and designers* and *everyone else* who previously has any access to the form  have atleast **read-access** on the forms or surveys though for time being but it ticked our minds; whether or not can we generate  *form report url* without any responses being *filled on the form* yet. 

VOILA!  we were able to generate the *report url for a form* as a *designer or copywriter* which otherwise should be not allowed *for their  respective roles*. 

![1](/assets/images/BD/4.png)



Once a *designer or the copywriter* were removed from the *form or survey* , we checked the *report url* and it was *alive*.  After the form was used and *responses were filled* on the form, we were able to *see all of the information* on this form via the *previously generated url* which a *designer or copywriter* can use as  a *backdoor* to steal responses submitted on the form or surveys. This is how a backdoor via *logical misconfiguration/poor logical implementation*  can lead to steal the form responses  in a *completely* passive way.

![1](/assets/images/BD/5.png)




## Attack Scanerio

As we are already aware of the fact that admin can invite 5 different roles to his orginisation/worksapce.

1- Lets suppose Admin wanted to collect information from the employees in His company
2- Admin will invite `Editor` + `Designer` to the Workspace So they can create a nice and beautiful form for Admin.
3- `Editor` + `Designer` finishes `Editing` + `Designing` the form. At the same times they generated a `report URL` and kept it for later use.
4- Admin removes `Editor` + `Designer` from the workspace as he doesn't want `Editor` + `Designer` to see the form responses.
5- The admin published the form and starts getting the responses on it.
6- But `Editor` + `Designer` uses the `Report URL` to get access to responses as new responses get automatically updated on the Report URL
7- So `Editor` + `Designer` Gets access to the form responses even though they are completely removed from the worskspace



## Understanding the Design Flaws

On looking at the attack scanerio, It can be clearly noticed that there were two different design flaws which allowed any inivted users to __Backdoor Forms__ and steal form responses

- The first desing flaw was that all the people who were invited to the orginisation were allowed to generate/see report URI's of the forms, Please note that the people accessing form responses via report URI wans't the issue at all rather the real problem was `Who has access to generate the report URIS?`.
> The Editors and Designers should not be allowed to generate the URL and use it in future to see all responses without letting admin having any knowledge about this. 


- The 2nd problem was that the Report URI was able to display any newly added responses on the form via report accessed by any user, What i meant by that is that if the UserX generated a report URI at time 1 Dec , and new form responses was addede to form on 3 December the report URI would automatically allows everyone to access the form response added on 3 december. 

> Combing the above two logical flaws it allowed attacker to __generate a report URI__ and wait till admins starts collecting responses and then __Access newly added form responses via the Report-URI__ , which infact allowed users to turn Report URI into a completely backdoor on a form.


## Possible Fixes to the Problem

We proposed the following Solutions to the customer which would have completely metigated the issue,

- You shouldn't allows Editor + Designer and other non-admin people to generate the Report URL
- Try not to send the further updates (responses) to the Report URL generated by non admin user.



## Conclusion

- Have a firm understanding of the target app.
- Know various roles against their permitted access.
- Whatever any role is capable of accomplishing more than permitted access should be noted down.
- Abuse that logic to increase the impact of the flaw.

If you've made so far, it should be clear to you that there was no *technical part involved* in this and yet it was maked **P2 severity issue**.


## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
