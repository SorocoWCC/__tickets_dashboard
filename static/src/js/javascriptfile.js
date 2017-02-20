(function() {

    /*=== STARTS Global JS Handler // DO NOT TOUCH===*/
    window.SOROCOModel = {
        scope: {},
        modules: [],
        _attachHandlers: function(){
            that = this;

            jQuery(document).ready(function(){
                body = jQuery('body');

                openerp.web.WebClient.include({
                    start: function() {
                        this._super();
                        that._modelWatcher(this);
                    },
                });
            });

            jQuery(document).on('init', function(e){
                jQuery.each(SOROCOModel.modules, function( index, module ) {
                    module.init(SOROCOModel.scope, SOROCOModel.scope.view, SOROCOModel.scope.controller);
                });
            });
        },
        _modelWatcher: function(scope){
            var srcModel = this,
            watcher = window.setInterval(function() {
                var view, controller, cont = $('.oe_view_manager.oe_view_manager_current .oe_view_manager_body .custom-container');

                if (scope && scope.action_manager && scope.action_manager.inner_widget  
                    && scope.action_manager.inner_widget.active_view && cont.length > 0) {
                        view = scope.action_manager.inner_widget.active_view;
                        srcModel.scope.model = scope;
                        srcModel.scope.view = scope.action_manager.inner_widget.active_view;
                        srcModel.scope.viewContainer = cont;
                        srcModel.scope.controller = scope.action_manager.inner_widget.views[view].controller;

                    window.clearInterval(watcher);
                    srcModel.inited = true;
                    jQuery(document).trigger('init');
                }
            }, 2000);
        },
        inited: false,
        initModule: function(module){
            var SOROCOModel = this; 
            if(SOROCOModel.inited){
                module.init(SOROCOModel.scope, SOROCOModel.scope.view, SOROCOModel.scope.controller);
            }else{
                SOROCOModel.modules.push(module);
            }
        },
        init: function(scope){
            this._attachHandlers();
        }
    };
    window.SOROCOModel.init();

    /*=== Ends Global JS Handler // DO NOT TOUCH===*/



    /*=> Tickets Dashboard Module*/
    var _model, _view, _controller, updateJob, body, containter, tPaidBody, 
    tUnpaidBody, ticketsTable,navBar,contentTable,contentTableLeftBar,moduleContainer,
    contentTableActionBar, oldObj, newObj, container
    ticketsModule = {
        uiInited: true,
        attachHandlers: function(){
            var that = this;

            jQuery(document).on('keydown', function(e){
                if (e.keyCode === 27){
                    if (!body.hasClass('ticketList')) {
                        body.addClass('ticketList');
                        that.hideGlobalComps();
                        that.initUpdateJob(true);
                    }else{
                        body.removeClass('ticketList');
                        that.showGlobalComps();
                        that.initUpdateJob(false);
                    }
                };
            });
        },
        requestTickets: function(callback){
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
        initUpdateJob: function(activate){
            var that = this;

            if (activate) {
                updateJob = window.setInterval(function() {
                    that.requestTickets(function(tickets){
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
        renderUI: function(){
            body.addClass('ticketList');
            this.initGlobalComps();
            this.hideGlobalComps();

            tUnpaidBody = container.find('#drafts-tck-table tbody');
            tPaidBody = container.find('#orders-tck-table tbody');
            this.initUpdateJob(true);
        },
        initGlobalComps:function (){
            navBar = body.find('#oe_main_menu_navbar');
            contentTable = body.find('table.oe_webclient tbody');
            contentTableLeftBar = contentTable.find('td.oe_leftbar');
            moduleContainer = contentTable.find('td.oe_application');
            contentTableActionBar = moduleContainer.find('table.oe_view_manager_header');
            this.uiInited = true;
        },
        hideGlobalComps: function(){
            navBar.hide();
            contentTableLeftBar.hide();
            contentTableActionBar.hide();
            container.show();
        },
        showGlobalComps: function(){
            navBar.show();
            contentTableLeftBar.show();
            contentTableActionBar.show();
            container.hide();
        },
        init: function(model, view, controller){
            _model = model; _view = view; _controller = controller;
            container = window.SOROCOModel.scope.viewContainer;
            if (_view == 'list' && _controller.model == 'tickets.dashboard'){
                this.renderUI();
                this.attachHandlers();
            }
        }
    };

    window.SOROCOModel.initModule(ticketsModule);

})(window);