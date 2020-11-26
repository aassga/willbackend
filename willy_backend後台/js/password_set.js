/* global common, confirmMsg, handler */

(function(){
    
    var currentPage = 'password_set.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
        
        common.createSidebar(currentPage);
        common.checkLogin();
        
        $("#account").text(localStorage.account);
        
        $("form").submit(function(){
            
            if($('form [name="password"]').val() !== $('form [name="confirmPassword"]').val()){
                
                $("#failModal .modal-body").text(confirmMsg);
                $("#failModal").modal('show');
                return false;
            }
            
            var form = new  FormData(this);
            form.set('account', localStorage.account);
            form.set('account_type', localStorage.account_type);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            
            handler.request(common.config.rootAPI + 'updatepassword.php', null, form, function(j){
                
                common.checkLogout(j);
                
                $("#failModal .modal-body").text(j.message);
                $("#failModal").modal('show');
            });
            
            return false;
        });
    });
})();