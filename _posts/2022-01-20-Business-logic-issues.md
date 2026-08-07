---
layout: post
title:  "Attacking Business Logic issues in Modern Web Apps"
author: ab
categories: [ writeup,broken-access-control ]
image: assets/images/6/1.png
---



The complexity of the modern applications has increased exponentially in the past decade. Unfortunately, this has also increased the attacker surface and hence increased the total number of vulnerabilities that have been found on such applications. One such type being business logic vulnerabilities.


## So what is a business logic vulnerability?

Business logic vulnerabilities are flaws in the design and implimentation of an application that allow an attacker to elicit unintended behaviour.This enables the attackers to manipulate legitimate functionality to acheive a malicious goal.These flaws are generally the result of failing to anticipate unusual application states that may occur and consequently failing to handle them safely. 

A business logic flaw is an application vulnerability, which arises from circumstantial security weakness. As a one-of-a-kind problem, it does not have a universal solution and cannot be detected by automated web application scanning either. So that makes them quite challenging for the companies to detect.

In theory, business logic vulnerability might seem a very vague, abstract idea; but it poses a serious threat to security. Logic based vulnerabilities can be extremely diverse and are often very unique and require a certain amount of human knowledge such as understanding of the particular application. 

Logic flaws are particularly common in overly complicated systems that even the development team themselves do not fully understand. To avoid logic flaws, developers need to understand the application as a whole. This includes being aware of how different functions can be combined in unexpected ways. Developers working on large code bases may not have an intimate understanding of how all areas of the application work which often leads to security vulnerabilities classified as Business logic issues.


## The impact of business logic vulnerabilities:

Business logic vulnerabilities can start as a very trivial event. They are often considered to be a broad category of attacks. One a vulnerability is detected however, it is usually only a matter of time before more severe threats begin to weigh heavily on a website. Unintended behaviours can lead to the chance that an exploit could be expanded and this places a website at risk as well as all of the users on that platform. 

A single exploit in the form of business logic vulnerability can lead to the chance that a flaw can be escalated. An aspect of a website or app that is malfunctioning could lead to a bypass in authentication, the chance to gain access to user data or the chance to change the function of website elements completely. On a financial website or with any application related to finance, there are instances where these types of exploits can lead to stolen funds, fraudulent accounts and more. 

Even if a logic flaw for a business does not directly benefit the hacker, it could lead to another malicious party paying for the knowledge of the exploit and doing further damage to a business. 



## An example of business logic vulnerability:

![1](/assets/images/6/3.png)

Here is a simple example.
An e-commerce merchant, YYY.com sells electronic merchandise to consumers worldwide. The typical checkout process during fulfillment includes the following steps in sequence:

1. User picks one or more items and adds to basket 
2. User then heads to order page to initiate purchase 
3. User pushes purchase or checkout button 
4. Merchant YYY.com sends order and customer information to it’s partner payments processor (for authorization and capture) 
5. Payments processor returns transaction-id back to Merchant YYY.com 
6. Merchant YYY.com displays confirmation details on fulfillment page to consumer 

An attacker carefully tracks the request/response through each of these stages prepares to induce a currency attack on this merchant.
At step (3), the attacker manipulates a currency related parameter in the POST request within the HTTP header and changes the currency type from `EU Pounds` to `US Dollars`. As a result the attacker was able to exploit this logic flaw by paying less for his/her order.


## So, what we can do about it?

![1](/assets/images/6/2.png)


__Proper Understanding of Target Application during Development Phase:__

Business logic flaws is truly a business problem and require a different approach to avoid or mitigate. First, business managers need to understand and appreciate the business logic problem and then thoroughly document business requirements in alignment with the threat modelling. Second, the planning and design phase of application development is very critical. Failing to identify and document assumptions may lead to poor quality application design. Finally, application architects must identify user personas and application interaction scenarios. Access to functional modules should always be based on the success or failure of a particular condition or status passed from one stage to the next.

It is important that business analyst’s, application architects and developers thoroughly understand the business intricacies. Then, develop test cases considering all those assumptions made during the design phase, thoroughly testing the business logic.


__Business Logic Specific Security Testing:__

Traditional Penetration Testing of often focused on finding less logical and more technical bugs in web applications, It defenetly help security professionals evaluate the effectiveness of information security measures within their organizations but these methodologies often overlook on testing logical part of the application, Because of the fact majority of testing methodologies are more shifted towards the technical perespective of bugs and less shifted towards finding and exploiting logical part of the applications.

that's why We at Snapsec have a specialized testing methodology which ensures indepth testing of your business logic and other latest security vulnerabilities.

If you are looking for a team which values your security and ensures that you are fully secure against business logic issue and other online security threats, feel free to get in touch with us [support@snapsec.co](mailto:support@snapsec.co)



## Conclusion:

As noted above in this article, the unique nature of these vulnerabilities makes them difficult to identify. It is often seen that the organisations choose to ignore such vulnerabilities blaming human errors on the part of the developers. Good design practices must be developed and implemented to ensure such vulnerabilities are avoided. 

> There is no single silver bullet to avoid these vulnerabilities. Instead, it requires a comprehensive and cohesive approach by progressively maturing the development methodologies.
