/* global common, action, handler */

(function(){
    
    var currentPage = 'select_number.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
        
        common.createSidebar(currentPage);
        common.checkLogin();
        
        var canSubmit = true;
        var dateOptions = {
            timePicker: true,
            timePicker24Hour:true,
            timePickerSeconds:true,
            alwaysShowCalendars: true,
            singleDatePicker: true,
            locale: {
                format: 'YYYY-MM-DD HH:mm:ss',
                firstDay: 1
            }
        };
        
        dateOptions.startDate = moment().startOf('days');
        $('input[name="start_time"]').daterangepicker(dateOptions);
        
        dateOptions.startDate = moment().endOf('days');
        $('input[name="end_time"]').daterangepicker(dateOptions);
        
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
                
                $('form input, form select').attr('disabled', true);
                canSubmit = false;
            }
            
        });
        
        $("form").submit(function(){
            
            if(!canSubmit) return false;
            
            var form = new FormData(this);
            form.set('account', localStorage.account);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            
            $("#detail").hide();
            
            handler.request(common.config.rootAPI + 'report.php', null, form, function(j){
                
                common.checkLogout(j);
                
                if(j.errorcode == common.errorCode.success){
                    
                    var list = '';
                    
                    for(var i = 0 ; i < j.log_list.length ; ++i){
                        
                        var log = j.log_list[i];
                        
                        list += '\n\
                        <tr>\n\
                          <td>' + log.account + '</td>\n\
                          <td>' + action[log.action] + '</td>\n\
                          <td>' + log.money + '</td>\n\
                          <td>' + log.transaction_id + '</td>\n\
                          <td>' + log.scoreafter + '</td>\n\
                          <td>' + log.time + '</td>\n\
                          <td>' + log.receive_account + '</td>\n\
                        </tr>';
                    }
                    
                    $("#list").html(list);
                    $("#detail").show();
                    
                }else{
                    
                    $("#failModal .modal-body").text(j.message);
                    $("#failModal").modal('show');
                }
            });
            
            return false;
        });
    });
})();