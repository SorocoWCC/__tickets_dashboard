
# -*- coding: utf-8 -*-
from openerp import http
from requests import Request,Session
import json
import requests



class QticketController(http.Controller):
    @http.route('/rest/qticket/hello', auth='public')
    def index(self, **kw):
        return "Hello, world"

    # Object base retrive of data using render template
    # @http.route('/rest/qticket/orders/getdrafts/', auth='public')
    # def getDrafts(self, **kw):
    #     return http.request.render('__tickets_dashboards.listing', {
    #         'orders': http.request.env['purchase.order'].search([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
    #     });

    @http.route('/rest/users/all/', auth='public')
    def getUsers(self, **kw):        
        users = http.request.env['res.users'].search_read([('state', '=', 'active')])
        return json.dumps(users)

    @http.route('/rest/users/get/<string(minlength=1):username>', auth='public')
    def getUser(self, username, **kw):        
        users = http.request.env['res.users'].search_read([('login', '=', username)])
        return json.dumps(users)

    @http.route('/rest/products/all/', auth='public')
    def getProducts(self, **kw):        
        products = http.request.env['product.template'].search_read([('active', '=', 'true')])
        return json.dumps(products)