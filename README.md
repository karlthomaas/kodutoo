
# Kodutöö

A website where users can enter their name, select suitable sectors from multiple options, agree TOS and Submit.

All form inputs must be filled out for submission. After clicking Submit, the website saves the user's selected sector and sends them to the API.

The API generates a JSON Web Token based on the UserAgent and UUIDv4 and returns it to the user as a cookie. Allowing user to change their sectors or username later.


## Frontend

For this project frontend, I chose React, because It's really user friendly, flexible and fast. It also has a component-based structure, that allows to maintain code more easily. It also has awesome libraries and builtin Hooks that make everyday programming more efficent and fun.

## Backend
I chose Express JS, because it's very lightweight and scalable. It's perferct backend for smaller type of projects. 

## Database
For Database I used Sqlite3, because it's simple to use, powerful and very lightweight. 


## How to run it?

1. Install Docker on your Operating System
2. Git clone the project: `git clone https://github.com/karlthomaas/kodutoo.git`
3. Navigate into api folder `cd kodutoo/api`
4. Paste `docker build . -t helmes/kodutoo-api`
5. Paste `docker run -p 4000:4000 -d helmes/kodutoo-api`
6. Navigate back to root folder `cd ..`
7. Navigate into my-app `cd my-app`
6. Paste `docker build . -t helmes/kodutoo-my-app`
7. Paste `docker run -p 3000:3000 -d helmes/kodutoo-api`

Open `http://locahost:3000` in browser.

**Doesn't work?**
Paste `docker ps` and check if all containers are running.


## What would I do differently?
1. I would JSON like Database for this project (example: MongoDB), it would've make getting & inserting Sectors much more easier.
2. Would update npm first, created the project accidentally in older npm version.

## Database schemas

**Table: categories**
| id : integer | category text | subcategory text | sector text | children integer | 

Explanation:
`children` - false or true (0 | 1 ) - boolean for subcategory -> sector existence. 

**Table: users**
| id: integer | user_id text | name text | sector text | 