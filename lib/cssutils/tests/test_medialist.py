# -*- coding: iso-8859-1 -*-
"""Testcases for cssutils.stylesheets.MediaList"""
__version__ = '$Id$'

import xml.dom
from . import basetest
import cssutils.stylesheets

class MediaListTestCase(basetest.BaseTestCase):

    def setUp(self):
        super(MediaListTestCase, self).setUp()
        self.r = cssutils.stylesheets.MediaList()

    def test_set(self):
        "MediaList.mediaText 1"
        ml = cssutils.stylesheets.MediaList()

        self.assertEqual(0, ml.length)
        self.assertEqual('all', ml.mediaText)

        ml.mediaText = ' print   , screen '
        self.assertEqual(2, ml.length)
        self.assertEqual('print, screen', ml.mediaText)
        
        self.assertRaisesMsg(xml.dom.InvalidModificationErr, 
                             basetest.msg3x('''MediaList: Ignoring new medium cssutils.stylesheets.MediaQuery(mediaText=u'tv') as already specified "all" (set ``mediaText`` instead).'''), 
                             ml._setMediaText, ' print , all  , tv ')
        
        self.assertEqual('all', ml.mediaText)
        self.assertEqual(1, ml.length)

        self.assertRaises(xml.dom.InvalidCharacterErr,
                          ml.appendMedium, 'test')

    def test_appendMedium(self):
        "MediaList.appendMedium() 1"
        ml = cssutils.stylesheets.MediaList()

        ml.appendMedium('print')
        self.assertEqual(1, ml.length)
        self.assertEqual('print', ml.mediaText)

        ml.appendMedium('screen')
        self.assertEqual(2, ml.length)
        self.assertEqual('print, screen', ml.mediaText)

        # automatic del and append!
        ml.appendMedium('print')
        self.assertEqual(2, ml.length)
        self.assertEqual('screen, print', ml.mediaText)

        # automatic del and append!
        ml.appendMedium('SCREEN')
        self.assertEqual(2, ml.length)
        self.assertEqual('print, SCREEN', ml.mediaText)

        # append invalid MediaQuery
        mq = cssutils.stylesheets.MediaQuery()
        ml.appendMedium(mq)
        self.assertEqual(2, ml.length)
        self.assertEqual('print, SCREEN', ml.mediaText)
        
        # append()
        mq = cssutils.stylesheets.MediaQuery('tv')
        ml.append(mq)
        self.assertEqual(3, ml.length)
        self.assertEqual('print, SCREEN, tv', ml.mediaText)

        # __setitem__
        self.assertRaises(IndexError, ml.__setitem__, 10, 'all')
        ml[0] = 'handheld'
        self.assertEqual(3, ml.length)
        self.assertEqual('handheld, SCREEN, tv', ml.mediaText)

    def test_appendAll(self):
        "MediaList.append() 2"
        ml = cssutils.stylesheets.MediaList()
        ml.appendMedium('print')
        ml.appendMedium('tv')
        self.assertEqual(2, ml.length)
        self.assertEqual('print, tv', ml.mediaText)

        ml.appendMedium('all')
        self.assertEqual(1, ml.length)
        self.assertEqual('all', ml.mediaText)

        self.assertRaisesMsg(xml.dom.InvalidModificationErr, 
                             basetest.msg3x('''MediaList: Ignoring new medium cssutils.stylesheets.MediaQuery(mediaText=u'tv') as already specified "all" (set ``mediaText`` instead).'''), 
                             ml.appendMedium, 'tv')
        self.assertEqual(1, ml.length)
        self.assertEqual('all', ml.mediaText)

        self.assertRaises(xml.dom.InvalidCharacterErr, ml.appendMedium, 'test')

    def test_append2All(self):
        "MediaList all"
        ml = cssutils.stylesheets.MediaList()
        ml.appendMedium('all')
        self.assertRaisesMsg(xml.dom.InvalidModificationErr, 
                             basetest.msg3x('''MediaList: Ignoring new medium cssutils.stylesheets.MediaQuery(mediaText=u'print') as already specified "all" (set ``mediaText`` instead).'''), 
                             ml.appendMedium, 'print')
        
        sheet = cssutils.parseString('@media all, print { /**/ }')
        self.assertEqual('@media all {\n    /**/\n    }'.encode(), sheet.cssText)

    def test_delete(self):
        "MediaList.deleteMedium()"
        ml = cssutils.stylesheets.MediaList()

        self.assertRaises(xml.dom.NotFoundErr, ml.deleteMedium, 'all')
        self.assertRaises(xml.dom.NotFoundErr, ml.deleteMedium, 'test')

        ml.appendMedium('print')
        ml.deleteMedium('print')
        ml.appendMedium('tV')
        ml.deleteMedium('Tv')
        self.assertEqual(0, ml.length)
        self.assertEqual('all', ml.mediaText)

    def test_item(self):
        "MediaList.item()"
        ml = cssutils.stylesheets.MediaList()
        ml.appendMedium('print')
        ml.appendMedium('screen')

        self.assertEqual('print', ml.item(0))
        self.assertEqual('screen', ml.item(1))
        self.assertEqual(None, ml.item(2))

    def test_handheld(self):
        "MediaList handheld"
        ml = cssutils.stylesheets.MediaList()

        ml.mediaText = ' handheld , all  '
        self.assertEqual(2, ml.length)
        self.assertEqual('all, handheld', ml.mediaText)
        
        self.assertRaisesMsg(xml.dom.InvalidModificationErr, 
                             basetest.msg3x('''MediaList: Ignoring new medium cssutils.stylesheets.MediaQuery(mediaText=u'tv') as already specified "all" (set ``mediaText`` instead).'''), 
                             ml._setMediaText, ' handheld , all  , tv ')
        
    def test_mediaText(self):
        "MediaList.mediaText 2"
        tests = {
            '': 'all',
            'ALL': 'ALL',
            'Tv': 'Tv',
            'all': None,
            'all, handheld': None,
            'tv': None,
            'tv, handheld, print': None,
            'tv and (color), handheld and (width: 1px) and (color)': None,
            }
        self.do_equal_r(tests, att='mediaText')

        tests = {
            'UNKNOWN': xml.dom.InvalidCharacterErr,
            'a,b': xml.dom.InvalidCharacterErr,
            'a and (color)': xml.dom.InvalidCharacterErr,
            'not': xml.dom.SyntaxErr, # known but need media
            'only': xml.dom.SyntaxErr, # known but need media
            'not tv,': xml.dom.SyntaxErr, # known but need media
            'all;': xml.dom.SyntaxErr,
            'all, and(color)': xml.dom.SyntaxErr,
            'all,': xml.dom.SyntaxErr,
            'all, ': xml.dom.SyntaxErr,
            'all ,': xml.dom.SyntaxErr,
            'all, /*1*/': xml.dom.SyntaxErr,
            'all and (color),': xml.dom.SyntaxErr,
            'all tv, print': xml.dom.SyntaxErr,
            }
        self.do_raise_r(tests, att='_setMediaText')

    def test_comments(self):
        "MediaList.mediaText comments"
        tests = {
            '/*1*/ tv /*2*/, /*3*/ handheld /*4*/, print': None,
            }
        self.do_equal_r(tests, att='mediaText')

    def test_reprANDstr(self):
        "MediaList.__repr__(), .__str__()"
        mediaText='tv, print'

        s = cssutils.stylesheets.MediaList(mediaText=mediaText)

        self.assert_(mediaText in str(s))

        s2 = eval(repr(s))
        self.assert_(isinstance(s2, s.__class__))
        self.assert_(mediaText == s2.mediaText)


if __name__ == '__main__':
    import unittest
    unittest.main()
