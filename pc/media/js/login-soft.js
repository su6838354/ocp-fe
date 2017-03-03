var $j_alert = $('.j_alert'),
	str =  '<div class="alert alert-error hide">\
		    	<button class="close" data-dismiss="alert"></button>\
				<span></span>\
		    </div>';

function fillAlert(s){
	$j_alert.html(str).find('.alert-error').show().find('span').text(s);
}
function match(userName,userPwd){
	logInBtnText(1);
	userObj.logIn({
		"userRole": $.trim(userName)=="admin"?"SuperAdmin":"Admins",
		"userName": $.trim(userName),
		"userPwd": $.trim(userPwd)
	},function(res){
    	if(res.code){
			logInBtnText();
			fillAlert("用户名或密码错误");
    	}else{
        	misc.clearCookie('userInfo');
    		if(res.data.pid=="001"){
    			misc.setCookie('userInfo',JSON.stringify({userRole:"SuperAdmin",username:"admin"}),1);
    		}else{
	        	res.data['userRole']="Admins";
	    		misc.setCookie('userInfo',JSON.stringify(res.data),1);
    		}
			fillAlert('登录成功,正在连接后台系统');
			waitRedirect('dashboard.html',500);
    	}
    },function(err){
		logInBtnText();
		fillAlert("服务器不给力哦！");
    });
}
var Login = function () {
    
    return {
        init: function () {
            $('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                },
	                remember: {
	                    required: false
	                }
	            },

	            messages: {
	                username: {
	                    required: "账号不能为空"
	                },
	                password: {
	                    required: "密码不能为空"
	                }
	            },

	            invalidHandler: function (event, validator) { 
	            	//显示不能为空的提示  
	                $('.login-form').show();
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element).closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
					match(form.username.value,form.password.value);
	            }
	        });
        }
    };

}();