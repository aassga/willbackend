/* global common, handler */

(function(){
    
    var currentPage = 'number_up.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
    
        common.createSidebar(currentPage);
        common.checkLogin();
        
        $("#money").text(localStorage.money);
        
        $("form").submit(function(){
            
            var form = new FormData(this);
            form.set('account', localStorage.account);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            form.set('account_type', localStorage.account_type);
            
            handler.request(common.config.rootAPI + 'deposit.php', null, form, function(j){
                
                common.checkLogout(j);
                
                if(j.errorcode == common.errorCode.success){
                    
                    $("#successModal .modal-title").text(j.message);
                    $("#afterMoney").text(j.after_money);
                    $("#receiveAfterMoney").text(j.receive_after_money);
                    $('#successModal').modal('show').on('hidden.bs.modal', function(){
                        $("#money").text(j.after_money);
                    });
                    
                }else{
                    
                    $("#failModal .modal-body").text(j.message);
                    $("#failModal").modal('show');
                }
            });
            
            return false;
        });
    });
})();