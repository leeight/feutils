all: lint pack
	@echo "all done"

lint:
	@echo "google closure linter"
	@externs/sdcfe/tools/bin/Flint --type js --engine gcl --options '--custom_jsdoc_tags=version,description -r' --in src

quick-fixjs:
	@echo "quick-fixjs"
	@ svn st | grep -v "^?" | awk '{print $2}' | xargs -i fixjsstyle {}

fixjs:
	@externs/sdcfe/tools/bin/Flint --type js --engine gcl-fix --options '--custom_jsdoc_tags=version,description -r' --in src

pack:
	@echo "begin pack"
	sh build.sh

pre-compile:
	@echo "pre compile check"
	python gcc_lint.py 2>build.log
	python gcc_lint.py assets/js/clientdn.js 2>>build.log

plovr:
	@# find test -type f -name "module_*.js" -exec rm {} \;
	@#grep -r "^ui.[^.]* = function" src/ui/ | awk -F"[ :]" '{print $2}' | while read ns; do NAME=`echo ${ns} | cut -d . -f 2`; echo "goog.exportSymbol(\"${NAME}\", ${ns}, ui);"; done
	java -jar externs/sdcfe/tools/lib/plovr.jar build plovr-config.js 

stat:
	@find src -name "*.js" -o -name "*.css" | xargs wc -l | sort -k 1 -n -r

deps:
	@python externs/sdcfe/tools/lib/calcdeps.py -o deps -p src -p externs/sdcfe/src/main/app --output_file=src/deps.js

docs:
	@echo "jsdoc-toolkit"
	java -jar externs/sdcfe/tools/lib/jsdoc-toolkit/jsrun.jar \
		externs/sdcfe/tools/lib/jsdoc-toolkit/app/run.js \
		-E="er.packed.js" \
		-a \
		-p \
		-r=10 \
		-t=externs/sdcfe/tools/lib/jsdoc-toolkit/templates/gcldoc \
		-d=../output/jsdoc \
		src/er

update-gcc:
	@cp ~/dev/closure-compiler/build/compiler.jar externs/sdcfe/tools/lib/google-closure-compiler.jar 
	@cp ~/dev/closure-compiler/build/externs.zip externs/sdcfe/tools/lib/externs.zip 
	@echo "Done."

