install:
	npm ci

lint:
	npx eslint .

f-lint:
	npx eslint --fix .

develop:
	npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack