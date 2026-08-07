---
layout: post
title:  "Attacking Authentication in Modern Web Applications"
author: mubashir
categories: [ attacking-modern-webapps,authentication ]
image: assets/images/13/1.png
---




Authentication issues are easy to understand however they can sometimes prove the most critical ones because of the fact that authentication is the core of security in any application. In the forthcoming sections, we will discuss briefly _authentication_ and how various authentication mechanisms can be exploited.

## What is authentication?

![1](/assets/images/13/2.png)


Familiar with those login pages where you put your _emails and passwords_ and after successful entry you get logged into your account, that mechanism in simple terms is called _authentication_. Authentication is an answer to the question, “who are you?”. Modern web applications use robust authentication mechanisms for preventing errors and effective security.

Authentication mechanisms rely on various technologies to verify the details the user provides as his answer to the question “who are you?”.

Some of the most common ways of authentication in REST APIS are as below:

-   Cookie-Based authentication
-   Token-Based authentication
-   Third-party access(OAuth, API-token)
-   OpenId

We won’t be explaining the authentication mechanisms here but we will just take a look at various _vulnerabilities that arise_ in the authentication mechanisms due to logical flaws or improper validations.

### Vulnerabilities in the authentication mechanisms

![1](/assets/images/13/3.png)



Various vulnerabilities are associated with the authentication mechanisms across different contexts. It is unfeasible here, to explain each vulnerability associated with authentication mechanisms. Howsoever, You will be looking at common vulnerabilities you can test on _login and sign up pages_.

__List of various bugs associated with the authentication mechanisms:__

-   Username enumeration
-   Weak Password Policy
-   No/flawed brute force protection
-   Duplicate registration / Overwrite existing user
-   Using HTTP basic authentication
-   DOS at Name/Password field in Signup Page.
-   Weak two-factor authentication implementation.
-   Insufficient Email Verification.
-   Weak Reset token Expiration mechanism 
-   HttpOnly flag not set on critical Cookies.
-   Login Over HTTP
-   CSRF in Password Change.




## Testing some of the mentioned vulnerabilities


![1](/assets/images/13/4.png)


#### Login Over HTTP

Without HTTPS, any data passed is insecure. This is especially important for sites where sensitive data is passed across the connection, such as eCommerce sites that accept online card payments, or login areas that require users to enter their credentials

An attacker who is able to intercept your - or your users' - network traffic can read and modify any messages that are exchanged with your server. That means that an attacker can see passwords in clear text, modify the appearance of your website, redirect the user to other web pages or steal session information.

Therefore no message you send to the server remains confidential.


#### Duplicate registration / Overwrite existing user

This happens when improper backend validation allows a user to sign up with the same email id, username or password. The security of individual accounts can be compromised by this flawed mechanism and can lead to account takeover.

This can be performed in different scenarios I would like to mention one here. As an attacker register two accounts with the same username and different email. Try logging in and click on _forgot password_ and submit the _username_ after _resetting the password_ check if you have gained access to both the account of the same username by resetting password.

