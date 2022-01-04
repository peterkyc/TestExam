<h1 align="center">Peter's Full Stack web site Demo</h1>

## `Demo URL`
- [Live demo](https://risingware.com:8878/test/)
- [Swagger API test](https://risingware.com:8878/swagger/)
- [Peter's CV](https://risingware.com:8896/PeterCV/index.html)

<br/>

## `Technologies and Packages：`
### `Backend`： Implementation using Nodejs and TypeScript

<h3>Packages：</h3>

### express
```
used for http/https API server
``` 
### express static
```
used for http/https to serve static files.
```
### mysql
```
used for Database SQL Server
```
### redis
```
used for data cached, and session cached
```
### swagger
```
used for APIs document and test
```
### nodemailer
```
used for send e-mail
```

### `Frontend`： Implementation using React and TypeScript

<h3>Packages：</h3>

- react
- redux
- react-admin
- material-ui
- webpack
- babel
- ...

```
used for build frontend UI single-page application SPA framework/library
```
### Google Login  
```
used for google login
```
### Facebook Login  
```
used for facebook login
```
<br/>

## Folder Structure
> The Demo Source Folder structure as following

    .
    ├── build       # Compiled files
    ├── config      # webpack configure and run scripts (I have modified the programs in this directory according to needs)
    ├── scripts     # webpack start/build/test scripts (I have modified the programs in this directory according to needs)
    ├── docs        # template test files
    ├── public      # publuc html files
    ├── common      # Source files for client (Web) and server
    ├── server      # Source files for server
    ├── src         # Source files for client (Web) 
    └── README.md

## `Known Issues`
```
This demo uses React-admin examples as the basis.

From scratch, it has added Express to the back end to provide API calls, and functions, 
such as MySQL, Redis, Swagger and Nodemailer.

According to the requirements, all functions of the front end have been rewritten. 
So has Webpack (under folder scripts/config). And Webpack dev was used to set up the server 
in the development phase.

All functions take approximately 2 working weeks. Its functions are for testing only, 
and requirements for other professional enterprise functions aren't included.
```


