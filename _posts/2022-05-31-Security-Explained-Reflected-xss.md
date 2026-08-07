---
layout: post
title:  "Security Simplified - Reflected XSS"
author: imran
categories: [ XSS, security-simplified ]
image: assets/images/SecuritySimplified/rxss-1/0.png
---





Cross-site scripting (also known as XSS) is a web security vulnerability that allows an attacker to compromise the interactions that users have with a vulnerable application, Reflected XSS arises when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way, Which eventually allows attackers to design specially creafted URL which if visited by victim will run attacker controlled javascript code with victims browser and can lead to different attacks purely based on the code written by the attacker. _- Portswigger_


## Vulnerable Code Snippet


```php
<?php

if(isset($_GET['name'])){
echo "Hello " .$_GET['name'];
}

?>

```

So basically the code consists of two-line, The first line with the if statement and the second line with the echo statement. 

- isset() is a function, Which checks whether a variable is empty or not. Also checks whether the variable is set/declared, If the variable is not empty it returns True otherwise false.


- `$_GET` is a PHP superglobal variable that is used to access GET based Parameters from anywhere in the PHP script, As an example, if you are visiting a URL `https://snapsec.co?book.php?id=1` , The GET based `id` parameter in the URL can be accessed by the book.php by using the following code `$_GET['id']`.

- The `echo ""` statement is used to echo/print/reflect any values passed within single quotes, This data is written in a response sent to the user.


> So in conclusion what we understood from this code snippet is that it checks if the GET Based parameter `name` is set in the URL if its set it prepends "Hello" to the `name` and sends the response to the user.

## Exploitation

- On visiting the code snipped via the Browser and passing `name` parameter, It can be seen that the value of the `name` parameter is being reflected to user.

![1](/assets/images/SecuritySimplified/rxss-1/1.png)



- Now, what happens if the value of the `name` parameter is changed to something like an HTML, Javascript piece of code. You can see the HTML code was executed rather than being displayed to the user.

![1](/assets/images/SecuritySimplified/rxss-1/2.png)



- On having a closed look at the source code of the page, You can see the reflected value is being treated as an HTML code and gets executed in the browser.


![1](/assets/images/SecuritySimplified/rxss-1/3.png)




- This also means that if the javascript code is passed to the parameter, On being reflected the browser will treat it as a javascript code and hence execute it

![1](/assets/images/SecuritySimplified/rxss-1/4.png)



## Where is the problem

Now the question is which part of the code snippet is vulnerable, and What makes it vulnerable?

The answer to that is quite simple, The piece of code which is responsible to reflect data to the user is not encoding special characters before sending it to the user, Hence allowing the attacker to achieve XSS, So to be more specific the `echo ""` is responsible for the vulnerability.


## Mitigating the Issue

In general, the solution is to use different encoding techniques to perform careful input validation and context-sensitive encoding on the user input. For example in this case the `htmlentitie(str)` function can be wrapped up to the User input which will Convert the majority of the special characters to HTML entities:




Hence the final code will look like this

```php
<?php

if(isset($_GET['name'])){

echo "Hello " .htmlentities($_GET['name']);
}

?>
```


## Confirming the FIX

- Ongoing back and trying to inject an image in the name parameter you can see we were not able to inject new HTML code

![1](/assets/images/SecuritySimplified/rxss-1/5.png)


- This is because all the special characters were properly encoded by `htmlentities()` function before sending them to the user.

![1](/assets/images/SecuritySimplified/rxss-1/6.png)


## About us
Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities.

If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us [support@snapsec.co](mailto:support@snapsec.co)

Thanks and see you soon.



