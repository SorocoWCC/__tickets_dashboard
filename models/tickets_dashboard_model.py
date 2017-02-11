# -*- coding: utf-8 -*-

from openerp import models, fields, api

class tickets_dashboard_model(models.Model):
    _name = 'tickets.dashboard'
    #_inherit = 'purchase.order'
    _description = 'Tickets Listing using XMLHTTPRequest'
    name = fields.Char('Name', required=True)
