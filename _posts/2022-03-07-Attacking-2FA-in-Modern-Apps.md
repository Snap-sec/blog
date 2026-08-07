---
layout: post
title:  "Attacking 2FA in Modern Web Apps"
author: danish
categories: [ 2FA,article ]
image: assets/images/9/1.png
---





You might be familiar with the annoying OTPS or other authentication tokens delivered right after you log into your favorite site. This article will help you to understand the purpose of __2FA and its exploitation__. I have also drafted some of the 2FA bypasses you can use these techniques to exploit the authentication of an application.

## What is two factor authentication or 2FA?

![1](/assets/images/9/2.png)


Two-factor authentication (2FA), sometimes referred to as two-step verification or dual-factor authentication , is a security process in which users provide two different authentication factors to verify themselves. 2FA is implemented to better protect both a user’s credentials and the resources the user can access.

## Why is it implemented

Two-factor authentication provides a higher level of security than authentication methods that depend on single-factor authentication (SFA), in which the user provides only one factor – typically, a password or passcode. Two-factor authentication methods rely on a user providing a password as the first factor and a second, different factor – usually either a security token or a biometric factor, such as a fingerprint or facial scan. Two-factor authentication adds an additional layer of security to the authentication process by making it harder for attackers to gain access to a person’s devices or online accounts because, even if the victim’s password is hacked, a password alone is not enough to pass the authentication check.

Two-factor authentication has long been used to control access to sensitive systems and data. Online service providers are increasingly using 2FA to protect their users’ credentials from being used by hackers who stole a password database or used phishing campaigns to obtain user passwords.

## Exploiting weak or improper 2FA in web applications

![1](/assets/images/9/3.png)

Many modern web applications implement an external layer of security i.e 2FA which is a brainer to most of us it was devised to protect but by exploiting this issue hackers can sometimes compromise the accounts of users without much toil. In this section, we will take a look at how this _extra layer of security can be exploited and what its exploitation will land an attacker on_.

Bad implementation of 2FA by an organization or company can let an attacker compromise their accounts on the mass level. Like On July 15th, the popular social media site Twitter was hacked causing a disruption in service for users as internal security teams scrambled to mitigate damage. Using social engineering and SIM swapping, hackers were able to successfully access Twitter’s admin panel made only available to internal support teams. The results were over 130 hacked user accounts and $120,000 worth of funds stolen from victims of a vicious phishing attack.  Its reported that the group that performed the hack were able to bypass numerous security factors they had set up on the account, including two-factor authentication. This was one of the drastic effects caused by the exploitation of the 2FA.

Similarly hacking a company's Slack channel hosting system admin credentials, hackers were able to gain access to employee accounts and even bypass two-factor authentication (2FA) – a security policy often cited by security experts as a ‘necessary’ tool to safeguard company data. The primary flaw in 2FA is that it’s only as strong as the trust its users' place in it. Once a user receives a phishing message requesting them to log in to their account, the manipulation of social engineering begins. Next, the user may enter their username, password, and 2FA information into a site completely unaware it is a phishing site designed to convince them they are logging in to their real account. After all 2FA is but a game of numbers conceived by an algorithm. Since the user seemingly trusted the phishing site, they easily gave away their credentials and rendered 2FA useless.

In addition, 2FA data can also be recorded in session cookies. Once a victim adds their 2FA code to a website, a hacker has the ability to sniff session cookies from a developer tool in a web browser. Using the session cookie, hackers have no need for a victim’s username and password –– they simply need to paste the session cookie into a browser to log in to the victim’s account.

Furthermore, once the 2FA is bypassed on an account and Attacker can delete accounts, update emails and do much more critical actions and totally compromise victims' accounts. Many Corporative giants, various banks use the two-factor authentication technique to ensure security to their users. Although these companies don’t make this kind of operation by themselves, they hire third-party companies to do so, integrating the API products for onwards delivery. Because of this implementation technique, they are also vulnerable to serious breaches that can be exploited. The third-party companies stay between the client and the website being in a privileged place to attack any unsuspecting victim.

# 2FA/OTP Bypasses

![1](/assets/images/9/4.png)


This extra layer of security implementation is gaining fame in modern-day web applications and is implemented on a huge scale. But as discussed above _improper implementation_ poses risk to both organizations as well as users residing on their 2FA. As a _pen-tester, bug hunter_ whenever you come across these 2FA's mechanisms implemented in an app make sure you test and try every bypass to identify _vulnerability_. Because at the end of the day you are securing the internet not just breaching it. Below are a few of the techniques I use to _bypass 2FA_ in the application.

