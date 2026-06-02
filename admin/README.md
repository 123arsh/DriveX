# DriveX Admin Panel

This is the separate admin application for DriveX.

## Purpose
- Manage vehicles, users, bookings, payments, and verifications
- Approve or reject user identity documents
- Review booking and payment audit logs
- Operate independently of the customer-facing frontend

## Structure
- `src/` contains the admin UI, protected admin routes, and dashboard components
- Admin APIs are served from the `backend/` application under `/secure-admin-panel/api`
