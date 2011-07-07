VERSION=1.0.12
NAME=selenium-ide-packed

all:
	make -C python-format
	make -C selenium-ide
	@zip -r $(NAME)-$(VERSION).xpi install.rdf *.xpi
	@mv *.xpi ../../tools/lib
