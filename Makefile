.PHONY: install build test fitness up down logs

install:
	npm install

build:
	npm run build

test:
	npm test

fitness:
	npm run test:fitness

up:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f
