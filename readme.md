# Installation

Requirements:

1. Nodejs(>v18.20.0)
2. PostgreSQL(v14.6)

#### Steps to run the backend server:

1. Create the database in postgresql and define env variables in root directory

```bash
DB_USERNAME="Database username"
DB_PASSWORD="Database username"
DB_DATABASE="Database name"
DB_HOST="Database host"
DB_PORT="Database port"
```

2. Also, define following variables for following,
```bash
PORT="Server port such as 8000"
JWT_SECRET="JWT Secret key"
MAILER_EMAIL="Email for nodemailer"
MAILER_PASS="Email password for nodemailer"
DOMAIN="Frontend domain such as, http://localhost:3000"
```

2. Run the migrations,

```bash
npx sequelize db:migrate
```

3. Run the server,

```bash
npm start
```

Now the api server is running on [http://localhost:8000](http://localhost:8000).
