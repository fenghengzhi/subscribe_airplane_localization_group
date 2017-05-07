#qpy:webapp:Hello Qpython
#qpy://127.0.0.1:8080/
"""
This is a sample for qpython webapp
"""

from bottle import Bottle, ServerAdapter
from bottle import run, debug, route, error, static_file, template, request
import urllib2
import os
os.chdir(os.path.dirname(__file__))
######### QPYTHON WEB SERVER ###############

class MyWSGIRefServer(ServerAdapter):
    server = None

    def run(self, handler):
        from wsgiref.simple_server import make_server, WSGIRequestHandler
        if self.quiet:
            class QuietHandler(WSGIRequestHandler):
                def log_request(*args, **kw): pass
            self.options['handler_class'] = QuietHandler
        self.server = make_server(self.host, self.port, handler, **self.options)
        self.server.serve_forever()

    def stop(self):
        #sys.stderr.close()
        import threading 
        threading.Thread(target=self.server.shutdown).start() 
        #self.server.shutdown()
        self.server.server_close() #<--- alternative but causes bad fd exception
        print "# qpyhttpd stop"


######### BUILT-IN ROUTERS ###############
@route('/__exit', method=['GET','HEAD'])
def __exit():
    global server
    server.stop()

@route('/__ping')
def __ping():
    return "ok"


@route('/manga/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./manga/')

@route('/proxy')
def proxy():
    url = request.query.url
    response = urllib2.urlopen(url) 
    return response.read()

@route('/proxy1/<url:path>')
def proxy1(url):
    response = urllib2.urlopen('http://'+url)
    result=response.read()
    # result.replace('href="/','href="/proxy1/')#+(url.split('/'))[0]+'/')
    result.replace('div','test')
    return result


######### WEBAPP ROUTERS ###############
@route('/')
def home():
    return '<html><body><script>milib.openUrl("http://127.0.0.1:8080/manga/manga.html")</script></body></html>'


######### WEBAPP ROUTERS ###############
app = Bottle()
app.route('/', method='GET')(home)
app.route('/__exit', method=['GET','HEAD'])(__exit)
app.route('/__ping', method=['GET','HEAD'])(__ping)
app.route('/manga/<filepath:path>', method='GET')(server_static)
app.route('/proxy', method='GET')(proxy)
app.route('/proxy1/<url:path>', method='GET')(proxy1)


import webbrowser


try:
    server = MyWSGIRefServer(host="0.0.0.0", port="8080")
    webbrowser.open_new('http://127.0.0.1:8080/manga/manga.html')
    app.run(server=server,reloader=False)
except Exception,ex:
    print "Exception: %s" % repr(ex)

