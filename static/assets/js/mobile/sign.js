var p={
	'classname':'Users'
};
p.init=function() {
	p.initVar();
	p.initCss();
	p.initEvent();
};
p.initVar=function() {
	$j_login_btn=$out_wrap.find('.j_login_btn');
	$j_wait_tip=$out_wrap.find('.j_wait_tip');
	p.l='立即登录';
};
p.initCss=function() {
	$out_wrap.css("visibility","visible");
};
p.initEvent=function() {
	$out_wrap.delegate('.j_login_btn', 'click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $username=$('#username');
		if(!$username.val()){
			$username.focus();
			return false;
		}
		if($j_login_btn.hasClass(misc.vars.disable)){
			return false;
		}
		$j_login_btn.addClass(misc.vars.disable);
		btnText($j_login_btn,'正在登录...',0);
		user.logIn({
			"userRole": p.classname,
			"userName": $username.val().toLowerCase(),
			"userPwd": "123456"
		},function(res){
	    	if(res.code){
	    		misc.fillAlert($j_wait_tip,res.msg);
	    		$j_login_btn.html(p.l);
				$j_login_btn.removeClass(misc.vars.disable);
	    	}else{
				user.setUserCookie(res);
	    		misc.fillAlert($j_wait_tip,'登录成功!');
				waitRedirect('../../mobile/index/',500);
	    	}
	    },function(err){
    		misc.fillAlert($j_wait_tip,'服务器不给力哦!');
    		$j_login_btn.html(p.l);
			$j_login_btn.removeClass(misc.vars.disable);
	    });
	});
};




