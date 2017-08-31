
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

    @http.route('/rest/qticket/orders/getdrafts/', auth='public')
    def getDraftsJson(self, **kw):
    	orders = http.request.env['purchase.order'].search_read([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)

    @http.route('/rest/qticket/users/getusers/', auth='public')
    def getUsersJson(self, **kw):        
        users = http.request.env['res.users'].search_read([('state', '=', 'active')])
        return json.dumps(users)

    @http.route('/rest/qticket/users/getuser/<string(minlength=1):username>', auth='public')
    def getUserJson(self, username, **kw):        
        users = http.request.env['res.users'].search_read([('login', '=', username)])
        return json.dumps(users)