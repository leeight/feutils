"""Testcases for cssutils.css.CSSPageRule"""
__version__ = '$Id$'

import xml.dom
from . import test_cssrule
import cssutils

class CSSPageRuleTestCase(test_cssrule.CSSRuleTestCase):

    def setUp(self):
        super(CSSPageRuleTestCase, self).setUp()
        self.r = cssutils.css.CSSPageRule()
        self.rRO = cssutils.css.CSSPageRule(readonly=True)
        self.r_type = cssutils.css.CSSPageRule.PAGE_RULE#
        self.r_typeString = 'PAGE_RULE'

    def test_init(self):
        "CSSPageRule.__init__()"
        super(CSSPageRuleTestCase, self).test_init()

        r = cssutils.css.CSSPageRule()
        self.assertEqual('', r.selectorText)
        self.assertEqual(cssutils.css.CSSStyleDeclaration, type(r.style))
        self.assertEqual(r, r.style.parentRule)

        # until any properties
        self.assertEqual('', r.cssText)

        # only possible to set @... similar name
        self.assertRaises(xml.dom.InvalidModificationErr, self.r._setAtkeyword, 'x')

        def checkrefs(ff):
            self.assertEqual(ff, ff.style.parentRule)
            for p in ff.style:
                self.assertEqual(ff.style, p.parent)
                
        checkrefs(cssutils.css.CSSPageRule(
                    style=cssutils.css.CSSStyleDeclaration('font-family: x')))
        
        r = cssutils.css.CSSPageRule()
        r.cssText = '@page { font-family: x }'
        checkrefs(r)
        
        r = cssutils.css.CSSPageRule()
        r.style.setProperty('font-family', 'y')
        checkrefs(r)

        r = cssutils.css.CSSPageRule()
        r.style['font-family'] = 'z'
        checkrefs(r)

        r = cssutils.css.CSSPageRule()
        r.style.fontFamily = 'a'
        checkrefs(r)

    def test_InvalidModificationErr(self):
        "CSSPageRule.cssText InvalidModificationErr"
        self._test_InvalidModificationErr('@page')
        tests = {
            '@pag {}': xml.dom.InvalidModificationErr,
            }
        self.do_raise_r(tests)

    def test_incomplete(self):
        "CSSPageRule (incomplete)"
        tests = {
            '@page :left { ':
                '', # no } and no content
            '@page :left { color: red':
                '@page :left {\n    color: red\n    }', # no }
        }
        self.do_equal_p(tests) # parse

    def test_cssText(self):
        "CSSPageRule.cssText"
        EXP = '@page %s {\n    margin: 0\n    }'
        tests = {
            '@page {}': '',
            '@page:left{}': '',
            '@page :right {}': '',
            '@page {margin:0;}': '@page {\n    margin: 0\n    }',

            '@page name { margin: 0 }': EXP % 'name',
            '@page name:left { margin: 0 }': EXP % 'name:left',
            '@page name:right { margin: 0 }': EXP % 'name:right',
            '@page name:first { margin: 0 }': EXP % 'name:first',
            '@page :left { margin: 0 }': EXP % ':left',
            '@page :right { margin: 0 }': EXP % ':right',
            '@page :first { margin: 0 }': EXP % ':first',
            '@page :UNKNOWNIDENT { margin: 0 }': EXP % ':UNKNOWNIDENT',

            '@PAGE:left{margin:0;}': '@page :left {\n    margin: 0\n    }',
            '@\\page:left{margin:0;}': '@page :left {\n    margin: 0\n    }',

            # comments
            '@page/*1*//*2*/:left/*3*//*4*/{margin:0;}':
                '@page /*1*/ /*2*/ :left /*3*/ /*4*/ {\n    margin: 0\n    }',
            # WS
            '@page:left{margin:0;}':
                '@page :left {\n    margin: 0\n    }',
            '@page\n\r\f\t :left\n\r\f\t {margin:0;}':
                '@page :left {\n    margin: 0\n    }',
            }
        self.do_equal_r(tests)
        self.do_equal_p(tests)

        tests = {
            '@page : {}': xml.dom.SyntaxErr,
            '@page :/*1*/left {}': xml.dom.SyntaxErr,
            '@page : left {}': xml.dom.SyntaxErr,
            '@page :left :right {}': xml.dom.SyntaxErr,
            '@page :left a {}': xml.dom.SyntaxErr,
            # no S between IDENT and PSEUDO
            '@page a :left  {}': xml.dom.SyntaxErr,

            '@page :left;': xml.dom.SyntaxErr,
            '@page :left }': xml.dom.SyntaxErr,
            }
        self.do_raise_p(tests) # parse
        tests.update({
            # false selector
            '@page :right :left {}': xml.dom.SyntaxErr, # no }
            '@page :right X {}': xml.dom.SyntaxErr, # no }
            '@page X Y {}': xml.dom.SyntaxErr, # no }
            
            '@page :left {': xml.dom.SyntaxErr, # no }
            # trailing
            '@page :left {}1': xml.dom.SyntaxErr, # no }
            '@page :left {}/**/': xml.dom.SyntaxErr, # no }
            '@page :left {} ': xml.dom.SyntaxErr, # no }
            })
        self.do_raise_r(tests) # set cssText

    def test_cssText2(self):
        "CSSPageRule.cssText 2"
        r = cssutils.css.CSSPageRule()
        s = 'a:left'
        r.selectorText = s 
        self.assertEqual(r.selectorText, s)

        st = 'size: a4'
        r.style = st
        self.assertEqual(r.style.cssText, st)

        # invalid selector
        self.assertRaises(xml.dom.SyntaxErr, r._setStyle, '$')
        self.assertEqual(r.selectorText, s)
        self.assertEqual(r.style.cssText, st)

        self.assertRaises(xml.dom.SyntaxErr, r._setCssText, '@page $ { color: red }')
        self.assertEqual(r.selectorText, s)
        self.assertEqual(r.style.cssText, st)


        # invalid style
        self.assertRaises(xml.dom.SyntaxErr, r._setSelectorText, '$')
        self.assertEqual(r.selectorText, s)
        self.assertEqual(r.style.cssText, st)

        self.assertRaises(xml.dom.SyntaxErr, r._setCssText, '@page b:right { x }')
        self.assertEqual(r.selectorText, s)
        self.assertEqual(r.style.cssText, st)

    def test_selectorText(self):
        "CSSPageRule.selectorText"
        r = cssutils.css.CSSPageRule()
        r.selectorText = 'a:left'
        self.assertEqual(r.selectorText, 'a:left')
        
        tests = {
            '': '',
            'name': None,
            ':left': None,
            ':right': None,
            ':first': None,
            ':UNKNOWNIDENT': None,
            'name:left': None,
            ' :left': ':left',
            ':left': ':left',
            '/*1*/:left/*a*/': '/*1*/ :left /*a*/',
            '/*1*/ :left /*a*/ /*b*/': None,
            ':left/*a*/': ':left /*a*/',
            '/*1*/:left': '/*1*/ :left',
            }
        self.do_equal_r(tests, att='selectorText')

        tests = {
            ':': xml.dom.SyntaxErr,
            ':/*1*/left': xml.dom.SyntaxErr,
            ': left': xml.dom.SyntaxErr,
            ':left :right': xml.dom.SyntaxErr,
            ':left a': xml.dom.SyntaxErr,
            'name :left': xml.dom.SyntaxErr,
            }
        self.do_raise_r(tests, att='_setSelectorText')

    def test_style(self):
        "CSSPageRule.style (and references)"
        r = cssutils.css.CSSPageRule()
        s1 = r.style
        self.assertEqual(r, s1.parentRule)
        self.assertEqual('', s1.cssText)
        
        # set rule.cssText
        r.cssText = '@page { font-family: x1 }'
        self.failIfEqual(r.style, s1)
        self.assertEqual(r, r.style.parentRule)
        self.assertEqual(r.cssText, '@page {\n    font-family: x1\n    }')
        self.assertEqual(r.style.cssText, 'font-family: x1')
        self.assertEqual(s1.cssText, '')
        s2 = r.style
        
        # set invalid rule.cssText
        try: 
            r.cssText = '@page { $ }'
        except xml.dom.SyntaxErr as e:
            pass
        self.assertEqual(r.style, s2)
        self.assertEqual(r, r.style.parentRule)
        self.assertEqual(r.cssText, '@page {\n    font-family: x1\n    }')
        self.assertEqual(r.style.cssText, 'font-family: x1')
        self.assertEqual(s2.cssText, 'font-family: x1')
        s3 = r.style

        # set rule.style.cssText
        r.style.cssText = 'font-family: x2'
        self.assertEqual(r.style, s3)
        self.assertEqual(r, r.style.parentRule)
        self.assertEqual(r.cssText, '@page {\n    font-family: x2\n    }')
        self.assertEqual(r.style.cssText, 'font-family: x2')

        # set new style object s2
        s2 = cssutils.css.CSSStyleDeclaration('font-family: y1')
        r.style = s2
        self.assertEqual(r.style, s2)
        self.assertEqual(r, s2.parentRule)
        self.assertEqual(r.cssText, '@page {\n    font-family: y1\n    }')
        self.assertEqual(s2.cssText, 'font-family: y1')
        self.assertEqual(r.style.cssText, 'font-family: y1')
        self.assertEqual(s3.cssText, 'font-family: x2') # old

        # set s2.cssText
        s2.cssText = 'font-family: y2'
        self.assertEqual(r.style, s2)
        self.assertEqual(r.cssText, '@page {\n    font-family: y2\n    }')
        self.assertEqual(r.style.cssText, 'font-family: y2')
        self.assertEqual(s3.cssText, 'font-family: x2') # old
        # set invalid s2.cssText
        try: 
            s2.cssText = '$'
        except xml.dom.SyntaxErr as e:
            pass
        self.assertEqual(r.style, s2)
        self.assertEqual(r.cssText, '@page {\n    font-family: y2\n    }')
        self.assertEqual(r.style.cssText, 'font-family: y2')
        self.assertEqual(s3.cssText, 'font-family: x2') # old

        # set r.style with text
        r.style = 'font-family: z'
        self.failIfEqual(r.style, s2)
        self.assertEqual(r.cssText, '@page {\n    font-family: z\n    }')
        self.assertEqual(r.style.cssText, 'font-family: z')

    def test_properties(self):
        "CSSPageRule.style properties"
        r = cssutils.css.CSSPageRule()
        r.style.cssText = '''
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin: 0;

        page-break-before: auto;
        page-break-after: auto;
        page-break-inside: auto;

        orphans: 3;
        widows: 3;
        '''
        exp = '''@page {
    margin-top: 0;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin: 0;
    page-break-before: auto;
    page-break-after: auto;
    page-break-inside: auto;
    orphans: 3;
    widows: 3
    }'''
        self.assertEqual(exp, r.cssText)

    def test_reprANDstr(self):
        "CSSPageRule.__repr__(), .__str__()"
        sel=':left'
        
        s = cssutils.css.CSSPageRule(selectorText=sel)
        
        self.assert_(sel in str(s))

        s2 = eval(repr(s))
        self.assert_(isinstance(s2, s.__class__))
        self.assert_(sel == s2.selectorText)


if __name__ == '__main__':
    import unittest
    unittest.main()
