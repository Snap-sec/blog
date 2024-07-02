---
layout: post
title:  "regreSSHion: Unauthenticated Remote Code Execution Vulnerability in OpenSSH Server"
author: snapsec
categories: [ cyberattacks,ssh,0day ]
image: assets/images/27/0.png

---





The Threat Research Unit at qualys has found a critical Remote Unauthenticated Code Execution (RCE) vulnerability in the OpenSSH server (sshd) on glibc-based Linux systems. Designated as CVE-2024-6387, this flaw is a race condition in the signal handler of sshd, enabling unauthenticated attackers to execute code remotely as root, thus posing a substantial security risk. This vulnerability affects sshd in its default settings, leaving millions of systems exposed.

Extensive searches using Censys and Shodan have identified over 14 million potentially vulnerable OpenSSH server instances exposed on the Internet. According to anonymized data from Qualys CSAM 3.0, about 700,000 of these instances are internet-facing and vulnerable, representing 31% of all global customer instances using OpenSSH. Additionally, a small percentage of these instances are running outdated versions of OpenSSH that are no longer supported. Interestingly, this vulnerability is a regression of CVE-2006-5051, a previously patched flaw that reappeared in OpenSSH 8.5p1 in October 2020. Qualys has developed a working exploit to aid the OpenSSH team in remediation efforts, emphasizing the need for rigorous regression testing to avoid reintroducing known vulnerabilities.


## Vulnerable versions

The regreSSHion vulnerability affects OpenSSH versions 8.5p1 through 9.7p1, specifically:

```
'SSH-2.0-OpenSSH_8.5p1',
'SSH-2.0-OpenSSH_8.6p1',
'SSH-2.0-OpenSSH_8.7p1',
'SSH-2.0-OpenSSH_8.8p1',
'SSH-2.0-OpenSSH_8.9p1',
'SSH-2.0-OpenSSH_9.0p1',
'SSH-2.0-OpenSSH_9.1p1',
'SSH-2.0-OpenSSH_9.2p1',
'SSH-2.0-OpenSSH_9.3p1',
'SSH-2.0-OpenSSH_9.4p1',
'SSH-2.0-OpenSSH_9.5p1',
'SSH-2.0-OpenSSH_9.6p1',
'SSH-2.0-OpenSSH_9.7p1'
```

These versions are vulnerable to a race condition in the signal handler, enabling remote unauthenticated code execution. Administrators should urgently update to a patched version to address this critical security issue.

## Detection

To check if your OpenSSH server is vulnerable, you can use the following methods:

1. **Check OpenSSH Version Using Command Line:**

![image](https://github.com/Snap-sec/blog/assets/88488902/b3acde7a-9df4-4e07-82d2-c13baf420e95)


   Open a terminal and type:
   ```
   ssh -V
   ```
   This command will display the version of OpenSSH installed on your system. Compare the version with the vulnerable versions mentioned earlier ('SSH-2.0-OpenSSH_8.5p1' to 'SSH-2.0-OpenSSH_9.7p1').

2. **Check OpenSSH Version Using Netcat (nc):**

![image](https://github.com/Snap-sec/blog/assets/88488902/c75b6c1f-72ed-44ba-a5c6-64a3edc6a958)


   Use netcat to connect to the SSH port (typically port 22) of your server and observe the server's response headers:
   ```
   nc <hostname or IP> 22
   ```
   After connecting, the SSH server typically responds with its version information. Look for a response that includes the OpenSSH version number. Again, compare this version with the list of vulnerable versions provided earlier.

If your server is running one of the vulnerable versions, it is crucial to update OpenSSH to a patched version as soon as possible to mitigate the regreSSHion vulnerability. Regularly updating your software and maintaining security patches is essential to protect against such vulnerabilities.


## Automated Vulnerability Detection with SnapSec


At SnapSec, we prioritize proactive security measures through automated vulnerability detection. Our dedicated team continuously monitors the latest exploits released in the cybersecurity landscape. When a new vulnerability like regreSSHion in OpenSSH is identified, our experts swiftly create comprehensive detection rules tailored to the exploit's characteristics.

Using our SnapSec suite, these rules are integrated into our scanning and monitoring systems without delay. This automated process ensures that all customer infrastructures are promptly scanned for vulnerabilities associated with newly discovered exploits. Results from these scans are then relayed directly to our intuitive dashboard, providing our clients with real-time visibility into their security posture.

By leveraging automation, SnapSec empowers organizations to stay ahead of emerging threats, such as regreSSHion, by promptly identifying and mitigating vulnerabilities before they can be exploited. This proactive approach not only enhances security but also ensures peace of mind for our customers, knowing that their systems are continuously monitored and protected against the latest cybersecurity risks.
