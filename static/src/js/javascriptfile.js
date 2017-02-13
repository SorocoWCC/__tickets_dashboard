(function() {

    /*Starts Editable Object*/
    var _model, _view, _controller, body, containter, ticketsTable,
    ticketsModel = {
        attachHandlers: function(){
            jQuery(document).on('keydown', function(e){
                if (e.keyCode === 27){
                    body.toggleClass('ticketList');
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
        updateCicle: function(){

        },
        renderUI: function(){
            //ticketsTable = container.find('#tickets-table')
            var tTableBody = container.find('#paid-tickets-table tbody');

            this.requestTickets(function(tickets){
                var tRows = '';
                jQuery.each(tickets, function( index, value ) {
                    tRows += '<tr><td>'+value.name +' - '+value.partner_id[1]+'</td></tr>';
                });
                console.log(tTableBody);
                tTableBody.append(tRows);
            });
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