I found this report interesting, give it a read:[https://hackerone.com/reports/187714](https://hackerone.com/reports/187714)

#### Insufficient Email Verification

As the name suggests email verification mechanism is flawed or can be easily bypassed. When you register for a new account, there is no verification link sent to the email for confirmation. The account is directly activated and can be used without confirming the email.
This is vulnerable as anyone can use anyone's email without verification. and one with valid email owner cant signup with his own email as someone else already took it before him. This may seem not to be a vulnerability at the beginning but is often used to takeover acc

  

There are various ways to bypass improper email verification and I can’t go into all of them in this article.

Here is an interesting report I found on HackerOne, [https://hackerone.com/reports/1040047](https://hackerone.com/reports/1040047) check this out.

#### HTTP Basic Authentication

In Basic authentication, the user sends his credential encoded by the base64 algorithm. Credentials are sent in Authorization header with Basic prefix as given below, "Basic encodeUsingBase64(username+":"+password). In basic authentication complete credentials (including password) will be sent in each request.

This is considered a vulnerability because of several reasons like, credentials with just base64 encoding are sent in each request. The credentials can be captured and are vulnerable to _Man in the middle attack_ unless the application implements HSTS (HTTPS strict transport security). There is no brute force protection in basic HTTP authentication.

#### Username Enumeration

An attacker observes the changes in the behaviour of an application to check if a particular username is valid or not. Username enumeration mostly occurs at _log in pages_ while an attacker brute forces a list of usernames against a wrong password and then analyses the behaviour in form of _status codes, error messages, request time_ etc an attacker can enumerate various valid usernames.

An attacker can brute force say a list of usernames and check the responses and the error codes and messages. In this case, I will mention a scenario where an attacker while checking the _responses_ saw **404 not found** and error message like **invalid user** in the body but in one request he could see response code is **403 forbidden** and an error message is **an incorrect password**, which implies that attacker was successful in enumerating the username.




#### DOS at Name/Password field in Signup Page

By sending a very long string (100000 characters) it’s possible to cause a denial of service attack on the server. Usually, this problem is caused by a vulnerable string hashing implementation. When a long string is sent, the string hashing process will result in CPU and can lead to memory exhaustion.

One can simply intercept the request in burp and then can fiddle with different form fields in the burp by sending long string passwords(100000 characters) and checking if the response is **500 internal server error**.

{{500internal pic}}




#### Weak Password Policy or No password policy

If no or weak password policy is implemented on the target website, it will allows it users to set weak passwords, A weak password is short, common, a system default, or something that could be rapidly guessed by executing a brute force attack using a subset of all possible passwords, such as words in the dictionary, proper names, words based on the user name or common variations on these themes.

the vulnerability can be easily identified by registering an account on the target website and try setting some weak password like `aaa` or `1234` as passwords, If you errors/warnings are shown by the application its vulnerable to weak password policy issue.


#### No Rate Limit Protection 

This is necessary to prevent the attackers from sending excessive requests to the server. Rate limiting helps prevent a user from exhausting the system’s resources. Attackers can also use no-rate limit issue to scrap user data from API endpoint or may even lead application to create a DOS attack by performing highly exautive tasks repeatedly on the target server.

Read More about how to [Attack Rate Limit Protection in modern Web apps](https://snapsec.co/blog/Attacking-Rate-limit/) here.

Read More about How [Data Scraping Issue Lead LinkedIn the biggest Databreach so far](https://snapsec.co/blog/Top-5-Cyber-Attacks-Of-2021/).


#### Weak two-factor authentication implementation

Two-factor authentication (2FA), sometimes referred to as two-step verification or dual-factor authentication , is a security process in which users provide two different authentication factors to verify themselves. 2FA is implemented to better protect both a user’s credentials and the resources the user can access.

Bad implementation of 2FA by an organization or company can let an attacker compromise their accounts on the mass level. Like On July 15th, the popular social media site Twitter was hacked causing a disruption in service for users as internal security teams scrambled to mitigate damage. Using social engineering and SIM swapping, hackers were able to successfully access Twitter’s admin panel made only available to internal support teams. The results were over 130 hacked user accounts and $120,000 worth of funds stolen from victims of a vicious phishing attack. Its reported that the group that performed the hack were able to bypass numerous security factors they had set up on the account, including two-factor authentication. This was one of the drastic effects caused by the exploitation of the 2FA

Read More about [Attacking 2FA in Modern Web Apps](https://snapsec.co/blog/Attacking-2FA-in-Modern-Apps/) here.



#### Weak Reset token Expiration mechanism 

It is common for an application to have a mechanism that provides a means for a user to gain access to their account in the event they forget their password. Very often the password recovery mechanism is weak, which has the effect of making it more likely that it would be possible for a person other than the legitimate system user to gain access to that user's account.

One of these mistakes is `Not expiring Password Reset Links after they are being used` which means those password reset links remain valid forever and can be used to compromise user account if leaked somehow.

the other mistake that is often found is `Not expiring password reset after email change`, Which infact is hard to exploit but defenetly poses a valid security threat to the users.

#### HttpOnly flag not set on critical Cookies.

If the HttpOnly flag is set on a the session/critical cookies used in the webapplication, then the cookie's value can be read or set by client-side JavaScript. This mistake increases the possibility of accout takeover via other clients side attacks like XSS. 

After Achiving XSS attacker's script code might attempt to read the contents of a cookie and exfiltrate information obtained. When the cookie flag is set, browsers that support the flag will not reveal the contents of the cookie to a third party via client-side script executed via XSS.



Though I can’t cover up all of the vulnerabilities listed I assure you they are amazing and fun to understand and test.

### Securing your applications by:

##### Preventing username enumeration

An attacker can easily break into the authentication of the application if usernames are revealed to him. Use identical general error messages so that an attacker can’t really distinguish the responses and you can prevent username enumeration.

##### Implement a good brute force protection

One of the effective methods is to implement strict, IP-based user rate limiting. Try to make it manual by adding the _captcha_ etc so that it becomes tedious for an attacker to bypass.

##### Multi-factor authentication

Multi-factor authentication when implemented is much more secure than password-based login alone however it is difficult to implement in every web app. This also adds hassle to make your multi-factor checks sound and robust so that they can’t be easily bypassed.





## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)

