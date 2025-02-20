
include .env
export

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

clean:
	docker compose down --volumes && docker compose up --build


rebuild: build up 

remove-volume: docker compose down -v  

exec-frontend:
	docker exec -it frontend /bin/sh

exec-backend:
	docker exec -it backend /bin/sh

exec-database:
	docker exec -it database /bin/sh

backend-npm-install:
	docker exec backend npm install

run-migration: 
	docker exec -e POSTGRES_HOST=database carer_connect_backend npm run migrate up

test-all:
	./scripts/runTests.sh



