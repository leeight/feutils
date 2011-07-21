"""Default URL reading functions"""
__all__ = ['_defaultFetcher']
__docformat__ = 'restructuredtext'
__version__ = '$Id: tokenize2.py 1547 2008-12-10 20:42:26Z cthedot $'

import cssutils
from cssutils import VERSION
import encutils
from . import errorhandler
import urllib.request, urllib.error, urllib.parse

log = errorhandler.ErrorHandler()

def _defaultFetcher(url):
    """Retrieve data from ``url``. cssutils default implementation of fetch
    URL function.

    Returns ``(encoding, string)`` or ``None``
    """
    request = urllib.request.Request(url)
    request.add_header('User-agent', 
                       'cssutils %s (http://www.cthedot.de/cssutils/)' % VERSION)
    try:        
        res = urllib.request.urlopen(request)
    except OSError as e:
        # e.g if file URL and not found
        log.warn(e, error=OSError)
    except (OSError, ValueError) as e:
        # invalid url, e.g. "1"
        log.warn('ValueError, %s' % e.args[0], error=ValueError)
    except urllib.error.HTTPError as e:
        # http error, e.g. 404, e can be raised
        log.warn('HTTPError opening url=%r: %s %s' % 
                          (url, e.code, e.msg), error=e)
    except urllib.error.URLError as e:
        # URLError like mailto: or other IO errors, e can be raised
        log.warn('URLError, %s' % e.reason, error=e)
    else:
        if res:
            mimeType, encoding = encutils.getHTTPInfo(res)
            if mimeType != 'text/css':
                log.error('Expected "text/css" mime type for url=%r but found: %r' % 
                                  (url, mimeType), error=ValueError)
            return encoding, res.read()
