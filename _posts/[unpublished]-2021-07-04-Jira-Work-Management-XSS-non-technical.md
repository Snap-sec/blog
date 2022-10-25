
We found various XSS(cross site scripting) issues in jira products, But in this blogpost we will be discussing a *stored xss* in jira work managemnet. This stored XSS allowed us to perform an full *Orginisation takeover* from lower roles within the orginisation.  You will be reading about the prominent bug and how it lead us to overtake the **Jira organization**.

Jira is a widely used software to manage and collaborate on various tasks. Jira will help you to manage all kinds of use cases of your product. It can help you to track the issues, bugs for your products. Jira eventually evolved in a work management tool for organizations. For tracking issues in _jira work managemnet_, we found a simple yet useful feature which were called as **Priority levels**. Priority conveyed *severity levels* of the issues/bugs for the organization. 

![image](https://user-images.githubusercontent.com/88488902/197689393-11e813bc-c8d5-4f14-9b3a-f9b0b93df768.png)


We found a user who had a permission on a particular *project* in work management can *create customised priority levels*. Which in other words gave us the *control to input and store data fields* as *priority levels*.  It was there, we stored our inputs, after digging and anayzing the *stored inputs* we found an optimal location in the *url field* to store our **XSS payload**. The xss payload was being stored in the url field, of the customized priority. The payload in url field was quite simple  `https://www.google.com?name=<script>alrert('snapsec')</alert)`. After we got the *pop up* we escalated it to the **organization takeover**. Organization takeover means *inviting attacker* in all other *jira products* of the **organization as an admin**. 

## What is stored XSS?

Stored XSS is that type of XSS vulnerability which will allow the attacker to store *malicious code(javascrip code)* on the server and then run it cleint side within the context of the vulnerable website. These instances are common when an *application* let's its users to store user input. The examples of such instances can be *message boards, name fields* and particular;y in this case it was the **priority levels**.


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
