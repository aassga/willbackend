/* global common, handler */

(function(){
    
    var currentPage = 'work_number_up.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
    
        common.createSidebar(currentPage);
        common.checkLogin();
        
        var canSubmit = true;
        
        var form = new FormData();
        form.set('account', localStorage.account);
        form.set('agent', localStorage.agent);
        form.set('token', localStorage.token);
        
        handler.request(common.config.rootAPI + 'memberinfo.php', null, form, function(j){
            
            common.checkLogout(j);
            
            if(j.errorcode == common.errorCode.success && Array.isArray(j.account_list)){
                
                var options = '';
                
                for(var i = 0 ; i < j.account_list.length ; ++i){
                    
                    options += '<option value="' + j.account_list[i].account + '">' + j.account_list[i].account + '</option>';
                }
                
                $('form [name="receive_account"').html(options);
                
            }else{
                
                canSubmit = false;
                $('form input, form select').attr('disabled', true);
            }
        });
        
        $("form").submit(function(){
            
            if(!canSubmit) return false;
            
            var form = new FormData(this);
            form.set('account', localStorage.account);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            form.set('account_type', localStorage.account_type);
            
            handler.request(common.config.rootAPI + 'work_deposit.php', null, form, function(j){
                
                common.checkLogout(j);
                
                if(j.errorcode == common.errorCode.success){
                    
                    $("#successModal .modal-title").text(j.message);
                    $("#receiveAccount").text(j.receive_account);
                    $("#receiveAfterMoney").text(j.receive_after_money);
                    $('#successModal').modal('show');
                    
                }else{
                    
                    $("#failModal .modal-body").text(j.message);
                    $("#failModal").modal('show');
                }
            });
            
            return false;
        });
    });
})();