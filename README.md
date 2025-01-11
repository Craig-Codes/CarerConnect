# Carer Connect

This full-stack application is an MVP, allowing carers to connect and communicate asynchronously, seek out useful resources, and help their mental health.

We have a React frontend (vite), with theming, Material UI, and page routing setup
A Nodejs / express backend, with typescript and Nodemon setup
A PostgreSQL database with seed data

All setup in Docker containers, using the docker-compose file, and a make file for commands.

Need to create a .env file at project root level which is used by the backend and database containers for configuration, adding in these:

POSTGRES_HOST=database
POSTGRES_PASSWORD=password123
POSTGRES_USER=postgres
POSTGRES_DB=carer-db
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=root
DATABASE_URL=postgres://postgres:password123@database:5432/carer-db
JWT_PRIVATE_KEY=SUPERSECRETKEY

Need to create a .env file in the frontend, used to easily change API URL, adding in these:

VITE_API_URL=http://localhost:3000/api/

# To run

make build
make up
make run-migration

This gives us our containers, and database data

localhost:3000 - api
5050 - pgadmin
8080 - Frontend

## SQL Query

SELECT \*
FROM public."customer"
INNER JOIN grade ON public."customer".grade=grade.id;
