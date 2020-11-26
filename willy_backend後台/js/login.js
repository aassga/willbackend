/* global handler, common, menuText */

(function(){
    
    $(function(){
        
        localStorage.clear();
        
        $("form").submit(function(e){
            
            handler.request(common.config.rootAPI + "login.php" , null , new FormData(this) , function(j){
                
                if(j.errorcode != common.errorCode.success) {
                    
                    $("img").notify(j.message, {position: "bottom centre"});
                    
                }else{
                    
                    localStorage.setItem('token', j.token);
                    localStorage.setItem('account_type', j.account_type);
                    localStorage.setItem('agent', j.agent);
                    localStorage.setItem('account', j.account);
                    localStorage.setItem('money', j.money);
                    localStorage.setItem('menu', JSON.stringify(j.menu));
                    localStorage.setItem('menuText', JSON.stringify(menuText));
                    
                    if(j.menu && j.menu.length > 0) location = common.menus[j.menu[0]].file;
                    else console.log("menu no data!!");
                }
            });
            
            return false;
        });
    });
})();
