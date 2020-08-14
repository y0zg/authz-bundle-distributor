export COMPOSE_JWT_PUBLIC_KEY=$(shell aws --region eu-west-1 ssm get-parameter --name /NGSS/global/COMPOSE_JWT_PUBLIC_KEY --output text --query 'Parameter.Value' --with-decryption)
export LOG_FORMAT_MORGAN=$(shell aws --region eu-west-1 ssm get-parameter --name /NGSS/global/LOG_FORMAT_MORGAN --output text --query 'Parameter.Value' --with-decryption)
export NPM_TOKEN=$(shell aws --region eu-west-1 ssm get-parameter --name /NGSS/global/NPM_TOKEN --output text --query 'Parameter.Value' --with-decryption)
export CI_SERVICE_JWT=$(shell aws --region eu-west-1 ssm get-parameter --name /NGSS/global/CI_SERVICE_JWT --output text --query 'Parameter.Value' --with-decryption)


up: clean registry_login
	docker-compose pull --ignore-pull-failures
	docker-compose up --build

clean:
	docker-compose kill && \
	docker-compose rm --force && \
	docker volume rm `docker volume ls -f dangling=true -q` || true

build: clean
	docker-compose build

stop:
	docker-compose stop

start: registry_login
	docker-compose up -d

bash:
	docker-compose exec authz-bundle-distributor /entrypoint.sh bash

test:
	mkdir --parents --mode=777 ./reports
	docker-compose run -T --entrypoint sh authz-bundle-distributor -c 'yarn install --production=false; yarn test'

lint:
	docker-compose run --no-deps -T --entrypoint sh authz-bundle-distributor -c 'yarn install --production=false; yarn lint'

registry_login:
	aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 817276302724.dkr.ecr.eu-west-1.amazonaws.com
