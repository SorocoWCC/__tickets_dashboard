# -*- coding: utf-8 -*-
{
    'name': "__tickets_dashboard",

    'summary': "Tickets Dashbord showing ready to pay tickets",

    'description': "Module using JS and CSS to make a AJAX tickets listing!",

    'author': "Andrey Castro",
    'website': "http://recsm.com",

    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/tickets_dashboard.xml',
        'views/menus.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        #'demo/demo.xml',
    ],
}
