//Models
Surl = Backbone.Model.extend({
    idAttribute: 'surl',
    urlRoot: 'http://surl.local/surlapi/surl'
});

SurlCollection = Backbone.Collection.extend({
    url: 'http://surl.local/surlapi/surl',
    model: Surl
});

//Views
SurlListView = Backbone.View.extend({

    initialize:function () {
        var self = this;
        this.model.bind("add", function (surl) {
            $(self.el).prepend(new SurlItemView({model: surl}).render().el);
        });
    },

    render : function (eventName) {
        return this;
    }
});

SurlItemView = Backbone.View.extend({

    template: _.template($('#tmpl_surl').html()),

    initialize: function () {
        this.model.bind("change", this.render, this);
    },

    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close: function () {
        $(this.el).unbind();
        $(this.el).remove();
    },

    events: {
        "click .delete": "doDelete"
    },

    doDelete: function( event ){
       if(!confirm('Are you sure?'))
           return false;

       var self = this;
       this.model.destroy({
           success:function(model, response)
           {
                self.close();
           },
           error:function(model, response)
           {
                alert(response.statusText + ': ' + response.responseText);
           }
       });
    }
});

HeaderView = Backbone.View.extend({

    template: _.template($('#tpl-header').html()),

    initialize: function () {
        this.render()
    },

    render: function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click .new" : "newSurl"
    },

    newSurl: function (event) {
        var ns = new Surl();
        ns.save(
            {url: $('#url').val()},
            {
                success:function(){
                    app.surllist.add(ns);
                },
                error: function (model, response) {
                    alert(response.statusText + ': ' + response.responseText);
                }
            });
        return false;
    }
});

// Router
var AppRouter = Backbone.Router.extend({
    routes: {
        "":"list"
    },

    initialize: function () {
        $('#header').html(new HeaderView().render().el);
    },

    list: function () {
        this.surllist = new SurlCollection();
        this.surllist.fetch();
        this.surlListView = new SurlListView({model: this.surllist});
        $('#surls').html(this.surlListView.render().el);
    }
});

var app = new AppRouter();
Backbone.history.start();


//var ns = new Surl();
//ns.save(
//    {url: 'http://www.fundinfo.com'},
//    {
//    success:function(){
//        alert(ns.get('surl'));
//    }
//});


//var x = new SurlCollection().fetch();

//var y = new Surl({surl : 'git'});
//y.fetch();
//y.destroy();
