(function() {

    /*Starts Editable Object*/
    var _model, _view, _controller, updateJob, body, containter, tPaidBody, 
    tUnpaidBody, ticketsTable,navBar,contentTable,contentTableLeftBar,moduleContainer,
    contentTableActionBar, 
    ticketsModel = {
        uiInited: true,
        attachHandlers: function(){
            var that = this;

            jQuery(document).on('keydown', function(e){
                if (e.keyCode === 27){
                    if (!body.hasClass('ticketList')) {
                        body.addClass('ticketList');
                        that.hideGlobalComps();
                        this.initUpdateJob(true);
                    }else{
                        body.removeClass('ticketList');
                        that.showGlobalComps();
                        this.initUpdateJob(false);
                    }
                };
            });
        },
        requestTickets: function(callback){
            var that = this,
            tickets = new openerp.Model('purchase.order');
        
            tickets.query(['name', 'partner_id'])
                .filter([['pago_caja', '=', 'pagado']])
                .limit(15)
                .all().then(function(tickets) {
                    callback(tickets);
                });
        },
        initUpdateJob: function(activate){
            var that = this;
            if (activate) {
                updateJob = window.setInterval(function() {
                    that.requestTickets(function(tickets){
                        var tRows = '';
                        jQuery.each(tickets, function( index, value ) {
                            tRows += '<tr><td>'+value.name +' - '+value.partner_id[1]+'</td></tr>';
                        });
                        tPaidBody.append(tRows);
                        tUnpaidBody.append(tRows);
                    });
                }, 15000);
            }else{
                 window.clearInterval(updateJob);
            }
        },
        renderUI: function(){
            body.addClass('ticketList');
            this.initGlobalComps();
            this.hideGlobalComps();

            tPaidBody = container.find('#paid-tickets-table tbody');
            tUnpaidBody = container.find('#non-paid-tickets-table tbody');
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
        _init: function(model, view, controller){
            _model = model;
            _view = view;
            _controller = controller;

            if (view == 'list' && controller.model == 'tickets.dashboard'){
                this.renderUI();
                this.attachHandlers();
            }
        }
    },
    /*Ends Editable Object*/

    /*===DO NOT TOUCH===*/
    loading = function() {
        /*@TODO: Create load(splash) screen to show until the DOM is fully loaded*/
    },
    igniter = function(model, fnObj){
        var watcher = window.setInterval(function() {
            var view, controller, cont = $('.oe_view_manager.oe_view_manager_current .oe_view_manager_body .custom-container');

            if (model && model.action_manager && model.action_manager.inner_widget  
                && model.action_manager.inner_widget.active_view  && cont.length > 0) {
                view = model.action_manager.inner_widget.active_view;
                controller = model.action_manager.inner_widget.views[view].controller;
                container = cont;

                window.clearInterval(watcher);
                fnObj._init(model, view, controller);
            }
        }, 2000);
    };
    
    jQuery(document).ready(function(){
        body = jQuery('body');

        openerp.web.WebClient.include({
            start: function() {
                this._super();
                igniter(this, ticketsModel);
            },
        });
    });

})(window);