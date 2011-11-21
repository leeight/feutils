#!/usr/bin/python

# $Id: rst2latex.py 97013 2011-11-16 03:35:47Z  $
# Author: David Goodger <goodger@python.org>
# Copyright: This module has been placed in the public domain.

"""
A minimal front end to the Docutils Publisher, producing LaTeX.
"""

try:
    import locale
    locale.setlocale(locale.LC_ALL, '')
except:
    pass

from docutils.core import publish_cmdline

description = ('Generates LaTeX documents from standalone reStructuredText '
               'sources. '
               'Reads from <source> (default is stdin) and writes to '
               '<destination> (default is stdout).  See '
               '<http://docutils.sourceforge.net/docs/user/latex.html> for '
               'the full reference.')

publish_cmdline(writer_name='latex', description=description)
