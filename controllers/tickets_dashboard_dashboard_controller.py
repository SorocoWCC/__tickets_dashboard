
# -*- coding: utf-8 -*-
from openerp import http
import json
import logging 
_logger = logging.getLogger(__name__)

class DashboardController(http.Controller):

    @http.route('/odoo/test', type='json', auth='public', methods=['POST'], website=True)
    def getDraftsList(self, **args):
        draftList = {}
        drafts = http.request.env['purchase.order'].search_read([('state', '=', 'draft'), ('pago_caja', '=', 'pendiente')])
        ids = args.get('ids', False)
        qticketList = ids['ids']
        
        for draft in drafts:
            # @TODO: Compare list of tickets and return ids to be added and deleted
             draftList[draft["name"]] = {
                "id": draft["name"],
                "client": draft["partner_id"],
                "ticket": draft["placa"]
             }

             _logger.info("=> Draft")

             _logger.info(draftList)

        return json.dumps(draftList)

        # if not ids:
        #     Response.status = '400 Bad Request'
        # return '{"response": "OK"}'