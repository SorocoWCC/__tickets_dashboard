
# -*- coding: utf-8 -*-
from openerp import http
from requests import Request,Session
import json
import requests



class QticketController(http.Controller):
    @http.route('/rest/qticket/hello', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/rest/qticket/getdrafts/', auth='public')
    def getDrafts(self, **kw):
        return http.request.render('__tickets_dashboard.listing', {
            'orders': http.request.env['purchase.order'].search([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        });

    @http.route('/rest/qticket/getdrafts/json', auth='public')
    def getDraftsJson(self, **kw):
    	orders = http.request.env['purchase.order'].search_read([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)