---

layout: post
title: "Executing Custom Database Scripts from Unauthorized Roles"
author: snapsec
categories: [VAPT]
image: assets/images/23/Unauth-image.png

---

## Introduction

A **Broken Access Control (BAC)** vulnerability was identified in the management dashboard of a cloud-based identity and access management platform.

The issue affected API endpoints responsible for executing Custom Database Action Scripts. Roles that were not authorized to view, edit, or delete user information were able to invoke these backend functions and perform operations against users stored in custom databases.

This created a privilege escalation scenario where users with limited dashboard permissions could perform administrative actions that should have been restricted to higher-privileged roles.

> **Disclosure Note:** The identity of the affected organization, its product name, domains, tenant information, and infrastructure-specific identifiers have been intentionally omitted. Endpoint references have also been presented without the original host or domain to prevent disclosure of company-specific infrastructure.

## Affected Endpoints

The affected functionality was exposed through the following API paths:

```text
/api/try-verify
/api/try-create
/api/try-login
/api/try-change_password
/api/try-get_user
/api/try-delete
```

These endpoints were responsible for executing Custom Database Action Scripts. The underlying authorization checks did not adequately restrict access based on the permissions assigned to the authenticated role.

As a result, users with insufficient privileges could invoke functionality intended for users with broader permissions.

## Affected Roles

The following role configurations were affected:

| Role                   | Unauthorized Capability  |
| ---------------------- | ------------------------ |
| Editor - Specific Apps | View, Edit, Delete Users |
| Editor - Connections   | View, Edit, Delete Users |
| Viewer - Users         | Edit, Delete Users       |
| Viewer - Config        | View, Edit, Delete Users |

The privilege escalation occurred because authorization was not consistently enforced at the affected API endpoints.

## Setting Up the Custom Database

The scenario begins with an administrator configuring a new database connection and enabling a **Custom Database**.

The associated Database Action Scripts are then configured for operations such as:

* Get User
* Delete User
* Change Password
* Create User
* Login
* Verify User

These scripts provide application-level functionality for interacting with users stored in the custom database.

The security issue occurs when these backend functions remain callable by roles that do not have permission to perform the corresponding user-management operations.

## Users in the Custom Database

The test environment contained a custom database with multiple user records.

A tenant member was assigned the **Viewer - Users** role.

This role was expected to provide visibility into user-related information without granting permission to modify or delete users.

However, the backend API did not enforce the same authorization restrictions as the management interface.

## Deleting a User

The issue was demonstrated using the `Viewer - Users` role.

An authenticated session belonging to this role was used to send a request to the user-deletion endpoint:

```http
POST /api/try-delete HTTP/1.1
Host: [redacted]
Connection: close
Content-Type: application/json
Accept: application/json, text/plain, */*
X-CSRFToken: <CSRF-token>
Cookie: <authenticated-session>
```

The request body contained the connection and user identifier required by the deletion function:

```json
{
  "connection": "NewDatabase",
  "id": "6"
}
```

The endpoint returned a successful response:

```text
HTTP/1.1 200 OK
```

The important security issue was not the successful HTTP response itself, but the fact that the request was accepted despite being initiated from a role that did not have permission to delete users.

## Result

After the request was processed, the corresponding user record was no longer present in the custom database.

This demonstrated that a role with restricted user-management permissions could directly invoke a backend function intended to delete users.

The same authorization weakness affected other Custom Database Action Script endpoints, allowing unauthorized roles to invoke additional user-management functionality.

## Parameters and Endpoint Functions

The affected endpoints supported different operations and parameters:

| Endpoint                   | Purpose               | JSON Parameters        |
| -------------------------- | --------------------- | ---------------------- |
| `/api/try-verify`          | Verify users          | `email`                |
| `/api/try-create`          | Create users          | `username`, `email`    |
| `/api/try-login`           | Attempt user login    | `username`, `password` |
| `/api/try-change_password` | Change user passwords | `email`, `newPassword` |
| `/api/try-get_user`        | Retrieve user details | `email`                |
| `/api/try-delete`          | Delete users          | `id`                   |

Because authorization was not properly enforced at the endpoint level, these functions could be invoked outside the intended permission model.

## Impact

The affected functionality introduced multiple security risks:

| Endpoint                   | Potential Impact                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `/api/try-verify`          | Unauthorized verification-state changes for users                                   |
| `/api/try-create`          | Unauthorized creation of new users                                                  |
| `/api/try-login`           | Unauthorized login attempts against custom-database accounts                        |
| `/api/try-change_password` | Unauthorized password changes for user accounts                                     |
| `/api/try-get_user`        | Unauthorized retrieval of user information                                          |
| `/api/try-delete`          | Unauthorized deletion of individual user accounts and potentially multiple accounts |

The combination of these capabilities could provide an unauthorized role with significant control over users stored within the custom database.

In particular, unauthorized password changes and user deletion could directly affect account availability and integrity, while unauthorized user retrieval could expose sensitive account information.

## Why This Matters

Role-based access control is only effective when authorization is enforced consistently across both the application interface and its underlying APIs.

Restricting an operation in the dashboard is not sufficient if the corresponding backend endpoint can still be called by a lower-privileged session.

This case demonstrates the importance of treating every API endpoint as an independent authorization boundary.

For sensitive operations such as:

* Creating users
* Deleting users
* Changing passwords
* Retrieving user information
* Modifying verification status

the backend should validate whether the authenticated identity has the specific permission required for the requested operation.

## Reported Result

The demonstrated scenario resulted in unauthorized read and write access to information stored in the custom database.

A role intended to provide limited user visibility was able to invoke backend functions capable of modifying and deleting user records.

This effectively bypassed the intended role-based permission model.

## Conclusion

This vulnerability demonstrates how **Broken Access Control** can arise when authorization controls are implemented at the application interface but are not consistently enforced at the API layer.

The affected Custom Database Action Script functionality exposed operations for verifying users, creating users, attempting logins, changing passwords, retrieving user information, and deleting users.

The demonstrated scenario showed that a **Viewer - Users** role could invoke a deletion function despite lacking the expected permission to perform that action.

The key lesson is straightforward:

> **Every sensitive API operation must enforce authorization independently of the permissions enforced by the user interface.**

Organizations implementing role-based access control should regularly test backend APIs for privilege escalation and verify that restricted roles cannot directly invoke administrative functionality.

## Source

This article is based on the reported vulnerability **"Executing Custom Database Scripts from un-authorized roles"**, classified as **Broken Access Control (BAC)**.

> **Disclosure Note:** The affected organization's name, product name, domains, tenant identifiers, URLs, infrastructure details, and other identifying information have been intentionally removed from this article. Endpoint paths are retained only where necessary to explain the technical nature of the vulnerability.


