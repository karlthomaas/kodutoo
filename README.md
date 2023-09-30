
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

1. Git clone the project: `git clone https://github.com/karlthomaas/kodutoo.git`
2. Open two terminals and navigate into project `cd kodutoo`
3. **Terminal 1**: Navigate into API folder using: `cd api`
4. **Terminal 1**: Install dependencies by using: `npm install` 
5. **Terminal 1**: Start the API using `./node.js`

6. **Terminal 2**: Navigate into my-app folder using: `cd my-api`
7. **Terminal 2**: Install dependencies by using: `npm install` 
8. **Terminal 2**: Start the website by using: `npm start`

React should open a new page `http://locahost:3000`

If it doesn't open automatically, open `http://locahost:3000` in browser.


## What would I do differently?
I would JSON like Database for this project (example: MongoDB), it would've make getting & inserting Sectors much more easier. 