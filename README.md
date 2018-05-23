# Overview
SecTrack is a web application for tracing information. This documentation describes how the system is built and what is required to continue the development. The system consists of three parts, a MariaDB database, a back-end server developed in NodeJS and a front-end web application developed in Angular. Both back-end and front-end are written in TypeScript. An overview of the system can be seen in figure 1.

Figure 1 : ![alt text](https://lh3.google.com/u/0/d/1D4kF6hNqWpzCb9xjS1wDb8OisWVYUl8c=w1920-h887-iv1 "Overview")

# Purpose of the system
SecTrack can be used by companies to track assets by storing entries in a database that contain information about them such as where they are stored, who is responsible for safeguarding them and when they need to be returned. Almost every event in the application is logged, the logs are used to show the history of each asset.

# Building the Project
To build the front-end project you need to have angular-cli installed. The command to build the front-end project is “ng build” and when it has finished building (this can take quite some time) you can find the web application in the new folder named “dist”, here you can find the whole application and you can then move it to a web server.

To run the back-end server you either need to run it directly using a package manager that can handle typescript files. PM2 works great for this purpose but ts-node can also be used. If you want to build the project into javascript files you need to use the command “tsc” in the source folder.

# Software requirements
The software needed to continue the development of the application is listed below. See front-end and back-end sections for instructions on how to install it.

Visual Studio Code (or equivalent) - https://code.visualstudio.com/

Npm - https://www.npmjs.com/

AngularCLI - https://cli.angular.io/

TypeScript - https://www.typescriptlang.org/

NodeJS - https://nodejs.org/en/

PM2, ts-node or another package manager that can run typescript-files - http://pm2.keymetrics.io/ or https://github.com/TypeStrong/ts-node

# Database structure
The database was created using MariaDB which means that it is an SQL-like solution. An overview of the large data objects in the database can be seen in Figure 2, which describes the objects that are mainly used by the program. All fields whose names ends on ID, except those who only have ID, have a foreign key to a table with the same name excluding ID. In Figure 3, the smaller data objects can be seen, this is where most of the foreign keys in the larger tables leads. Figure 4 shows an example of how these tables are connected.

Figure 2 : ![alt text](https://lh3.google.com/u/0/d/1SD-IZKHH_bfPE1mY0SNd93WTEuDMnPQf=w1387-h887-iv1 "Overview of the larger data objects")

Figure 3 : ![alt text](https://lh3.google.com/u/0/d/1jJfzDqQX9WS0aKvT5iEWCuwLp_X6s2e5=w1387-h887-iv1 "Overview of the smaller data objects")

Figure 4 : ![alt text](https://lh3.google.com/u/0/d/1k5gloJMu_WeWazRM8bfGNN_9-dxNNUWX=w1387-h887-iv1 "Example of how tables can be linked using foreign keys")

# Front-end

The project  files for the front-end can be found here:
https://gitlab.ida.liu.se/pum-ninjas/PUMApp


The front-end code is written in TypeScript using the Angular framework. The editor Visual Studio Code was used during the development which allowed for live compilation of the application. The components are structured per page in the application, so for example the page showing the cards table that can be seen in figure 5 consists of a card table component, a component for card items that can be stored in that table and a component that is used to modify those items. There are also more general components such as the modal component that is used as the base component for all modal components.

Download npm from https://www.npmjs.com/ or linux command `apt-get install npm`

Download NodeJS from https://nodejs.org/en/ or linux command `apt-get install nodejs`

Go to project folder

Type the following commands in the console

```
npm install -g typescript /* this will install typescript globally */
npm install -g @angular/cli /* this will install angular globally */
npm install -g tslint /* this will install tslint globally */
npm install /* this will install all required packages listed in package.json */
ng serve /* this will run the local dev server, optional ‘-o’ to open the browser automatically */
```

Figure 5 : ![alt text](https://lh3.google.com/u/0/d/1kUb3SdHvFmESNORxvrfZLB-AJlLMjnrj=w1387-h887-iv1 "Front-end")

# Back-end

The project  files for the back-end can be found here:
https://gitlab.ida.liu.se/pum-ninjas/PUMApi


The back-end code is written in TypeScript using the Express.js framework. The editor Visual Studio Code was used during the development which allowed for compilation of the application. The main file is the main.ts file which starts the express server. Server.ts configures the server settings and opens the connection to the SQL server. GET, POST and PUT requests can be found in the http-requests folder.  The sql-utilities folder contains the SQL helper functions and pdf-utilities contains the PDF generation functions. The PDF templates can be found in the pdf-templates folder. The datamodels can be found in the datamodels folder and the data transfer objects can be found in the DTO folder. The database configuration can be found in database-config.ts and the database queries can be found in database-queries.ts.

Download npm from https://www.npmjs.com/ or linux command `apt-get install npm`

Download NodeJS from https://nodejs.org/en/ or linux command `apt-get install nodejs`

Go to project folder

Type the following commands in the console

```
npm install -g typescript /* this will install typescript globally */
npm install -g ts-node /* this will install ts-node globally */
npm install /* this will install all required packages listed in package.json */
``` 

Before starting the server you need to create a file named “database-config.ts” in the project folder and fill it with the following code:

```
export const dbconfig = {
host: “ADDRESS TO DATABASE”,
username: "USERNAME",
password: "PASSWORD!",
db: "DATABASE NAME"
};
```

`ts-node main.ts /* this will run the main.ts file which will start the back-end server */`
