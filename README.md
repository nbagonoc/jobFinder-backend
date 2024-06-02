## JobFinder Backend(NODE)

The back-end for JobFinder. Front-end can be found here(https://github.com/nbagonoc/jobFinder-frontend).

## Screenshots:
Just a screenshot of the backend REST API via postman

<img width="1917" alt="jobFinderBackend" src="https://github.com/nbagonoc/jobFinder-backend/assets/30286941/2a113cc4-cfca-4009-b714-e9bccedb4bac">

## Diagrams

### Component Diagram:
![JobFinder Component Diagram - Page 1](https://github.com/nbagonoc/jobFinder-frontend/assets/30286941/36ee205e-3571-476e-9076-339e3fd4109b)

### Use Case Diagram:
![JobFinderUseCase](https://github.com/nbagonoc/jobFinder-frontend/assets/30286941/e2a6a38e-2eb3-449c-b4bd-1d83d43fdf1b)

### Sequence Diagram:
![jobFInderSequence](https://github.com/nbagonoc/jobFinder-backend/assets/30286941/85c5391c-5d8d-418c-b05d-ebd1d009cfe4)

## Features:
- Applicant
    - Manage applicant profile
        - Create / Update about
        - Create / Update / delete education
        - Create / Update / delete experience
        - Create / Update / delete skills
    - View job postings
    - Apply job posting
    - View job applications and status
- Recruiter
    - Manage recruiter profile
        - Create / Update about
    - Manage job posting
        - View job postings
        - Post job
        - Update job
        - Delete job
        - Close job
    - Manage job applicants
        - View job applicants
        - View applicant profile
        - Deny applicant
        - Whitelist applicant
        - Approve applicant
- General
    - Sign-up
    - Sign-in

## How to run locally:
- Setup .env file (follow env.example file)

- Download dependencies:
```
npm install
```

- Serve by running:
```
npm run dev
```

## Backend Backlog:
- Create factory and seeder

TODO: Add screenshots to diagrams