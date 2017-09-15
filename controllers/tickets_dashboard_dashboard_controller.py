
# -*- coding: utf-8 -*-
from openerp import http
import json
import logging 
_logger = logging.getLogger(__name__)

class DashboardController(http.Controller):

    @http.route('/odoo/test', type='json', auth='public', methods=['POST'], website=True)
    def getDraftsList(self, **args):
        drafts = http.request.env['purchase.order'].search_read([('state', '=', 'draft'), ('pago_caja', '=', 'pendiente')])
        ids = args.get('ids', False)
        qticketList = ids['ids']
        
        return json.dumps(drafts)


        # for x in qticketList:
        #     # @TODO: Compare list of tickets and return ids to be added and deleted
        #     _logger.info(x)

        # if not ids:
        #     Response.status = '400 Bad Request'
        # return '{"response": "OK"}'