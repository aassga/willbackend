/* global common, handler */

(function(){
    
    var currentPage = 'number_down.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
    
        common.createSidebar(currentPage);
        common.checkLogin();
        
        $("form").submit(function(){
            
            var form = new FormData(this);
            form.set('account', localStorage.account);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            form.set('account_type', localStorage.account_type);
            
            handler.request(common.config.rootAPI + 'withdraw.php', null, form, function(j){
                
                common.checkLogout(j);
                
                if(j.errorcode == common.errorCode.success){
                    
                    $("#successModal .modal-title").text(j.message);
                    $("#storeAccount").text(j.store_account);
                    $("#storeAfterMoney").text(j.store_after_money);
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