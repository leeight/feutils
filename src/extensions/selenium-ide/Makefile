VERSION=$(shell grep "em:version=" install.rdf | awk -F[=\"] '{print $$3}')
NAME=selenium-ide

all:
	@rm -rf ../$(NAME)-$(VERSION).xpi
	@zip -x Makefile -x "*.svn*" -r ../$(NAME)-$(VERSION).xpi .