- **Forced Browsing**: In this technique, the attacker can try accessing different endpoints directly with the available token generated from passing the 1st authentication mechanism. The fact that 2FA has always to be prompted after the user passes the 1st authenticate mechanism there will always be a session token generated by the 1st auth mechanism. So the trick is to check if the application allows users to visit several endpoints based on the Auth token generated by the 1st Authenticate mechanism, If this doesn’t work, try to change the Referrer header as if you came from the 2FA page.



- **Reusing token**: Try Reusing the Auth code sent to your phone number twice or thrice, If you can do so an attacker could use older OTP to bypass 2FA in the target account anytime in the future.


- **Leaked Token**: Sometime an application may lead the OPT in the response of a HTTP request responsible to generate an OTP on server side, the token leaked on a response from the web application can be reused or may be used to bypass 2FA. This issue was found and reported on many bug bounty targets on Hackerone and Bugcrowd.



- **Password reset Functionality**: In almost all web applications the password reset function automatically logs the user into the application after the reset procedure is completed. Check if a mail is sent with a link to reset the password and if you can reuse that link to reset the password as many times as you want (even if the victim changes his email address).

- **Lack of Rate limit**: Developers often use rate limits to control the number of requests per user. The rate limit is used to control the rate of traffic sent or received on the network. But these headers can be used to bypass several rate limit protections by forging the origin or requests in many cases, If There is no limit in the number of codes that you can try on a single account, then you can just brute force it. Be careful with a possible “silent” rate limit, always try several codes and then the real one to confirm the vulnerability.


    The possibility that any of these bypasses will work completely depends on the internal infrastructure of the target network, To be sure with our customers we do run a little brute-force  with these headers to to confirm if the rate-limit protection is working completely fine on the 2FA and other sensitive endpoints. To test this on your side All you have to do is to Use the mentioned list of Headers just under the Host Header in the Request responsible to send the 2FA code to the server:


```
1.  X-Originating-IP: 127.0.0.1
2.  X-Forwarded-For: 127.0.0.1
3.  X-Remote-IP: 127.0.0.1
4.  X-Remote-Addr: 127.0.0.1
5.  X-Forwarded-Host : 127.0.0.1
6.  X-Client-IP : 127.0.0.1
7.  X-Host : 127.0.0.1
8.  Forwarded: 127.0.0.1
9.  X-Forwarded-By: 127.0.0.1
10.  X-Forwarded-For-IP: 127.0.0.1
11.  X-True-IP: 127.0.0.1
```


- **Re-send code reset the limit**: In this case, there is a flow rate limit (you have to brute force it very slowly: 1 thread and some sleep before 2 tries) but no rate limit. So with enough time, you can be able to find the valid code.


- **CSRF/Clickjacking:** Check if there is a CSRF on enabling and Disabling 2FA or a Clickjacking vulnerability to disable the 2FA. This definitely does require some user interaction to exploit the vulnerability, But it's still impactful enough to make the developer teams fix it.
- 

- __Response Manipulation__: Every request generated from your browser will have a response that is received by the code at the frontend and later the data in the response is used to make several decisions by the code sitting at the front-end, it should be noted that only non-sensitive decisions like which functionalities/links/UI features should be visible to the user should be made at the front end, This is also called a Client-side validation. But developers often forget that client-side validation can be easily bypassed by changing the js-code in the browser or the data in HTTP response upon which the decision is taken,  Sometimes in terms of validating 2FA client-side developers often assume that if the web-server responds with  200OK  to the request includes 2FA code, the logic at the front-end assumes that the code is correct hence logs in the users to their accounts, But this flawed logic can be used to bypass 2FA completely by intercepting the Incorrect Response code and then changing to the 200OK and hence bypass the 2FA authentication on any target account.

Example:

Changing Response Body:

```json
{"success":"false"} -> {"success":"true"}
```

Changing Response Code:

```
change Stautus code [403 -> 200] or [401 -> 200]
```


- __Cross Token Usage__: Try using the 2FA codes send to Account1 on Account2, This simple technique can sometimes lead to 2FA Bypass. The science behind this is pretty simple, If the web application is generating Random tokens and sending them to users and at the same time saving those tokens to their database, When the user submits his 2FA code to the server the code gets matched to the list of codes saved in the database. You see, the codes are not session conscious in this case so as long as a user is able to get any valid code, Which is any code stored in the database in that particular timeframe he will be able to bypass 2FA on any target account.



- __Using Different Authentication Methods__: when implementing different ways to authenticate a user, The 2FA needs to be enforced on each different mechanism supported by an Application. Sometimes web developers forgot to enforce 2FA on login via google, Facebook, apple Etc, Which may allow an attacker to bypass 2FA.



## Conclusion
- Two-factor authentication provides an extra  level layer of security on modern web applications.
- improper implementation of 2FA can cause damage to compromise the users accounts.
- I have already mentioned above some cool bypasses you can use those bypasses to check the authentication of an application.



## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology that ensures in-depth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team that values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
