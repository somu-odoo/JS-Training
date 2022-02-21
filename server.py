from werkzeug.routing import Map, Rule, NotFound, RequestRedirect, Subdomain
from werkzeug.wrappers import Request, Response
from werkzeug.wsgi import responder
from werkzeug.serving import run_simple
from werkzeug.middleware.shared_data import SharedDataMiddleware

import os
import requests

def landingPage(request):
    html = open('index.html','r').read()
    return Response(html, mimetype='text/html')

def load_data(request):
    ans = request.args.get("prod", "1")
    r = requests.get("https://fakestoreapi.com/products/" + ans)
    desc = r.json()['description']
    return Response(desc)

url_map = Map([
    Rule('/', endpoint='index'),
    Rule('/product', endpoint='infopage')
])

views = {'index': landingPage, 'infopage': load_data }

@responder
def application(environ, start_response):
    request = Request(environ)
    print(request)
    urls = url_map.bind_to_environ(environ)
    return urls.dispatch(lambda e, v: views[e](request, **v),
                         catch_http_exceptions=True)

if __name__ == "__main__":
    app = SharedDataMiddleware(application, {'/static': os.path.join(os.path.dirname(__file__), 'static')})
    run_simple('localhost', 4900, app)

