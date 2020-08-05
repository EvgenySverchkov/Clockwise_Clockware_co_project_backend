# Clockwise_Clockware_co_project_backend

## Instructions for running locally


### `1` 

Clone a project from the directory https://github.com/EvgenySverchkov/Clockwise_Clockware_co_project_backend.<br>

### `2`

Open the folder with the cloned project and in the cmd run `npm install`

### `3`

In the cmd run  `npm start`

### `4`

Server run on `http://localhost:9000/`

## LOCAL DB

### '1'

Create local connection

### '2'

Create local DB

### '3'

Export DB from remote server (creating dump file)

```mysqldump -h us-cdbr-east-05.cleardb.net -u b9d382caa58e34 -p429f0925 heroku_c647561c828c05a > C:\Users\С\Documents\remoteDBDump.sql```

### '4'

Import dump file to local DB

```mysql -h 127.0.0.1 -u root -p local_db < C:\Users\С\Documents\remoteDBDump.sql```

### 'Credentials'

Server uses for local DB:
```
    hostName: 127.0.0.1
    dbName: local_db
    login: root
    password: root
```
You can update this data in https://github.com/EvgenySverchkov/Clockwise_Clockware_co_project_backend/blob/master/config/sequelizeConfig.js