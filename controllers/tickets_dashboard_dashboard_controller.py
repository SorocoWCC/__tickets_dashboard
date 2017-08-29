
# -*- coding: utf-8 -*-
from openerp import http
import json

class DashboardController(http.Controller):
    @http.route('/rest/dashboard/hello', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/rest/dashboard/getdrafts/', auth='public')
    def getDrafts(self, **kw):
        return http.request.render('__tickets_dashboard.listing', {
            'orders': http.request.env['purchase.order'].search([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        });

    @http.route('/rest/dashboard/getorders/', auth='public')
    def gertOrders(self, **kw):
        return http.request.render('__tickets_dashboard.listing', {
            'orders': http.request.env['purchase.order'].search([('state', '=', 'approved'), ('pago_caja', '=', 'pendiente')])
        });

    @http.route('/rest/dashboard/getdrafts/json', auth='public')
    def getDraftsJson(self, **kw):
        orders = http.request.env['purchase.order'].search_read([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)

    @http.route('/rest/dashboard/getorders/json', auth='public')
    def getOrdersJson(self, **kw):
        orders = http.request.env['purchase.order'].search_read([('state', '=', 'approved'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)