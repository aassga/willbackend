(function(win){
    
    var handler = {
        debug: false,
        count: 0,
        request: function(processor , query , data , callback){
            var self = this;
            var queryString = query ? '?' + query : '';
            $.ajax({
                url: processor + queryString,
                data: data,
                contentType: false,
                processData: false,
                dataType: "json",
                type: "post",
                beforeSend: function(jqXHR , settings){
                    self.log("= beforeSend =", jqXHR , settings);
                    self.modal(true);
                    ++self.count;
                },
                success: function(j){
                    
                    self.log("= success =" , processor , query , data , j , this.url , this.data);
                    
                    callback.call(null , j);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    self.log("= error =", jqXHR , textStatus , errorThrown);
                },
                complete: function(jqXHR, textStatus){
                    try{
                        $.parseJSON(jqXHR.responseText);
                        self.log("= complete =", jqXHR, textStatus);

                    }catch(err){
                        self.log("= complete catch =" , jqXHR, textStatus);
                    }
                    --self.count;
                    self.modal(false);
                }
            });
        },
        modal: function(enabled){
            if(enabled) $("body").mLoading("show");
            else if(this.count === 0) $("body").mLoading("hide");
        },
        log: function(){
            if(!this.debug) return;
            for(var i = 0 ; i < arguments.length ; ++i){
                console.log(arguments[i]);
            }
        }
    };
    
    win.handler = handler;
    
})(window);