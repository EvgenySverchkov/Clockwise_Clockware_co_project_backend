# Clockwise_Clockware_co_project_backend

## Instructions for running locally


Clone a project from the directory:  

https://github.com/EvgenySverchkov/Clockwise_Clockware_co_project_backend.<br>

Open the folder with the cloned project and in the cmd run:

```npm install```

In the cmd run:

```npm start```

Server run on:

```http://localhost:9000/```

## LOCAL DB

Create local DB (the database name must be 'local_db')

Сreating tables:
 - run migration files (in the project folder):

```sequelize db:migrate```

Filling tables with test data:
 - run seeders files (in the project folder):

```sequelize db:seed:all```

### `Credentials`

Server uses for local DB:
```
    hostName: 127.0.0.1
    dbName: local_db
    login: root
    password: root
```
You can update this data in https://github.com/EvgenySverchkov/Clockwise_Clockware_co_project_backend/blob/master/config/sequelizeConfig.js