/* global common, moment, handler */

(function(){
    
    var currentPage = 'work_number_down.html';
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

            $("#score,#detail").hide();

            handler.request(common.config.rootAPI + 'offwork_withdraw.php', null, form, function(j){

                common.checkLogout(j);

                if(j.errorcode == common.errorCode.success){

                    $("#todayScore").text(j.today_score);
                    $("#sendScore").text(j.send_score);
                    $("#nowScore").text(j.now_score);
                    $("#todayBackScore").text(j.today_back_score);
                    $("#difference").text(j.difference);

                    var list = '';

                    for(var i = 0 ; i < j.detail.length ; ++i){

                        var detail = j.detail[i];

                        list += '\n\
                        <tr>\n\
                          <td>' + detail.time + '</td>\n\
                          <td>' + detail.account + '</td>\n\
                          <td>' + detail.action + '</td>\n\
                          <td>' + detail.score + '</td>\n\
                          <td>' + detail.recevie_account + '</td>\n\
                        </tr>';
                    }

                    $("#score").show();

                    $("#list").html(list);

                }else{

                    $("#failModal .modal-body").text(j.message);
                    $("#failModal").modal('show');
                }
            });

            return false;
        });

        $("#btnDetail").click(function(){

            $("#detail").show();
        });
    });
})();