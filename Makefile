
all: up

up :
	docker-compose  up

ssl:
	bash backend/generate_ssl.sh

build:
	docker-compose  up --build

stop:
	docker-compose  stop

down:
	docker-compose  down

start:
	docker-compose  start

ps:
	docker ps

push:
	git add .; \
	git commit -m "$(msg)"; \
    git push

fclean: stop down
	@rm -rf  redis
	@rm -rf backend/*/__pycache__
	@rm -rf backend/*/migrations
	@rm -rf backend/*/*/__pycache__
	@rm -rf backend/*/*/migrations
	@rm -rf backend/authentication/qrcodes/*
	@rm -rf  frontend/.next
	@rm -rf  frontend/node_modules
	@rm -rf  frontend/package-lock.json
	@rm -rf  backend/ssl
	@docker system prune -a -f
	@docker builder prune -a -f
	@docker volume prune -f
	@docker network prune -f

cleandb:
	@rm -rf  database
	@rm -rf  redis

re: fclean all