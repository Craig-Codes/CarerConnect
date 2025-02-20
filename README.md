# Carer Connect

MVP full stack web application, allowing carers to connect and communicate with like minded people who understand their situation. Featuring an interactive forum and the ability to create and join meetup events both online and in person - aiming to build a thrieving community. The UI is kept minimal and simple to use, ensuring accessibility for a wide demographic of age ranges and computer literacy.

![Homepage-image](/documentation/screenshot-homepage.png)

## Technologies

### Frontend:

The frontend uses React (vite) in conjunction with TypeScript, to build a modern and scalable UI. To ensure a clean look and feel, Material UI was chosen as the component library, with a custom theme added to give the application its own unique style. This approach leaverages well tested and documented technologies, allowing for further features to be easily added once the application is in the hands of users. These modern technologies also ensure new developers can be quickly onboarded into a familiar code base.

### Backend:

The backend employs node.js, using the Express.js framework in conjunction with TypeScript. This light weight approach keeps things simple, allowing features to be added rapidly so that they can be placed into the hands of the users sooner. Using a single language across the tech stack allows for developers to easily work across the full application with little on boarding time.

### Database:

A PostgreSQL database is used, with migrations controlled through scripts allowing the schema to be easily extended as new features are required. the iamge below shows the current database schema, enabling authentication and authorisation, the meetup events feature, and a forum comprising of categories, threads, and posts.

![Schema-image](/documentation/db_schema.png)

### Infrastructure:

In MVP stage, the application is available through docker containers, run locally. This would allow for an easy migration to any cloud provider. For example, the current containers can be hosted in an AWS Virtual Private Cloud, using the Elastic Container Service to dynamically provision containers to automatically scale for demand. The image below shows the current infrastructure:

![Schema-image](/documentation/infrastructure.png)

## Running the App / Starting up the project

1. Environmental variables need to be added to the project to enable database connection and security features. Using a .env file which is gitignored, allows for these variables to remain a secret when the application is in production. At local development MVP stage, these will be shared:

.env at route level:

```
POSTGRES_HOST=database
POSTGRES_PASSWORD=password123
POSTGRES_USER=postgres
POSTGRES_DB=carer-db
POSTGRES_PORT=5432
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=root
DATABASE_URL=postgres://postgres:password123@database:5432/carer-db
JWT_PRIVATE_KEY=SUPERSECRETKEY
```

.env in CarerConnect_frontend root:

```
VITE_API_URL=http://localhost:3000/api/
```

2. The docker containers need to be spun up to start the project. Ensure docker is installed on your device, and is running (docker desktop is recommended for an easy to use UI). A Makefile has been used to make starting the project easier for onboarding developers. At root level:

```
make build
```

Once the containers have built:

```
make up
```

3. Now that the docker containers are up, we need to run the database migrations (which also include some basic seed data):

```
make run-migration
```

4. The frontend can be accessed through http://localhost:8080
   Either register for a new account, or use on of the seed data accounts. These accounts run from user1-user9, and all have the password set to 'password'. User1 is a regualar user, and user2 is an admin user.

```
username: user1@example.com
password: password
```

You can now login and test out the functionality.

## Testing

Tests can be run on either the frontend, backend, or both at once. The commands are available in the respective package.json files (e.g. npm run test, or npm run e2e). However, all tests can be run at once. However, to run all tests, make sure the containers are running, as end-to-end testing requires a live backend and database:

```
make test-all
```
