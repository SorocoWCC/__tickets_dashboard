
# -*- coding: utf-8 -*-
from openerp import http

class TicketDashboard(http.Controller):
    @http.route('/rest/hello/', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/rest/objects/', auth='public')
    def list(self, **kw):
        return http.request.render('__tickets_dashboard.listing', {
            # 'root': '/openacademy/openacademy',
            'orders': http.request.env['purchase.order'].search([('state', '!=', 'cancel'), ('pago_caja', '=', 'pendiente')]),
        });