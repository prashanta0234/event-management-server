## Name

Simple Event management using nest, redis, Bullmq, postgres

## Description

This is simple event management app, with redis, job queue and corn job. I used redis for cache rendom accessed data and job queue for hadle:

- Emails
  And nest/schedule for reminder users.

## Features

- Attendee Login
- Attende Registration
- Admin login
- Create event
- Registration in event
- Get event by id
- Get Attendees
- Get attendees by id
- Account activation email
- After user registration in a event send thank you email
- After creation an event send email to all activate attendees
- Send reminder mail in every day 1 Am

## Project setup

TO run this application you need to install docker and docker compose in your system.

```bash
$ npm install
```

## Compile and run the project

```bash
#Run Docker:
$ docker compose up
```

If you use Ubuntu/Mac use sudo before docker

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

```bash
#add admin by running script

$ npm run admingenerate
```

## Access api docs in

```bash
$ http://localhost:5000/api
```

## To watch database

```bash
#visit
$ http:localhost:8080
```
