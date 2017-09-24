
# -*- coding: utf-8 -*-
from openerp import http
import json
import logging 
_logger = logging.getLogger(__name__)

class DashboardController(http.Controller):

    def getDraftsPristineDict(instance, odooDraftsDict):
        cleanDict = {}

        for draft in odooDraftsDict:
            key = draft["name"]
            cleanDict[draft["name"]] = draft

        return cleanDict

    def getListDIff(instance, odooDraftsDict, qTicketList):
        diffDict = {"added":[],"updated": [], "removed":[]}
        inMemoryList = []

        #Check if enpoint received data from Qticket
        if len(qTicketList) > 0:

            # Check every order from Odoo and save the 
            # ID's of each order already loaded
            
            for obj in qTicketList:
                xKey = obj["id"]
                for yKey in odooDraftsDict:
                    cDraft = odooDraftsDict[yKey]
                    if xKey == cDraft["name"]:
                        inMemoryList.append({"qticket": obj, "odoo": cDraft});

            #Loop in the array to find any repeated or updated orders
            for obj in inMemoryList:
                qticketOrder = obj["qticket"]
                odooOrder = obj["odoo"]
                key = qticketOrder["id"]

                # Check if the order in QTicket was updated since the last time
                # it was retreived, and fetch the changes
                if odooOrder["__last_update"] != qticketOrder["last_update"]:
                    diffDict["updated"].append({
                        "id": odooOrder["name"],
                        "client": odooOrder["partner_id"],
                        "ticket": odooOrder["placa"],
                        "last_update": odooOrder["__last_update"]
                     })
                    del odooDraftsDict[key]
                    qTicketList.remove(obj["qticket"])
                # Remove repeated order from the list retrieved by Odoo
                else:
                    del odooDraftsDict[key]
                    qTicketList.remove(obj["qticket"])
                        
        # Get the remaining Ids in the list and set them
        # as "to remove" in Qticket
        if len(qTicketList) > 0:
            for obj in qTicketList:
                nKey = obj["id"]
                diffDict["removed"].append(nKey)
                qTicketList.remove(obj)

        # Process and filter the results from Odoo 
        # to retrieve them to Qticket
        if len(odooDraftsDict) > 0:
            for draftKey in odooDraftsDict:
                currentDraft = odooDraftsDict[draftKey]

                diffDict["added"].append({
                    "id": currentDraft["name"],
                    "client": currentDraft["partner_id"],
                    "ticket": currentDraft["placa"],
                    "last_update": currentDraft["__last_update"],
                    "is_blocked": 0
                 })

        return diffDict;

    @http.route('/rest/purchases/drafts/list', type='json', auth='public', methods=['POST'], website=True)
    def getDraftsList(self, **args):
        drafts = http.request.env['purchase.order'].search_read([('state', '=', 'draft'), ('pago_caja', '=', 'pendiente')])
        ids = args.get('ids', False)
        qTicketList = ids['ids']

        draftsDict = self.getDraftsPristineDict(drafts);

        updatesList = self.getListDIff(draftsDict, qTicketList);

        return json.dumps(updatesList)