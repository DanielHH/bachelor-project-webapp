

# Overview
SecTrack is a web application for tracing information. This documentation describes how the system is built and what is required to continue the development. The system consists of three parts, a MariaDB database, a back-end server developed in NodeJS and a front-end web application developed in Angular. Both back-end and front-end are written in TypeScript. An overview of the system can be seen in figure 1.
![alt text](https://lh3.google.com/u/0/d/1D4kF6hNqWpzCb9xjS1wDb8OisWVYUl8c=w1920-h887-iv1 "Overview")

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










# PUMApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
 