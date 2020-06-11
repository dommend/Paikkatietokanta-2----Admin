# Paikkatietokanta (Admin)
React.js CRUD App with Vue Router & Axios

This project is unfinished and will be updated. 

## To get started
1. npm install
2. Change database settings from db.config. Can be found @ app/congig/db.config.js
3. Create a .env.local file and specify the following paths:
```
PORT=8080
REACT_APP_BASE_URL=https://paikkatietokanta.net
REACT_APP_ADMIN_BASE_URL=https://admin.paikkatietokanta.net
```

Note! The site uses Stadiamaps.com's map layer as maps. In order for the maps to be displayed online correctly, you must create an account.

3. Run node server.js or npm run-script dev - If a database does not exist it will be created. Server.js starts on the port http://localhost:8080
4. Run npm start - This will start Paikkatietokanta on the port http://localhost:8081

## About ports  
Node server.js runs @ 8080. 
Paikkatietokanta (npm start) runs @ 8081.
Any other port won't work if you don't change them from settings.

## Before running a build script
Before you run a build script change the REACT_APP_API_URL from .env.local. If you can't find the file, create one (See section 'To get started').
Also change the homepage address from package.json. If you run locally, you can use "./".

### To get the app run properly on the web
Add this htaccess snippet to the root.
This part makes sure the site is updated correctly if you refresh a page.

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule> 
```

#### And this to the /api folder
This will turn rewrites off. Otherwise Node server's api doesn't work.

```
RewriteEngine Off
```