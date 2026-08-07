---
layout: post
title:  "Attacking CORS Misconfigurations in Modern Web Apps"
author: adnan
categories: [ article,cors ]
image: assets/images/8/0.png

---




If you are a developer, you already know that it’s nearly impossible to keep every resource in one place. It’s expensive (because everything has to be managed by one party) and it gets quite messy. So you maybe thinking that developers can potentially use two different domains to sepereate resources on different servers. An API on an `api.web.com` and the User Interface `on ui.web.com`, But due to the security mechanism called [SOP](https://portswigger.net/web-security/cors/same-origin-policy) the context and resources of each website is isolated from each other, which means any resource loaded from api.web.com cannot be accessed by ui.web.com. Which again leads us to the same problem, because if API and UI hosted on two different domains would never be able to access resources from each other, It would make no sense to seperate them at the first place.  Thats where the CORS(Cross Origin Resource Sharing) comes to the picture, The method that allows different websites share resources to each other without breaking the SOP.




## What is CORS:


![1](/assets/images/8/1.png)


CORS stands for CROSS ORIGIN RESOURCE SHARING. This method allows websites to load resources from different domains securely. These resources are usually fonts, images/videos, CSS, ajax requests containing API responses. CORS adds flexibility to Same-Origin-Policy which blocks reading resources from different origins by default. With Same-Origin-Policy, JavaScript can only make calls to URLs that live on the same origin as the location where the script is running. For example, if a JavaScript app wishes to make an AJAX call to an API running on a different domain, it would be blocked from doing so. To overcome this problem, CORS was introduced. CORS allows servers to specify certain trusted ‘origins’ they are willing to permit requests from.

So how do we define origin? Well, origin can be defined as the combination of:

1. Protocol: Protocol could be a HTTP or HTTPS.
2. Host: This is where your website lives. like example.com or it could be an IP address
3. Port: These are communication endpoints. Default port of HTTP is `80` and or HTTPS it is `443`

So in order for two Requests's to have the same origin they must be identical in terms of `Protocol, Host, and Port`.  That means from the above definition we see that `http://example.com` and `https://example.com` are two completely different hosts.

## How is CORS implemented

When we want a website different than our own to access the resources on our server configration or API configration, we have to include the trusted origins on our server or we can add a wildcard(*). Wildcard means anyone can access our resources regardless of their origin. For example, if we want to allow specific domains to access our server resources, we have to enable the CORS in server configuration. This can be done like:

```
💡 “Allowed origins: “https://example.com:8080”
```

Or we if we want to give access to all website we add

```
💡  Allowed origins: *
```

The Server Response Must include the following headers in order to instruct web browser to allow/disallow the specific origin from accessing cross origin resources:

```
💡 Access-Control-Allow-Origin
💡 Access-control-allow-credentials
```


__💡 Access-Control-Allow-Origin__

 Access-Control-Allow-Origin header in the response indicates whether the response can be shared with requested origin or not, The value of Access-Control-Allow-Origin header is basically a criteria whethere the origin domin who originate the request is allowed to access the response or not. 
 

__💡 Access-control-allow-credentials__:

By default, CORS does not include cookies in requests which are not originated from the same origin. So there is another header that we have to add and that is `Access-control-Allow-Credentials` This lets the browser to allow the requested whitelisted domain to read the credentials like cookies, authorization headers, tokens or TLS client certificates. The client code *must* set the `withCredentials` property on the `XMLHttpRequest` to `true` in order to give permission.

The server *must* respond with the `Access-Control-Allow-Credentials` header. Responding with this header to `true` means that the server allows cookies (or other user credentials) to be included in cross-origin requests.


## Types of CORS requests

![1](/assets/images/8/2.png)


When two different domains access cross origin resource, There are two types of CORS requests made:

- Simple request
- Preflight request

**Simple request:** Any request with the method of ***GET, POST and HEAD*** is called simple request. In these cases, the browser will directly make a request with origin header in it, without any pre-check. After sending the request, HTTP response headers are checked to determine whether the request should go through or not.

The request with the origin header would go as:

**`Origin: http://example.com`**

Response from the destination would be either of the following:

1. `Access- Control-Allow-Origin: http://example.com` (which conveys that this domain is allowed)
2. `Access-Control-Allow-Origin: *` (which conveys that all domains are allowed)**
3. `Error`: An error if the cross-origin requests are not allowed (which conveys that access is not allowed)**

**Preflight requests:** Any request with the special HTTML Methods eg (**PUT/PATCH/DELETE**) is deemed as unsafe methods because they affect the integrity of server data. Therefore, before these requests are made to the server, an extra pre-flight **OPTIONS** request is sent by the browser, this request is called preflight check request. Because its always sent before browser makes the actual request. 

The following information is sent to the server in the pre-flight request:

- **Origin** — The origin header that would be included with the actual request being made by the website.
- **Access-Control-Request-Method** — The method of the actual request being made by the website.
- **Access-Control-Request-Headers** — A comma-separated list of headers that would be included in the actual request.

for example:

```
💡 Origin: example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Content-type, Authorization-Bearer
```

An example response from server would look like this:

```
💡 Access-Control-Allow-Origin: example.com
Access-Control-Allow-Methods: PUT,DELETE,PATCH,GET,POST,HEAD
Access-Control-Allow-Headers: Content-type, Authorization-Bearer

```

In this case the actual request is originated from `example.com` and so the browser decided the make the above mentioned pre-flight request which contains information that the origin example.com wants to send a HTTP Delete Request to the server. In return the server Responsds with `Access-Control-Allow-Origin: example.com` which indicates that origin `example.com` is allowed to make the following HTTP Request types mentioned in the `Access-Control-Allow-Methods` header which is  PUT,DELETE,PATCH,GET,POST,HEAD.

If any of the information in the response headers does not match the actual parameters of the request, the browser will not send the actual request, thus preventing unwanted side-effects from the server receiving the cross-origin request.




## CORS misconfigration and exploitation

![1](/assets/images/8/3.png)


Each application is build different hence needs a different CORS configrations. And if CORS configration are not strictly adhrered to the requirements of the application it can lead to Misconfigration issue which may result a security issue with a High impact on the security of a website. A CORS misconfiguration can leave the application-users at a high-risk of compromise of their sensitve information resulting in an impact on the confidentiality and integrity of data by allowing third-party sites to carry out privileged requests to vulnerable websites by posing as authenticated users. The malicious website can also retrieve user setting information or saved payments, cookies etc etc

Here are few common misconfigrations and how to exploit them:

#### Wildcard(*) misconfigration:

When the browser receives the response, the browser checks the `Access-Control-Allow-Origin header` to see if it matches the origin of the request. If not, the response is blocked. The check passes such as in this example if either the `Access-Control-Allow-Origin` matches the `single origin exactly` or contains the wildcard `*` operator, Wildcard means that any domain can access the resources of the server.

```
💡 Get /api/userinfo

Host: vulnerablewebsite.com
Origin: attacker.com
```

After sending the above request if server responds with the following response, Its vulnerable to CORS Misconfigration issue.

```
💡 Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```


#### Basic Reflected CORS Misconfig

This CORS Misconfigration is simple yet one of the most found CORS miconfigration in todays modern web applications. In this case whatever the value of Origin Header is set in the request is reflected back in the `Access-Control-Allow-Origin` header in the response. 

```
💡 Get /api/userinfo

Host: vulnerablewebsite.com
Origin: attacker.com
```

After sending the above request if server responds with the following response, Its also a vulnerable to CORS Misconfigration issue.

```
💡 Access-Control-Allow-Origin: attacker.com
Access-Control-Allow-Credentials: true
```

This is a worst case scenario of a misconfigured server which can be easily exploited and can be used to steal user data and credentials, hence affecting the confidentiality and integrity of data.


 
#### Bad regex implementation
 
One of the most common ways to check if the Origin is trusted is to test it against a Regular Expression. Almost all Programming languages provides easy and very powerful Regular Expression modules/functions to check if a Origin in the request matches trusted Origin. Sometimes, functions or regular expression itself  either misused or not very well creafted by developers and when you see this it can be possible to bypass weak input validation functions. These rules are often implemented by matching URL prefixes or suffixes, or using regular expressions. Any mistakes in the implementation can lead to access being granted to unintended external domains.

Example: Lets say i want to whitelist all the subdomains of the example.com , So i created an weak regex which is `example\.com` which will match all the strings which contain example.com in them. But the fact that `example.com.attacker.com` is also matched to the expression but this subdomain is not the subdomain of example.co and Hence would allow attacker to perform attack from attacker.com.



The attacker can use the following methods of origin on vulnerable website :

```
💡 Get /api/userinfo

Host: vulnerablewebsite.com
Origin: example.com.attacker.com
```

After sending the above request if server responds with the response with Access-Control-Allow-Origin header set to your domain sent in request, Its vulnerable to CORS misconfigration.


```
💡 Access-Control-Allow-Origin: example.com.attacker.com
Access-Control-Allow-Credentials: true
```




#### Whitelisted All Subdomains misconfigration

Mistakes often arise when implementing CORS origin whitelists. Some organizations decide to allow access from all their subdomains including the ones not in existence yet(like *.example.com). And some applications allow access from various other organizations' domains, including their subdomains.

The attacker can use the following methods of origin on vulnerable website :

```
💡 Get /api/userinfo

Host: vulnerablewebsite.com
Origin: attacker.vulnerablewebsite.com
```

If a server responds with any of the above domain in response with credentials set to true, then the server is exploitable.


```
💡 Access-Control-Allow-Origin: attacker.vulnerablewebsite.com
Access-Control-Allow-Credentials: true
```

The following type of CORS misconfigration is only exploitable when attacker manages to find XSS or subdomain takeover vulnerability in any of victims subdomains


**Exploiting CORS via XSS:**


Suppose we have a website, secure.com and it has some whitelisted subdomains in CORS policy. Since these subdomains trust each other completely, if the subdomain is vulnerable to XSS, attacker can exploit the XSS in vulnerable subdomain and inject some JavaScript that uses CORS to retrieve sensitive information from the securesite.com that trusts the vulnerable application.

#### NULL origin:

During our experiance in Testing CORS on hundrends of websites, We found Some websites returns `Access-Control-Allow-Origin:NULL` and `Access-Control-Allow-Credentials:true` when ogigin is set to NULL (`origin:Null`).

```
💡 Get /api/userinfo

Host: vulnerablewebsite.com
Origin: Null
```

If a server responds with any of the above domain in response with credentials set to true, then the server is exploitable.


```
💡 Access-Control-Allow-Origin: Null
Access-Control-Allow-Credentials: true
```

The following type of CORS misconfigration is exploitable using the [sandboxed iframe technique](https://portswigger.net/web-security/cors/lab-null-origin-whitelisted-attack).


## Conclusion

Cors was implemented to make it possible for websites to share resources with each other with least impact on security. However, this introduced a vast number of security risks. If CORS is not properly configured it can lead to high security impact on the website, affecting Confidentiality, Integrity and Availability of company data.


Additionally, We recently published a thread about How to Look for `Insecure CORS Configuration` vulnerabilities. If you haven’t read that already, we urge you to spend the time reading it and give us a follow too.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">How to Look for &quot;Insecure CORS Configuration&quot; vulnerabilities. <br><br>[A thread 🧵]<a href="https://twitter.com/hashtag/appsec?src=hash&amp;ref_src=twsrc%5Etfw">#appsec</a> <a href="https://twitter.com/hashtag/bugbounty?src=hash&amp;ref_src=twsrc%5Etfw">#bugbounty</a> <a href="https://twitter.com/hashtag/bugbountytips?src=hash&amp;ref_src=twsrc%5Etfw">#bugbountytips</a> <a href="https://twitter.com/hashtag/cybersecurity?src=hash&amp;ref_src=twsrc%5Etfw">#cybersecurity</a></p>&mdash; Snap Sec (@snap_sec) <a href="https://twitter.com/snap_sec/status/1467528029773520897?ref_src=twsrc%5Etfw">December 5, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>



## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
