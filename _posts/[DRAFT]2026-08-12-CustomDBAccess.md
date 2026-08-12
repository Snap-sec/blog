---

layout: post
title: "Executing Custom Database Scripts from Unauthorized Roles"
author: snapsec
categories: [VAPT]
image: assets/images/23/0.png

---

## Introduction

A **Broken Access Control (BAC)** vulnerability was reported in the Auth0 Management Dashboard.

The affected target was `manage.auth0.com`, with the affected API endpoints located under:

```text
https://manage.auth0.com/api/*
```

The issue allowed roles without permission to view, edit, or delete user information to execute Custom Database Action Scripts and perform actions against user information stored in custom databases added to Auth0.

## Affected Endpoints

The following endpoints were identified:

```text
https://manage.auth0.com/api/try-verify
https://manage.auth0.com/api/try-create
https://manage.auth0.com/api/try-login
https://manage.auth0.com/api/try-change_password
https://manage.auth0.com/api/try-get_user
https://manage.auth0.com/api/try-delete
```

These endpoints were reported as having no access-control protection, allowing roles without the appropriate permissions to perform actions on user information.

## Affected Roles

The reported role escalations were:

| Role                   | Escalation               |
| ---------------------- | ------------------------ |
| Editor - Specific Apps | View, Edit, Delete Users |
| Editor - Connections   | View, Edit, Delete Users |
| Viewer - Users         | Edit, Delete Users       |
| Viewer - Config        | View, Edit, Delete Users |

According to the report, these roles could escalate their privileges through the affected endpoints.

## Setting Up the Custom Database

The reported scenario begins with an administrator or invited user creating a new Connection and enabling a Custom Database on that connection.

The Database Action Script is then enabled and configured. The report states that all Custom Scripts, including **Get User, Delete User, Change Password**, and others, should be configured.

![Image 1](/assets/images/bb/unauth1.png)

The screenshot shows the Custom Database configuration in the Auth0 dashboard, including the Custom Database option being enabled.

## Users in the Custom Database

The scenario then uses a Custom MySQL database containing several users.

A tenant member is invited into the organization using the **Viewer - Users** role.

![Image 2](/assets/images/bb/unauth2.png)

The screenshot shows the Custom Database configuration and the users stored in the Custom MySQL database.

## Deleting a User

The issue was demonstrated using the `Viewer - Users` role.

According to the report, an attacker with the `Viewer - Users` role could send a request to the following endpoint:

```http
POST /api/try-delete HTTP/1.1
Host: manage.auth0.com
Connection: close
Content-Length: 37
Accept: application/json, text/plain, */*
X-CSRFToken: <CSRF-Token-of-viewer-users>
x-from-loc: https://manage.auth0.com/dashboard/us/morning-voice-1877-bugcrowd/connections/database/con_vfeWI4nNvmeCjh6y/plug
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36
Content-Type: application/json;charset=UTF-8
Origin: https://manage.auth0.com
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://manage.auth0.com/dashboard/us/morning-voice-1877-bugcrowd/connections/database/con_vfeWI4nNvmeCjh6y/plug
Accept-Language: en-US,en;q=0.9
Cookie: <COOKIE-of-viewer-users>

{"connection":"NewDatabase","id":"6"}
```

The request returned:

```text
HTTP/1.1 200 OK
```

![Image 3](/assets/images/bb/unauth3.png)

The screenshot shows the tenant member assigned the **Viewer - Users** role and the request sent to the `/api/try-delete` endpoint.

## Result

After sending the request, the researcher logged into the Custom Database and reported that the user with `id=6` had been removed from the database.

![Image 4](/assets/images/bb/unauth4.png)

The screenshot shows the request and response, followed by the Custom Database where the user with `id=6` is no longer present.

The report further states that an attacker could run a loop from `1-n` to delete all users from the database. It also states that the other endpoints could be called with their respective parameters to perform other attacks, including creating users and changing user passwords.

## Parameters and Endpoint Functions

The following endpoints, purposes, and required JSON parameters were listed:

| Endpoint                                           | Purpose                | JSON Parameters Needed |
| -------------------------------------------------- | ---------------------- | ---------------------- |
| `https://manage.auth0.com/api/try-verify`          | Verifying Users        | `email`                |
| `https://manage.auth0.com/api/try-create`          | Creating Users         | `username,email`       |
| `https://manage.auth0.com/api/try-login`           | Trying Log-in Users    | `username,password`    |
| `https://manage.auth0.com/api/try-change_password` | Changing Password user | `email,newPassword`    |
| `https://manage.auth0.com/api/try-get_user`        | Get user details       | `email`                |
| `https://manage.auth0.com/api/try-delete`          | Delete Users           | `id`                   |

![Image 5](/assets/images/bb/unauth5.png)

The screenshot shows the request and response information, the resulting database state, and the beginning of the endpoint parameter table.

## Impact

The reported impact for the affected endpoints was:

| Endpoint                                           | Impact                                                                                                                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://manage.auth0.com/api/try-verify`          | Attacker verifying unverified users, and attacker un-verifying verified users                                                                |
| `https://manage.auth0.com/api/try-create`          | Creating New Users                                                                                                                           |
| `https://manage.auth0.com/api/try-login`           | Brute-force user account passwords against the custom database and bypass brute-force protection as requests will be sent from Auth0 servers |
| `https://manage.auth0.com/api/try-change_password` | Changing Password of user accounts                                                                                                           |
| `https://manage.auth0.com/api/try-get_user`        | Get user details                                                                                                                             |
| `https://manage.auth0.com/api/try-delete`          | Deleting Single User, Delete all users by sending requests from `1-n`                                                                        |

![Image 6](/assets/images/bb/unauth6.png)

The screenshot contains the complete endpoint parameter table and the reported impact for each affected endpoint.

## Reported Result

The report concludes that an attacker was able to get read/write permission on the information in the custom database through the affected functionality.

## Conclusion

The reported vulnerability was classified under **Broken Access Control (BAC)** and affected the Auth0 Management Dashboard.

The issue allowed roles without the required permissions to access Custom Database Action Script endpoints and perform operations involving users in a custom database.

The reported operations included verifying users, creating users, attempting logins, changing user passwords, retrieving user details, and deleting users.

The demonstrated deletion request showed that a user assigned the **Viewer - Users** role could delete a user from the custom database despite not having the expected permission to perform that action.

## Source

This article is based on the reported vulnerability **"Executing Custom Database Scripts from un-authorized roles"**, which was classified as **Broken Access Control (BAC)** and targeted the Auth0 Management Dashboard.


