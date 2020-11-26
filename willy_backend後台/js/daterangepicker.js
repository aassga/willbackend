/* global moment */

(function(){
    
    $(function(){
        
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
    });
})();