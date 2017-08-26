
# -*- coding: utf-8 -*-
from openerp import http
import json

class TicketDashboard(http.Controller):
    @http.route('/rest/hello/', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/rest/objects/', auth='public')
    def restobjects(self, **kw):
        return http.request.render('__tickets_dashboard.listing', {
            'orders': http.request.env['purchase.order'].search([('state', '!=', 'cancel'), ('pago_caja', '=', 'pendiente')]),
        });

    @http.route('/rest/objects/json', auth='public')
    def restObjectsJson(self, **kw):
    	orders = http.request.env['purchase.order'].search_read([('state', '!=', 'cancel'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)