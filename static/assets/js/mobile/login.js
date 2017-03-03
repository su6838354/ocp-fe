p={
	'classname':'Admins'
};
p.init=function() {
	p.initVar();
	p.initCss();
	p.initEvent();
};
p.initVar=function() {
	$j_login_btn = $out_wrap.find('.j_login_btn');
	$j_wait_tip = $out_wrap.find('.j_wait_tip');
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
		var $password=$('#password');
		if(!$username.val()){
			$username.focus();
			return false;
		}
		if(!$password.val()){
			$password.focus();
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
			"userPwd": $password.val()
		},function(res){
	    	if(res.code){
	    		misc.fillAlert($j_wait_tip,res.msg);
	    		$j_login_btn.html(p.l);
				$j_login_btn.removeClass(misc.vars.disable);
	    	}else{
	    		user.setAdminCookie(res);
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

function fillAlert(s,time){
	time = time ? time : 600;
	$j_wait_tip.text(s).show();
	setTimeout(function(){
		$j_wait_tip.hide();
	},time);
}

function logIn(userName,userPwd,url){
	jumpUrl = url || '../../mobile/index/';
	AV.User.logIn(userName, userPwd, {
	  	success: function(user) {
	    	if(user && user.id  && user.get('userRole') == 'Admins'){
    			fillAlert('登录成功!');
				waitRedirect(jumpUrl,1000);
	    	}
	    	else{
	    		AV.User.logOut();
	    		fillAlert('账号登录异常!');
	    		$j_login_btn.html(l);
	    	}
	  	},
	  	error: function(user, error) {
	  		fillAlert(errorEnum[error.code]['msg']);
			btnText($j_login_btn,l);
	  	}
	});
}


