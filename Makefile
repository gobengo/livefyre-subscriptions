.PHONY: all build

all: build

build: node_modules

dist: build
	mkdir -p dist
	./node_modules/.bin/browserify index.js -s livefyre-subscriptions -o dist/livefyre-subscriptions.js

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

test: build
	npm test

watch: build
	mocha -w test/index.js

clean:
	rm -rf node_modules dist

package: dist

env=dev
deploy: dist
	./node_modules/.bin/lfcdn -e $(env)

