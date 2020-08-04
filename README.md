###### **Express + Microservices + MongoDB + GraphQL Boilerplate**

**To start API Gateway**
```
yarn dev
```

**To start a service**
```
yarn dev-service --service-name=<service-name>
```
Replace `<service-name>` with your microservice name

**To create a service**
```
yarn create-service --service-name=<service-name>
```
Replace `<service-name>` with your microservice name

**Note**
- Each service comes with an env file, named `<service-name>Service.env`
- To check if a service is working, properly, use GraphQL to check greeting query of each service.
- Let's have fun and write some "no-bug-contain" code :) 
