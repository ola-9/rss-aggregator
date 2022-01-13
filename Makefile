install:
	npm ci

lint:
	npx eslint .

f-lint:
	npx eslint --fix .

start:
	npx webpack serve --open

develop:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack