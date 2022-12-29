---
layout: post
title:  "Lastpass Breach - Everything you need to know"
author: snapsec
categories: [ uber ]
image: assets/images/18/1.png
---


One of the largest online password manager with Over 25 million users as of 2020. LastPass suffered a massive data breach recently. The data included users information and vault data. Earlier in August LastPass had notified customers that some unauthorised actor had accessed their development server via compromised developer account, However, LastPass claimed that no customer data was accessed and only source code and some technical information was stolen. But recent developments in investigation show other wise.

# Previous incidents at Lastpass.

This is not the first time LastPass has suffered a breach. LastPass has suffered around 6 security incidents and data breaches since 2011.

- **In May 2011**, LastPass discovered an anomaly in their incoming network traffic as well as in their outgoing traffic. Due to the size of the anomalies, it was theoretically possible that data such as email addresses, the server Salt and the salted password hashes were copied from the LastPass database. However it was not proved that data was actually stolen. To fix the anomaly LastPass took down the breached server to re-build it and the notified all users to change their master password.
- **In June 2015**, LastPass notified that they discovered and halted suspicious activity on their network. Their investigation revealed that Users account email addresses, password reminders, server per user salts, and authentication hashes were compromised; however, encrypted user vault data had not been affected.
- **In July 2016**, a blog post published by independent online security firm Detectify detailed a method for reading plaintext passwords for arbitrary domains from a LastPass user's vault when that user visited a malicious web site. This vulnerability was made possible by poorly written URL parsing code in the LastPass extension. The vulnerability was patched before it issue was publicly disclosed.
- **In March 2017,** Tavis Ormandy discovered a vulnerability in the LastPass Chrome extension. The exploit applied to all LastPass clients, including Chrome, Firefox and Edge. The vulnerability was fixed immediately after it was discovered.
Few days later Ormandy discovered an additional security flaw allowing remote code execution based on the user navigating to a malicious website. This was also patched afterwards.
- **In August 2019**, Tavis Ormandy reported a vulnerability in the LastPass browser extension in which Web sites with malicious JavaScript code could obtain a username and password inserted by the password manager on the previously visited site. The issue was limited to the Google Chrome and Opera extensions only; nonetheless, all platforms received the vulnerability patch.
- **In August 2022** LastPass suffered the largest breach in their history. In August company notified that Unauthorized actors gained access to their development sever using compromised developer account. LastPass said hackers only accessed source code and some other technical information but customer data was not compromised. But latest developments find otherwise. Lets discuss this in detail.




# What happened at LastPass?

### Timeline of events.

On 25 August company notified customers of an unusual activity in its development server. Company said that they have already deployed contingency measures and additional security measures. Initial investigation revealed that unauthorized actor/actors were able to gain access to development environment via compromised developer account. Attackers were able to steal source code and some technical information.  Company claimed that no user data was compromised and vaults were secured with encryption.

This poses a question: **”Is access to company source code high security threat?”**
The answer is Yes. Source code and other technical information that was stolen from lastpass gave attackers an idea of architecture that is running behind the software. This information may reveal where certain data is stored and other resources that company uses. Since attackers have the source code, they will look hard into it to find any potential weakness in system that can be later used in further attacks.

**On 15 Sept,** company said they have concluded the investigation in partnership with 'Mandiant'. And revealed that attackers had access to development environment for four days. During these days attackers were able to steal source code and other company information but there was no evidence that attackers tampered with company software code or any user data was compromised.

“Our investigation revealed that the threat actor’s activity was limited to a four-day period in August 2022,” LastPass said in an update on the breach. “During this timeframe, the LastPass security team detected the threat actor’s activity and then contained the incident. There is no evidence of any threat actor activity beyond the established timeline.”

**On 30 November,** company again notified customers of a security incident that involved possible data breach. LastPass disclosed it is investigating a recent incident where someone using information obtained during the August intrusion managed to access source code and unspecified customer data stored within an unnamed third-party cloud storage service. LastPass did not disclose what kind of customer data the attacker might have accessed but maintained that its products and services remained fully functional. The new breach at LastPass suggests that attackers may have accessed more data from the company in August than previously thought.

**On 22 December,** LastPass issued an update on the previous security incident, acknowledging that a recent cyberattack has resulted in the theft of customer data.
Company said that attackers used the previously compromised data to target another employee, obtaining credentials and keys which were used gain access to and decypt the storage volumes within the cloud-based storage service. The 3rd party cloud storage was used to store archived backups of company's production data.
Attackers were able to copy the archived backups of basic data of customers as well as customer vault data

## What data was stolen?

1. **Encrypted vault data:**
- website usernames
- passwords
- secure notes
- form-filled data
1. **Unencrypted customer vault data:**
- website URLs
1. **Basic customer account information and related metadata**
- company names
- end-user names
- billing addresses
- email addresses
- telephone numbers
- IP addresses

## What data was not stolen?

- **Users master passwords** were not stolen as company does not store master passwords and encryption/decryption is done on client side.
- **Credit card information** was also secure as company did not store this data on compromised server and LastPass does not store complete credit card numbers.

Company also said in a statement that encrypted fields are secured with 256-bit AES encryption and can only be decrypted with a unique encryption key derived from each user’s master password using company's Zero Knowledge architecture. "As a reminder, the master password is never known to LastPass and is not stored or maintained by LastPass. The encryption and decryption of data is performed only on the local LastPass client" Company said in a statement.

## Are you at risk?

In short, The answer is **Yes**.
Currently there is no patch or mitigation to stolen data.
Since the data has already been stolen and is in hands of hackers. Changing your master password after the breach will not help at all, especially if you are/were using a weak password before the breach.
The only thing that is stopping hackers from accessing your data is your master password. Attackers can take their time and try to bruteforce the MasterPassword and gain access to data if the MasterPassword is weak.
The time it takes for attacker to successfully bruteforce your password depends on the users password Strength. For example, with current technology, a 10-digit password with only numbers can be cracked almost instantly whereas a 13-digit password with numbers, upper and lowercase letters, and symbols will take 2 million years to crack.
Here is visual representation:

![paasstrenth.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6a0d4d47-43c0-4e39-8452-bc9a19be03d1/paasstrenth.jpeg)

## What can you do now?

If you were using a strong MasterPassword it is unlikely that you data will be accessed as it will take lots of resources and time to crack. However, if your MasterPassword is weak then the best option is to:

- Change all the passwords that were stored on LastPass
- Change MasterPassword for future safety.
- Use unique password and not to repeat the previous passwords.
- Since the attackers have access to website URLs they might try to target victims with attacks like phishing scams.




## About us

Snapsec is a team of security experts specialized in providing pentesting and other security services to secure your online assets. We have a specialized testing methodology which ensures indepth testing of your business logic and other latest vulnerabilities. 

 If you are looking for a team which values your security and ensures that you are fully secure against online security threats, feel free to get in touch with us #[support@snapsec.co](mailto:support@snapsec.co)
 
