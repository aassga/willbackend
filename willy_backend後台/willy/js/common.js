/* global handler */

(function(win){
    
    var common = {
        errorCode:{
            fail: -1,
            success: 1,
            checksumError: 2,
            lackParameter: 3,
            accountPasswordError: 4,
            checkTokenError: 5,
            dbSelectError: 6,
            balanceNotEnough: 7,
            dbUpdateError: 8,
            doubleAccount: 9,
            receiveAccountNotfound: 10,
            authorityError: 11
        },
        menus: {
            '34': {file: 'number_up.html', icon: 'angle-double-up-solid.svg'},
            '35': {file: 'number_down.html', icon: 'angle-double-down-solid.svg'},
            '36': {file: 'work_number_up.html', icon: 'network-wired-solid.svg'},
            '37': {file: 'work_number_down.html', icon: 'network-wired-solid.svg'},
            '38': {file: 'select_number.html', icon: 'list-alt-regular.svg'},
            '39': {file: 'password_set.html', icon: 'cog-solid.svg'},
            '40': {file: 'Revenue.html', icon: 'coins-solid.svg'}
        },
        powerMenus: [],
        createSidebar: function(){
            
            var menus = '<li class="sidebar-header">Menu</li>';
            for(var i = 0; i < this.powerMenus.length; ++i){
                
                var activeClass = localStorage.currentPage === this.powerMenus[i].file ? 'text-danger' : '';
                
                menus += '\
                <li class="sidebar-item bor-btm-c3">\n\
                    <a class="sidebar-link" href="' + this.powerMenus[i].file + '">\n\
                        <img class="svg-inline--fa fa-book fa-w-14 fa-fw align-middle mr-2" src="./img/' + this.powerMenus[i].icon + '">\n\
                        <span class="align-middle fs-2rem ' + activeClass + '">' + this.powerMenus[i].text + '</span>\n\
                    </a>\n\
                </li>';
            }
            
            $(".sidebar-nav").html(menus);
        },
        checkLogin: function(){
            
            if(!localStorage.currentPage) {
                location = 'login.html';
                return;
            }
            
            var self = this;
            var form = new FormData();
            form.set('account', localStorage.account);
            form.set('token', localStorage.token);
            
            handler.request(common.config.rootAPI + "login_status.php", null, form, function(j){
                
                if(j.errorcode == self.errorCode.success){
                    
                    $("#loginAccount").text(localStorage.account);
                    $("#loginMoney").text(localStorage.money);
                    return;
                }
                
                alert(j.message + ' (' + j.errorcode + ')');
                
                location = 'login.html';
            });
        },
        checkLogout: function(j){
            
            if(j.errorcode == this.errorCode.checkTokenError){
                alert(j.message + ' (' + j.errorcode + ')');
                location = 'login.html';
            }
        }
    };
    
    if(localStorage.menu && localStorage.menuText){
        
        var menus = JSON.parse(localStorage.menu);
        var menuText = JSON.parse(localStorage.menuText);
        
        for(var i = 0; i < menus.length; ++i){
            
            common.powerMenus[i] = common.menus[menus[i]];
            common.powerMenus[i].text = menuText[menus[i]];
        }
    }
    
    $.getJSON("config.json", function(data){common.config = data;});
    
    win.common = common;
    
    $(function(){
        
        $(".sidebar-toggle").click(function(){
            
            var ele = $(".sidebar");
            var property = 'margin-left';
            
            if(ele.css(property) === '0px') ele.css(property, '-250px');
            else ele.css(property, '0px');
        });
        
        $("#btnLogout").click(function(){
            
            var form = new FormData();
            form.set('account', localStorage.account);
            form.set('token', localStorage.token);
            
            handler.request(common.config.rootAPI + "logout.php", null, form, function(j){
                
                alert('LOGOUT ' + j.message);
                
                if(j.errorcode == common.errorCode.success) location = 'login.html';
            });
        });
    });
    
})(window);
