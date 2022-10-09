---
layout: post
title:  "Security Simplified - Open Redirect [Server Side]"
author: imran
categories: [ tutorial,imran ]
image: assets/images/SecuritySimplified/or-2/0.png
---



Open redirection vulnerabilities arise when an application incorporates user-controllable data into the target of a redirection in an unsafe way. An attacker can construct a URL within the application that causes a redirection to an arbitrary external domain. _-portswigger_

Please note that open redirection can be caused by the code sitting at the server side as well as code at the front-end. In this blog article, we will examine server-side perspective.


## Vulnerable Code Snippet (Server Side)


```php
<?php
if(isset($_GET['url'])){
	$url=$_GET['url'];
	header('Location:'.$url);
}
?>
```

In the Above Code Snippet:
	
- isset() is a function which checks whether a variable is empty or not and if the variable is set/declared. If the variable is not empty it returns True otherwise false.

- `$_GET` is a PHP super global variable which is used to access GET based parameters from anywhere in the PHP script, As an example, if you visit a URL `https://snapsec.co/book.php?id=1`. The following code allows the book.php to access the URL's GET-based `id`  parameter. `$_GET['id']`.

The `echo ""` statement is used to print any values passed within the quotes. This data is written in a response sent to the user.



- The __header()__ function sends a raw HTTP header to a HTTP client which is browser in this case. 

- The HTTP __Location header__ is a response header indicates the URL to redirect a user to.


__Conclusion:__

> So, from this code snippet, we can derive that it checks if the GET based parameter 'url' is set in the URL, and if it is, it sends a raw HTTP Response Header 'Location' set to the client with a value set to whatever is sent in the client's request.

In other words, it redirects the user to the value he/she specified in the url parameter.


## Exploitation

If the website does not validate the url parameters, we can simply enter any web address in the url parameter and it will redirect us to the page.

![1](/blog/assets/images/SecuritySimplified/or-2/vid1.gif)


	
## Where is the problem

Now the question is which part of the code snippet is vulnerable and what makes it vulnerable?


The vulnerability in this case is rather straightforward: the current code snippet adds the value of the 'url' parameter to the response header that is transmitted to the client without any input constraints. Therefore `header('Location:'.$url);` is the actual piece of code that causes this vulnerability.



## Fix

The solution can change depending on the circumstance. One solution is to allow only whitelisted domains or relative urls to be redirected to.

__While Listed Domains__


```php

<?php

function validate($url)
{
    $whilt_list_domain = "snapsec.co";

    $info = parse_url($url);
    $host = $info["host"];

    if ($host == $whilt_list_domain) {
        return true;
    } else {
        return false;
    }
}

if (isset($_GET["url"])) {
    $url = $_GET["url"];

    if (validate($url)) {
        header("Location:" . $url);
    } else {
        echo "Domain Not Allowed";
    }
}

?>


```



![1](/blog/assets/images/SecuritySimplified/or-2/vid2.gif)



In the following php code, we introduce a new function called `Validate(url)`, This function takes a user input URL as parameter and then checks if the host of the URL is equal to the white-listed domain. If that is the case, it allows redirection to happen; otherwise, the redirection is blocked and an error message `Domain Not Allowed` is blocked.



__Allowing Only Absolute URL's__


One of the interesting fixes would be only allowing relative URL's, which would block all open redirection attempts.
```php

<?php

function validate($url)
{
    $pattern = "/^(?:\/|\\|\w\:\\|\w\:\/).*$/";
    return preg_match($pattern, $url);
}

if (isset($_GET["url"])) {
    $url = $_GET["url"];

    if (validate($url)) {
        header("Location:" . $url);
    } else {
        echo "Absulute URL's Not Allowed";
    }
}

?>


```

The function `Validate(url)` is introduced in the following PHP code. It accepts a user-inputted url as a parameter and determines whether the value is a relative url by comparing it to a regular expression saved in the `pattern` variable. Redirecting is permitted if the URL is relative; otherwise, it is prohibited.


## Confirming the FIX
- On going back and trying to reproduce open redirection on both the fixes , Yon can see we were able to fix the vulnerabilities.


![1](/blog/assets/images/SecuritySimplified/or-2/confirm.gif)



## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)


