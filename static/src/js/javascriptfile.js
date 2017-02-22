(function() {
    /*=> Tickets Dashboard Module*/
    var _model, _view, _controller, updateJob, body, tPaidBody, 
    tUnpaidBody, ticketsTable,navBar,contentTable,contentTableLeftBar,moduleContainer,
    contentTableActionBar, oldObj, newObj, container
    ticketsModule = {
        _requestTickets: function(callback){
            var that = this,
            tickets = new openerp.Model('purchase.order');
        
            tickets.query(['name', 'partner_id', 'state'])
                .filter([['state', '!=', 'cancel'], ['pago_caja', '=', 'pendiente']])
                .limit(15)
                .all().then(function(tickets) {
                    newObj = JSON.stringify(tickets);
                    if (newObj !== oldObj) {
                        callback(tickets);
                    };
                });
        },
        _initUpdateJob: function(activate){
            var that = this;

            if (activate) {
                updateJob = window.setInterval(function() {
                    that._requestTickets(function(tickets){
                        var drafts = '', orders = '';

                        jQuery.each(tickets, function( index, value ) {
                            var row = '<tr><td>'+value.name +' - '+value.partner_id[1]+'</td></tr>';
                            if (value.state === 'draft' || value.state === 'confirmed') {
                                drafts += row;
                            }else if(value.state === 'approved'){
                                orders += row;
                            }else{};
                        });
                        tUnpaidBody.html(drafts);
                        tPaidBody.html(orders);
                    });
                }, 10000);
            }else{
                 window.clearInterval(updateJob);
            }
        },
        _renderUI: function(){
            body.addClass('ticketList');
            this._initGlobalComps();
            this._hideGlobalComps();

            tUnpaidBody = container.find('#drafts-tck-table tbody');
            tPaidBody = container.find('#orders-tck-table tbody');
            this._initUpdateJob(true);
        },
        _initGlobalComps:function (){
            navBar = body.find('#oe_main_menu_navbar');
            contentTable = body.find('table.oe_webclient tbody');
            contentTableLeftBar = contentTable.find('td.oe_leftbar');
            moduleContainer = contentTable.find('td.oe_application');
            contentTableActionBar = moduleContainer.find('table.oe_view_manager_header');
        },
        _hideGlobalComps: function(){
            navBar.hide();
            contentTableLeftBar.hide();
            contentTableActionBar.hide();
            container.show();
        },
        _showGlobalComps: function(){
            navBar.show();
            contentTableLeftBar.show();
            contentTableActionBar.show();
            container.hide();
        },
        _attachHandlers: function(){
            var that = this;

            jQuery(document).on('keydown', function(e){
                if (e.keyCode === 27){
                    if (!body.hasClass('ticketList')) {
                        body.addClass('ticketList');
                        that._hideGlobalComps();
                        that._initUpdateJob(true);
                    }else{
                        body.removeClass('ticketList');
                        that._showGlobalComps();
                        that._initUpdateJob(false);
                    }
                };
            });
        },
        _detachHandlers: function(){
            jQuery(document).off('keydown');
        },
        /*Required module functions*/
        suspend: function(){
            this._detachHandlers();
        },
        init: function(model, view, controller){
            _model = model; _view = view; _controller = controller;
            body = window.SOROCOModel.scope.viewBody;
            container = window.SOROCOModel.scope.customModuleSelector;
            if (_view === 'list' && _controller.model === 'tickets.dashboard'){
                this._renderUI();
                this._attachHandlers();
            }
        }
        /* End Required module functions*/
    };
    window.SOROCOModel.initModule(ticketsModule, '.oe_view_manager.oe_view_manager_current .oe_view_manager_body .custom-container');
})(window);