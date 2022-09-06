## Multiple bugs on agora pulse.

## Introduction

Agorapulse  provides everything an organization could possibly need for social media marketing, monitoring, and management. Agorapulse is a full-featured social media management platform. Some of its features include a variety of ways to publish content, scheduling posts and reporting about social account usage. Agorapulse provides platform for companies for their marketing strategies while also keeping it under the budget radar. The software is used to create & schedule social media content, engage audiences, listen for key terms, and analyze social media performance.


## Approaching the target

Assessing agorapulse, and discovering all of the related details connected with target is the basic approach we choose at first. Discovering all of the *live sub domains* using combination of various tools gave us a list of more than _50_ interesting subdomains. Analysing the list generally  we found some low hanging issues in various sub domains and prior  to their exploitation we decided to target the main domain first. Loopholes in the security of some of critical sub domains was an indication about the *poorly configured* security of *main domain as well*.

The postivie of choosing main domain to hack is having enough information to understand every functionality of the app. The application was extensive in functionalities and it gives users capability to integrate other third party accounts (complexity).  At this stage we appeared harmless and stealthly explored the app and understood the *logic of the application* and made ourselves capable to use it. This was all accmplished with the help of their *youtube channels, blogs, support channels, general search inqueries* etc. We invetigated the *structure of api paths* and *http requests* for various actions inside the application. We took note of the *ids being used* so that we don't miss on any **IDOR chances**. Following is the list of a few  vulnerabilities we found on agaorapulse.

## List of vulnerabilities found

| Title      | Severity|
| ----------- | ----------- |
| _RCE via Log4shell_      | **High**|
| _Accessing automatic scheduling reports_   | **Medium**|
| _Accessing sensitive organization information_   | **Medium**|
| _Changing ROI settings of account_   | **Medium**|
| _Changing general report settings like logo, timezone etc_   | **Medium**|
| _Chaniging rules of inbox assistant from an unauthorized role_   | **Medium**|


## 1 RCE via Log4shell

Log4j has been found to be vulnerable to a number of security threats. The log4j library has recently been found to contain a serious vulnerability.This vulnerability allows unauthenticated remote code execution on vulnerable servers and may be exploited to expose sensitive information.

We were able to discover the vulnerable log4j framework was implemented by *agorapulse* and we *exploied the same framework* by pasting the *paylaod in a new post*.

{{screenshot 1 of post}}

Which *resulted in a DNS pingback* from the agora servers. After the confirmation we *exploited the vulnerability* by *reading various environment variables* of agorapulse servers without performing any sensitive *actions*. 

{{environment varibales screenshot rep1}}

You can go through detailed process on this [blog](https://snapsec.co/blog/Log4shell-on-agorapulse/).

## 2Accessing automatic scheduling reports

In agorapulse we can have our Reports emailed to us automatically, so that we don't need to worry about exporting it manually again. This feature is available as part of the [Power Reports add-on].
With the guest role in the organisation a user has limited access to the organisation's social profile settings.The guest user is restricted from viewing the information of automatic scheduled reports .
 But we were able to identify a vulnerable endpoint with broken access control that lets an unauthorised used to gain access to restricted information.

- Scheduled reports information, labels information and the groups information
```http
GET /api/bootstrap?accountId=574034 HTTP/1.1 
```
By forwarding the above request with the authorisation token of a guest user , the response received is 200 ok but it also returns  data such as information related to automatic scheduling reports like assigne emails,labels and group names in that particular organisation.


##  3 Accessing sensitive organization information

This app had various organization roles with segregated permissions. One from the list was *guest role* which had no direct access to the *organization* but  few features like *posts to review*,  *likes* etc. Trying to access various *instinctively vulnerable api paths* with the *credentials of the guest role* we got no success. 

Until an api endpoint like `GET /api/organizations/<<org id>>?organizationId=<<org id>> HTTP/1.1` crossed our sight. Since we premeditated the ids which were  being used in the request and we quickly identified this id could return a set of various *informations about the organization* particularly *restricted to the guest role*.  Sending this request with credentials of guest role we *got 200 ok* with various *organization information in the response*. The information included *scheduled calendars, email adresses of shared members, identification ids, meeting dates* and other information.

{{3 report response of 200o k}}

## 4Changing ROI settings of account

Return on Investment (ROI) is a popular profitability metric used to evaluate how well an investment has performed. In agorapulse the ROI feature allows you to know the monthly value generated by your page.
With the guest permission in an organisation the user has limited access to the organisation's social profile settings.Only users with admin rights can enable/disable the ROI settings for a particular page.

But we were able to identify a broken api endpoint through which a user with guest permission was able to change the ROI settings of a page.

- Changing ROI settings
```http
PUT /api/organizations/287159/workspaces/187160/settings/roi/accounts/facebook_574024 HTTP/1.1

{"roiEnabled":true,"postImpressionValue":5,"postLinkClickValue":1,"userEngagedValue":1,"accountUid":"facebook_574024"}
```
In the above request by passing the id parameter of a page a user with guest permission is able to change the ROI settings of that page without any access on it.

## 5Changing general report settings like logo,timezone etc.

With guest permission in an organisation a user has no access to the general settings of social media profiles.The guest user is not able to change the report settings due to limited permissions.
But we were able to identify a broken api path through which a user with guest permissions was able to change the general report settings of a organisation.The broken access on the vulnerable  endpoint let's a guest to change the timezone, author name and the logo for the reports.

- Add reporter name and other general report settings
```http
PUT /api/organizations/287157/workspaces/187158/settings/accounts/facebook_574363 HTTP/1.1

{"accountUid":"facebook_574363","authorName":"Waris","browserTimezoneEnabled":true,"locale":"en","timezone":"Asia/Calcutta"}
```

Leveraging this request we can keep any random author for this organization and also we were able to change the *timezone settings* which can lead to disruption in automatic postings on accounts.


## 6 Chaniging rules of inbox assistant from an unauthorized role

This issue was again idetified from the *guest role*, which was basically the lowest level role available in the organization. This role was *granted some basic read permissions* on  limitted features. 

A feature implemented by agora for the automation of inbox messages was *inbox assistant*. Authorized users are able to create ceratin rules *by which the replies* to the *received messages* will be given. This feature was totally *unaccessible to the guest role* . Analysing the *flow of the api requests*  responsible for *moving the inbox assistants and viewing various rules*, we got our hands on a *vulnerable request* which was responsible for *moving the inbox rules*. The http request looked something like this:

```http
PUT /api/accounts/twitter_137253/rules HTTP/1.1 
Host: inbox.agorapulse.com 
Connection: close Content-
Length: 17 sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92" Accept: application/json, text/plain, */ 
Authorization: Bearer


{"from":<<inbox assistant id of current inbox>>,"to":<<inbox assistant id of another inbox}
```

Sending this request with the credentials of the *guest* we got _200 ok_ and and the rule was moved to *different assistant*.We just need to get the *assistant name* which was leaking to the *guest via another GET request*. Using the name in the mentyioned request we were able to move the rules from this inbox assistant to another inbox assistant.
>Please note the actual http request were different from the ones posted here.
