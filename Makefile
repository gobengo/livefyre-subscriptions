.PHONY: all build

all: build

build: node_modules

dist: dist/livefyre-subscriptions.js dist/livefyre-subscriptions.min.js

# dev JS
dist/livefyre-subscriptions.js: build
	mkdir -p dist
	cat config/wrap-start.frag > dist/livefyre-subscriptions.js
	./node_modules/.bin/browserify index.js -r ./index.js:livefyre-subscriptions >> dist/livefyre-subscriptions.js
	cat config/wrap-end.frag >> dist/livefyre-subscriptions.js  

# uglified JS
dist/livefyre-subscriptions.min.js: dist/livefyre-subscriptions.js
	cat dist/livefyre-subscriptions.js | ./node_modules/.bin/uglifyjs > dist/livefyre-subscriptions.min.js

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

