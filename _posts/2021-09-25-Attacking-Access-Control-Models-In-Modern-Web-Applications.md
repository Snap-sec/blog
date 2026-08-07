---
layout: post
title:  "Attacking Access Control Models in Modern Web Apps"
author: imran
categories: [ article,broken-access-control ]
image: assets/images/ABACM/8.png
---






So far you may have come across various web applications where you were able to invite members with limited access to the information within the organization. Developers are able to make such applications or services by implementing access control models within their applications.  
  

## What are Access Control Models:  
  

Access control models are used to control the access of users to resources and how they interact with them. In the context of Web Applications, access control models are used to control the access of users to resources and how they interact with them.  For example, if a user is an administrator, he or she may be allowed to access all the resources in the application. However, if the user is a member, he/she may only be allowed to access very specific resources in the application.  
  

Example:  
  



![1](/assets/images/ABACM/1.png)

  
In the following example of the Role-Based Access Control Model you can see it has 3 different roles defined with different sets of permission assigned to each role, For example, the __admin__ role has access to `All(users, Documents, logs, and Reports)` within the Organisation but __managers__ only have access to `users, documents and reports` while as __user__ role is further restricted and are only allowed to access `users, documents` within the organization.



Let’s dig a bit deeper to know the various types of access control models that are implemented in the day to day applications we use :

1.  _Role-Based access controls(RBAC)_: This model grants access privileges to users based on the work that they do within an organization. In this access control model, an administrator is able to assign a user to single or multiple roles according to their work assignments. Each role enables access to specific resources.
2.  _Discretionary Access Control (DAC)_: In this type of access control permissions are granted or restricted based on the _access policy_ as determined by the owner of the organisation or asset.
3.  _Mandatory Access Control (MAC)_: This model enables grouping or marking resources according to a sensitivity model. This model is mainly found in the military or government environments where it can be understood in groups like confidential, secret, top-secret etc.

  
## Broken Access Control Model:  
  
As we are well aware of the fact that modern web applications have grown much complex and gigantic in terms of handling and processing information. This undoubtedly increases the complexity in the secure and flawless implementation of access control models within these applications.  

The access control model which allows the users with limited permissions in the organisation to access the restricted information within that organisation is considered to be broken and flawed. That's where the term  'Broken Access Control' is born. And whatever is broken it paves a way for a hacker to exploit it.
  
  
  
  
## What can go wrong:  

One may ask a question “what kind of problems can arise if the access control models aren’t implemented properly” ? and “what can be the impact if those issues are exploited in real-world scenarios”? Well, The answer is quite simple, every time a permission model fails to implement permissions correctly a possibility for a privilege escalation arises within the system and the severity of the attack will depend on which part of the system/application is affected or exposed to unauthorized users/roles.

Now, Coming back to our questions what can go wrong while implementing Access control models. During my experience there are 3 different possibilities:

- __Permissions aren't implemented Properly__ In this case a few/several endpoints are exposed to un-authorized roles/users without having required permission properly implemented on them, For example in if `/api/users` needed `read:users` permission, the attacker will be able to browse `/api/users` without `read:users` permission.

- __Permission X override Permission Y__: In this case if the user is provided with `read:users` permission to access `/api/user` API Endpoint, he is automatically given access to `/api/reports` endpoints as well. So, we can say `read:users` permission overrides `read:reports` permission.


- __Set of Permission override Permission X__: In this case, if the user is provided with `read:users` and `read:reports` permission to access `/api/user` and `/api/reports` API Endpoints, he is automatically given access to `/api/files` endpoints as well, Please note that a random combination of permission leads to permission issue here, So in this case, we can say a random combination of permission `read:W` AND `read:X` AND `read:Y` allows access to `read:Z` as well.


Now, the real challenge was to build around a testing methodology that covers all these scenarios and provides us with the full coverage of the target model, To do that we designed different techniques for each kind of scenario that can arise within the system. Which finally led us to the following mentioned techniques.


## Testing Broken Access control Models:
  
  

Coming to our favourite part in which we will expose different techniques and strategies to test for broken access control models within modern-day applications. With our experience of several years of testing and analyzing BACM(broken access control models), we have figured out several effective techniques to test Access Control models.


Our  main three effective techniques/approaches are as under:
  

- Forwards Approach  
- Backword Approach  
- Mixed Approach  
  
To understand these approaches effectively let's assume we are testing a web application(with an access control model implemented) that allows us(as admin) to invite users to our organisation with specific permissions. The permissions are depicted in the picture below along with their accessible API endpoints. It should be clear that a user with permission only will be able to access the corresponding API endpoint adjacent to it. If by any means he was able to access other API endpoints the access control model will be considered broken.
  




![1](/assets/images/ABACM/2.png)

  
  
  Let's begin with our arsenal:

### Forward Approach


In the forward approach strategy, a user must be invited with only one permission (suppose it is the first green-coloured permission) and Then the invited user with only one permission will try to access all other restricted API endpoints in sequential order. After finishing the 1st test case the user must be invited with the 2nd permission and then will try to access all other restricted API endpoints in sequential order and so on.

Some of the test cases generated by the forward approach as listed below:


__Test case 0__:  
  

In the following test case, the user is granted __`read:users`__ permission in the model and then he tries to access the rest of the restricted API endpoints within the permission model. 
  




![1](/assets/images/ABACM/3.png)

  
  
  

__Test case 1__:  
  


In the following test case, the user is granted __`write:users`__ permission in the model and then he tries to access the rest of the restricted API endpoints within the permission model. 
  





![1](/assets/images/ABACM/4.png)

  
  

__Test case 2__:  
  


In the following test case, the user is granted __`read:documents`__ permission in the model and then he tries to access the rest of the restricted API endpoints within the permission model. 
  




![1](/assets/images/ABACM/5.png)

  
  

### Backward Approach:

In the backward approach, the user should be granted all the permissions in the model except one permission and we will try to access the respective API endpoint of the devoid permission.

**Test case 0**:

In the following test case, the user is granted all the permission except __read:users__ permission in the model and then he tries to access the user information from the following Endpoint`GET /api/users`as shown in the picture below.




![1](/assets/images/ABACM/6.png)

  

**Test case 1**:

In the following test case, the user is granted all the permission except __write:users__ permission in the model and then he tries to modify the user information from the following Endpoint`POST /api/users` on which he has no permission.


![1](/assets/images/ABACM/7.png)




### Mixed Approach

In the mixed approach a user must be invited with a set of mixed permissions from the permission list and then he/she will try to access the corresponding API endpoints of restricted roles.


**Test case 0**:

In the following test case, the user is granted _`read:users`_,_`write:docs`_,_`write:logs`_ permission then all the other restricted endpoints must be tested against these mixed permissions to check for broken access controls.


![1](/assets/images/ABACM/8.png)




**Test case 1**:

In the following test case the user is granted _`write:docs`_,_`read:logs`_,_`write:logs`_ permission then all the restricted endpoints must be tested against these permission as shown in the picture below.



![1](/assets/images/ABACM/9.png)







## Bonus Tip

During our experience in testing 100's access control models, we came across several BAC issues that lead to IDOR when tested against cross organizational attacks. In that case, the API endpoint must have a pointer which can be a name, id or Uid when referenced to other organisations or users from other organisations leads to an IDOR.Hence All IDOR's are Access control issues But all Access control issues are not IDOR's.

I hope this helps. If you have any questions, suggestions or requests, Pleas contact us on [Twitter](https://twitter.com/snap_sec)

See you next time.




## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
