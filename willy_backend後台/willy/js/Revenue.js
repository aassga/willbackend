/* global common, handler, moment */

(function(){
    
    var currentPage = 'Revenue.html';
    localStorage.setItem('currentPage', currentPage);
    
    $(function(){
        
        common.createSidebar(currentPage);
        common.checkLogin();
        
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
        
        var unit = 'hour';
        
        $("#unit input[type='button']").click(function(){
            
            unit = this.dataset.value;
            $("#unit input[type='button']").removeClass('selected');
            $(this).addClass('selected');
        });
        
        $("form").submit(function(){
            
            var form = new FormData(this);
            form.set('account', localStorage.account);
            form.set('agent', localStorage.agent);
            form.set('token', localStorage.token);
            form.set('account_type', localStorage.account_type);
            form.set('unit', unit);
            
            $("#detail").hide();
            
            handler.request(common.config.rootAPI + 'income.php', null, form, function(j){
                
                common.checkLogout(j);
                
                if(j.errorcode == common.errorCode.success){
                    
                    var list = '';
                    
                    for(var i = 0 ; i < j.log_list.length ; ++i){
                        
                        var log = j.log_list[i];
                        
                        list += '\n\
                        <tr>\n\
                          <td>' + log.time + '</td>\n\
                          <td>' + log.deposit + '</td>\n\
                          <td>' + log.withdraw + '</td>\n\
                          <td>' + log.income + '</td>\n\
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