# Security Policy

## Supported Projects

This policy applies to:

- `FCEMP`
- `LF`
- `CONCREFORT`

## Reporting a Vulnerability

Report suspected vulnerabilities privately to the repository owner. Include:

- affected repository;
- affected URL or file;
- reproduction steps;
- impact;
- suggested fix, if known.

Do not publish exploit details before the issue is fixed.

## Testing Rules

Allowed without extra approval:

- local static analysis;
- dependency audits;
- browser testing against local development servers;
- non-destructive form validation tests;
- checks for missing headers in preview or staging.

Not allowed without explicit approval:

- brute force;
- denial of service;
- testing against third-party systems;
- accessing real user data;
- destructive payloads;
- automated scans against production domains.
