

# Overview
SecTrack is a web application for tracing information. This documentation describes how the system is built and what is required to continue the development. The system consists of three parts, a MariaDB database, a back-end server developed in NodeJS and a front-end web application developed in Angular. Both back-end and front-end are written in TypeScript. An overview of the system can be seen in figure 1.
Figure 1 : ![alt text](https://lh3.google.com/u/0/d/1D4kF6hNqWpzCb9xjS1wDb8OisWVYUl8c=w1920-h887-iv1 "Overview")

# Purpose of the system
SecTrack can be used by companies to track assets by storing entries in a database that contain information about them such as where they are stored, who is responsible for safeguarding them and when they need to be returned. Almost every event in the application is logged, the logs are used to show the history of each asset.

# Building the Project
To build the front-end project you need to have angular-cli installed. The command to build the front-end project is “ng build” and when it has finished building (this can take quite some time) you can find the web application in the new folder named “dist”, here you can find the whole application and you can then move it to a web server.

To run the back-end server you either need to run it directly using a package manager that can handle typescript files. PM2 works great for this purpose but ts-node can also be used. If you want to build the project into javascript files you can stand in the source folder and use the command “tsc”.

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


