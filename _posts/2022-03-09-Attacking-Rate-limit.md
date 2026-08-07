---
layout: post
title:  "Attacking Rate Limit Protection in Modern Web Apps"
author: danish
categories: [ Attacking-Modern-Web-Apps,article ]
image: assets/images/10/1.png
---






What is rate-limiting? Well, Rate limiting is a process of limiting requests received by the networking device. It is used to control network traffic.
Suppose a web server allows up to 20 requests per minute. If you try to send more than 20 requests, an error will be triggered. A rate-limiting algorithm is used to check if the user session (or IP address) is following the limits set within the server/network configuration. In case the client made too many requests within a given time frame, HTTP servers can respond with status code 429: Too Many Requests and block the user IP/Session for some fixed time frame.

## Why is it implemented?

![1](/assets/images/10/2.png)


This is necessary to prevent the attackers from sending excessive requests to the server. Rate limiting helps prevent a user from exhausting the system’s resources and is used to help control the load that’s put on the system. An API that utillizes rate limiting may throttle clients that attempt to make too many calls or temporarily block them altogether. Users who have been throttled may either have their requests denied or slowed down for a set time. This will allow legitimate requests to still be fulfilled without slowing down the entire application. Without rate limiting, it’s easier for a malicious party to overwhelm the system. This is done when the system is flooded with requests for information, thereby consuming memory, storage, and network capacity. It reduces the excessive load on web servers. it helps to stop certain kinds of malicious bot activity like login to an account using multiple guess passwords and user ids. It also prevents the modern web applications from bruteforce attacks.


### Impact

![1](/assets/images/10/3.png)


No rate limit is a flaw that doesn’t limit the number of attempts one makes on a website server to extract data. It is a vulnerability that can prove to be critical when misused by attackers. The zoom app has become popular in the lockdown, it has become an essential alternative to meetings and offline classes. Attackers were able to successfully exploit the No Rate Limit issue in the zoom application which allowed them to brute force the private zoom meetings and crack the password within minutes. Later, this vulnerability was patched by ZOOM.

This vulnerability type is made possible because endpoints that serve data can be called upon many times per second by users/attackers. If the user/attacker requests so data so many times the system can no longer keep up and starts consuming all of its resources this can even lead to a DOS (Denial Of Service) attack but the consequences might be even greater than that on certain authentication endpoints which might open the API up to forgotten password reset token brute-forcing. This security vulnerability is common in the wild and thus we may often encounter APIs that contain no or weak rate limiting.

Thus the impact can range from something like DOS up to enable authentication attacks, these are all in the higher end of the impact range because they have some serious potential to disrupt the normal workings of an API. Whenever an API is served a request it will have to respond, to generate this response the API requires resources (CPU, RAM, network, and at times even disk space) but how much is required highly depends on the task at hand. The more logic processing happens or data is returned, the more resources are taken up by a single call and this can stack on quickly. If we do not rate limit our API endpoints. This issue is made even worse by the fact that most APIs reside on shared hosts which means they are all fighting for the same resources which could mean the attacker is disabling a secondary unrelated API by consuming all the resources.

### Exploitation
Since we are writing these blogs from an attacker's perspective, here is how to test/attack your Rate limit protection on your webserver or API to ensure everything is working completely fine.




- **Using Null chars**: Try adding some Null bytes like `%00, %0d%0a, %0d, %0a, %09, %0C, %20` to the request header and/or params. For example `/api/auth?code=1234%0a` or if you are bruteforcing a code for an email and you only have 5 tries, use the 5 tries for `example@email.com`, then for `example@email.com%0a`, then for `example@email.com%0a%0a`, and continue. 


- **Forging Request origin using headers**: The Following mentioned headers can be used to bypass several rate limit protections by forging the origin or requests in many cases. The whole purpose of adding these headers to your requests is to make the webserver believe that the request is originated from his localhost hence no rate limit should be applied to it, To test this on your side All you have to do is to Use the mentioned list of Headers just under the Host Header in the Request responsible to send the 2FA code to the server:

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

- **Change other headers:** Try changing the user-agent, the cookies... anything that could be able to identify you. If the webserver is using these headers to identify you as soon as you change the value of any of these headers , You are a new person.


- **Confusing Server with Suceessful Attempts:** While trying rate limit protection of Authentication mechanism like Login, OTP portals each unsuccessful attempt increases your chance of getting blocked by the server, Now If you login into your account before each attempt of brute force other account (or each set of X tries), the rate limit is restarted. If you are attacking a login functionality, you can do this in burp using a Pitchfork attack in setting your credentials every X tries (and marking follow redirects). 


- **Adding extra params/value to URL paths**: if the limitation is set based on the number of requests that can be sent per path per time frame, This can be easily bypassed by adding new params to the URL, For example `/user/1` and `/user/1?p=1` and `/user/1/q=2` and `/user/1?r=3` are 3 different URL's but the request would be sent to a same path `/user/1` So this can be used to confuse the webserver by making server think that requests are sent to different API PATH's.


- **Adding Spaces** A webserver may strip off extra spaces added to email/username at the backend, Which may allow you to brute force the same email by appending an extra space every time you are blocked.

For example, Let say we are brute-forcing an OTP on the following target Email 

```http
POST /auth/code HTTP/1.0
Host: app.com

{"email":"victim@app.com","code":"1234"}
```

Adding Space to Email:


```http
POST /auth/code HTTP/1.0
Host: app.com

{"email":" victim@app.com","code":"1234"}
```
 Adding Another Space to email:
 
 
```http
POST /auth/code HTTP/1.0
Host: app.com

{"email":"  victim@app.com","code":"1234"}
```

The fact that developers often strip Spaces before processing user data, may allow you to brute force the same email by appending an extra space every time you are blocked.


- **Attacking Different Endpoints with same purpose:** If you are attacking a particular endpoint for example `/api/v3/sign-up`,  try finding different endpoints with a similar purpose in the application Example `/Sing-up`, `/SignUp`, `/singup`. Sometimes very specific endpoints are protected against rate limit attacks hence if the dev team forgot to implement rate limit protection on similar endpoints you may be able to exploit the same functionality via a different endpoint.


- **Changing Cookies**: Try changing the Session cookie after being blocked by the server. This can be achieved by figuring out which request is responsible to set session cookies to the user and then using that request to update the session cookie every time you are blocked. If the rate limit mechanism is purely based on sessions-id's/cookies, an attacker can continue to brute-force by generating new cookies every X attempts

- __Ip based Rate limits__: Ip-based rate limits can be easily bypassed by changing the Ip address of your machine. The alternative would be using IP Rotate Burp Extension. Other than that [Shubs](https://twitter.com/infosec_au) has posted an amazing video on __Rate Limits and How to bypass IP-based rate limit__ on his youtube channel.

    <iframe width="560" height="315" src="https://www.youtube.com/embed/it_V3ig1_4o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>



## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology that ensures in-depth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team that values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
