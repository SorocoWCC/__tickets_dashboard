
# -*- coding: utf-8 -*-
from openerp import http
import json
import logging 
_logger = logging.getLogger(__name__)

class DashboardController(http.Controller):

    def getPristineDict(self, dirtyDict):
        pristDict = {}

        for element in dirtyDict:
            key = element["name"]
            pristDict[element["name"]] = element

        return pristDict


    def getDictDIff(self, odooDict, qTicketList, checkForUpdated = False):
        diffDict = {"added":[],"updated": [], "removed":[]} if checkForUpdated is True else {"added":[], "removed":[]}
        inMemoryList = []

        #Check if enpoint received data from Qticket
        if len(qTicketList) > 0:

            # Check every order from Odoo and save the 
            # ID's of each order already loaded
            
            for obj in qTicketList:
                xKey = obj["id"]
                for yKey in odooDict:
                    cDraft = odooDict[yKey]
                    if xKey == cDraft["name"]:
                        inMemoryList.append({"qticket": obj, "odoo": cDraft});

            #Loop in the array to find any repeated or updated orders
            for obj in inMemoryList:
                qticketOrder = obj["qticket"]
                odooOrder = obj["odoo"]
                key = qticketOrder["id"]

                # Check if the order in QTicket was updated since the last time
                # it was retreived, and fetch the changes
                if checkForUpdated is True and odooOrder["__last_update"] != qticketOrder["last_update"]:
                    diffDict["updated"].append({
                        "id": odooOrder["name"],
                        "client": odooOrder["partner_id"],
                        "ticket": odooOrder["placa"],
                        "last_update": odooOrder["__last_update"]
                     })
                    del odooDict[key]
                    qTicketList.remove(obj["qticket"])
                # Remove repeated order from the list retrieved by Odoo
                else:
                    del odooDict[key]
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
        if len(odooDict) > 0:
            for draftKey in odooDict:
                currentDraft = odooDict[draftKey]

                diffDict["added"].append({
                    "id": currentDraft["name"],
                    "client": currentDraft["partner_id"],
                    "ticket": currentDraft["placa"],
                    "last_update": currentDraft["__last_update"]
                 })

        return diffDict;

    def getCompiledResponseObj(self, drafts, confirmed, approved, qTicketList):
        return {"drafts": self.getDictDIff(self.getPristineDict(drafts), qTicketList["drafts"], True), "confirmed": self.getDictDIff(self.getPristineDict(confirmed), qTicketList["confirmed"]), "approved": self.getDictDIff(self.getPristineDict(approved), qTicketList["approved"])}

    @http.route('/rest/purchases/drafts/list', type='json', auth='public', methods=['POST'], website=True)
    def getDraftsList(self, **args):
        draftsInfo = http.request.env['purchase.order'].search_read([('state', '=', 'draft'), ('pago', '!=', 'muy'), ('pago_caja', '=', 'pendiente')])
        approvedInfo = http.request.env['purchase.order'].search_read([('state', '=', 'approved'),('pago', '!=', 'muy'), ('pago_caja', '=', 'pendiente')])
        confimedInfo = http.request.env['purchase.order'].search_read([('state', '=', 'confirmed'),('pago', '!=', 'muy'), ('pago_caja', '=', 'pendiente')])

        ids = args.get('ids', False)
        #_logger.info(ids)

        compiledResultsList = self.getCompiledResponseObj(draftsInfo, approvedInfo, confimedInfo, ids)

        return json.dumps(compiledResultsList)
        #return json.dumps({"result":"test Result"})