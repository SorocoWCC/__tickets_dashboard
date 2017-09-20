(function() {
    /*=> Tickets Dashboard Module*/
    var refreshTime = 10, // value in seconds that the screen will take to refresh
    loadIterations = 0, registryInterval, igniter, _model, _view, _controller, updateJob, body, tPaidBody, 
    tUnpaidBody, ticketsTable,navBar,contentTable,contentTableLeftBar,moduleContainer,
    contentTableActionBar, oldObj, newObj, container
    ticketsModule = {
        _requestTickets: function(callback) {
            var that = this,
            tickets = new openerp.Model('purchase.order');
        
            tickets.query(['name', 'partner_id', 'state', 'placa'])
                .filter([['state', '!=', 'cancel'],['pago', '!=', 'muy'], ['pago_caja', '=', 'pendiente']])
                .limit(20)
                .all()
                .then(function(tickets) {
                    newObj = JSON.stringify(tickets);

                    var modal = body.find('.modal'),
                        modalBackdrop = body.find('.modal-backdrop');

                    if (container.find('.modal') !== undefined) {
                        modal.remove();
                        modalBackdrop.remove();
                    }
                    if (newObj !== oldObj) {
                        callback(tickets);
                    };
                });
        },
        _initUpdateJob: function(activate) {
            var that = this;

            if (activate) {
                updateJob = window.setInterval(function() {
                    that._requestTickets(function(tickets) {
                        var drafts = '', orders = '';

                        jQuery.each(tickets, function( index, value ) {
                            var ticket = (value.placa !== false) ? value.placa : '',
                                title = (ticket !== '') ? 'Ficha' : '',
                                // row = '<tr><td><span class="header ticket">Ficha</span>'+
                                //         '<span class="ticket">'+ticket+'</span></td><td>'+value.partner_id[1]+
                                //         '</td></tr>';
                                row = '<div class="ticket-row">'+
                                            '<div class="ticket ticket-number">'+
                                                '<span class="title">'+title+'</span>'+
                                                '<span class="number">'+ticket+'</span>'+
                                            '</div>'+
                                            '<div class="ticket ticket-info">'+value.partner_id[1]+'</div>'+
                                        '</div>';

                            if (value.state === 'draft' || value.state === 'confirmed') {
                                drafts += row;
                            }else if(value.state === 'approved'){
                                orders += row;
                            }else{};
                        });
                        tUnpaidBody.html(drafts);
                        tPaidBody.html(orders);
                    });                    
                }, refreshTime * 1000);
            }else{
                 window.clearInterval(updateJob);
            }
        },
        _renderUI: function() {
            body.addClass('ticketList');
            this._initGlobalComps();
            this._hideGlobalComps();

            tUnpaidBody = container.find('#drafts-tck-table .table-body');
            tPaidBody = container.find('#orders-tck-table .table-body');
            this._initUpdateJob(true);
        },
        _initGlobalComps:function () {
            navBar = body.find('#oe_main_menu_navbar');
            contentTable = body.find('table.oe_webclient tbody');
            contentTableLeftBar = contentTable.find('td.oe_leftbar');
            moduleContainer = contentTable.find('td.oe_application');
            contentTableActionBar = moduleContainer.find('table.oe_view_manager_header');
        },
        _hideGlobalComps: function() {
            navBar.hide();
            contentTableLeftBar.hide();
            contentTableActionBar.hide();
            container.show();
        },
        _showGlobalComps: function() {
            navBar.show();
            contentTableLeftBar.show();
            contentTableActionBar.show();
            container.hide();
        },
        _attachHandlers: function() {
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
        _detachHandlers: function() {
            jQuery(document).off('keydown');
        },
        /*Required module functions*/
        suspend: function() {
            this._detachHandlers();
        },
        init: function(model, view, controller) {
            _model = model; _view = view; _controller = controller;
            body = igniter.scope.viewBody;
            container = igniter.scope.customModuleSelector;
            if (_view === 'list' && _controller.model === 'tickets.dashboard'){
                this._renderUI();
                this._attachHandlers();
            }
        },
        instanceRegister: function(){
            var that = this;

            loadIterations ++;

            registryInterval = setInterval(function() {
                if (window.SOROCOModel !== undefined) {
                    console.log('=>Instance init: __ticketsDashboard');
                    igniter = window.SOROCOModel;
                    igniter.initModule(ticketsModule, '.oe_view_manager.oe_view_manager_current .oe_view_manager_body .custom-container');
                    clearInterval(registryInterval);                
                }else {
                    console.log('Igniter not found, execution: ' +loadIterations);
                    setTimeout(that.instanceRegister() ,1000);
                } 
            }, 10000);
        }
        /* End Required module functions*/
    };
    
    ticketsModule.instanceRegister();

})(window);