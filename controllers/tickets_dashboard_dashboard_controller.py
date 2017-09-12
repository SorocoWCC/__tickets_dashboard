
# -*- coding: utf-8 -*-
from openerp import http
import json
import logging 
_logger = logging.getLogger(__name__)

class DashboardController(http.Controller):
    @http.route('/rest/dashboard/hello', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/rest/purchases/drafts/all/', auth='public')
    def getEditableDrafts(self, **kw):
        editableDrafts = http.request.env['purchase.order'].search_read([('state', '=', 'draft'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(editableDrafts)

    @http.route('/rest/purchases/confirmed/all/', auth='public')
    def getDrafts(self, **kw):
        drafts = http.request.env['purchase.order'].search_read([('state', '=', 'draft'),('state', '=', 'confirmed'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(drafts)

    @http.route('/rest/purchases/approved/all', auth='public')
    def getOrders(self, **kw):
        orders = http.request.env['purchase.order'].search_read([('state', '=', 'approved'), ('pago_caja', '=', 'pendiente')])
        return json.dumps(orders)

    @http.route('/odoo/test', type='json', auth='public', methods=['POST'], website=True)
    def compareLists(self, **args):
        #Logger => _logger.info(x)
        ids = args.get('ids', False)
        qticketList = ids['ids']

        for x in qticketList:
            # @TODO: Compare list of tickets and return ids to be added and deleted
            _logger.info(x)

        if not ids:
            Response.status = '400 Bad Request'
        return '{"response": "OK"}'