var p = {
	'classname':'',
	'valued':'valued'
};
p.init = function() {
	p.initVar();
	p.initCss();
	user.checkLogin(p.initData);
};
p.initVar = function(){};
p.initCss = function() {
	menuHtml('shop1','mee');
	$out_wrap.css("visibility","visible");
};


p.initData = function(){
	// loadingHide();
	userRole = user.currentUser.get('userRole');
	$propertys = $('.'+userRole+' .property');
	$('.'+userRole).show();
	if(userRole=='Users'){
		p.showMyQRCode();
		misc.func.user.get_user({
			"pid":user.userInfo.pid
		},function(res){
			loadingHide();
			if(res.code=="0"){
				user.setUserCookie(res);
				user.userInfo=user.currentUser=JSON.parse(misc.getCookie('userInfo'));
				user.userInfo.get=function(p){
					return user.userInfo[p];
				};
				user.userInfo['address']=user.userInfo['address']||"&nbsp;";
				user.userInfo['job']=user.userInfo['job']||"&nbsp;";
				user.userInfo['checkin']=user.userInfo['checkin']||"&nbsp;";
				$propertys.eq(0).append(user.userInfo.get('username')||"&nbsp;");
				$propertys.eq(1).append(user.userInfo.get('realname')||"&nbsp;");
				$propertys.eq(2).append(user.userInfo.get('sex')||"&nbsp;");
				$propertys.eq(3).append(user.userInfo.get('age')+'岁');
				$propertys.eq(4).append(misc.formatDateTime(new Date(user.userInfo.get('birth')),misc.formatType['1']));
				$propertys.eq(5).append(user.userInfo.get('arole')||"&nbsp;");
				$propertys.eq(6).append(user.userInfo.get('job')||"&nbsp;");
				$propertys.eq(7).append(user.userInfo.get('group')?user.userInfo.get('group')['name']||'无':'无');
				$propertys.eq(8).append(user.userInfo.get('location')?user.userInfo.get('location')['name']||'无':'无');
				$propertys.eq(9).append(user.userInfo.get('address').replace('上海市崇明县',''));
				// $propertys.eq(10).append(user.userInfo.get('checkin').indexOf("true")>-1?'已报到':'我要报到').css('color',user.userInfo.get('checkin')[0]=="true"?'green':'red');
				if(user.userInfo.get('checkin').indexOf("true")>-1){
					$propertys.eq(10)
						.append('已报到')
						.css('color','green')
				}else{
					var pid=user.userInfo.location?user.userInfo.location.pid:user.userInfo.group.pid;
					var path='../../static/assets/images/mobile/wxqrcode/'
					
					var $temp=$('<span class="icon igongyi"></span')
					$temp
						.on('click', function(e) {
							e.preventDefault()
							if(!pid) return
							var img=new Image()
							img.onload=function(){
								$('.qrcodebox')
									.html('<img src="'+img.src+'">')
							}
							img.onerror=function(){
								var second=new Image()
								second.onload=function(){
									$('.qrcodebox')
										.html('<img src="'+second.src+'">')
								}
								second.onerror=function(){
									$('.qrcodebox')
										.html('图片加载失败')
								}
								second.src=path+pid+'.jpg'
							}
							img.src=path+pid+'.png'
							p.showImage()
						})
					$propertys.eq(10)
						.css('color','red')
						.append('未报到')
						.append($temp)
				}
			}
		},function(err){
			loadingHide();
		});
	}
	else if(userRole=='Admins'){
		misc.func.admin.get_admin({
			"pid":user.userInfo.pid
		},function(res){
			loadingHide();
			if(res.code=="0"){
				user.setAdminCookie(res);
				user.userInfo=user.currentUser=JSON.parse(misc.getCookie('userInfo'));
				user.userInfo.get=function(p){
					return user.userInfo[p];
				};
				$propertys.eq(0).append(user.userInfo.get('username'));
				$propertys.eq(1).append(user.userInfo.get('name'));
				$propertys.eq(2).append(user.userInfo.get('person'));
				$propertys.eq(3).append(user.userInfo.get('mobile'));
				$propertys.eq(4).append(user.userInfo.get('tel'));
				$propertys.eq(5).append(user.userInfo.get('address'));
			}
		},function(err){
			loadingHide();
		});
	}
};
p.showImage=function(src){
	Dialog.ShowDialog({
        title: '',
        otherBtns: [],
        cancelBtn: '关闭',
        content: '<div class="icon qrcodebox" style="background-image:url('+src+')">图片加载中...</div>'
	});
}
p.showMyQRCode = function(){
	qrcodeEle = document.getElementById("qrcode");
    var qrcode = new QRCode(qrcodeEle, {
        width: 13*fontSize,//设置宽高
        height: 13*fontSize
    });
 	var url = [location.protocol,'//',location.host,'/mobile/scanqrcode/?id=',user.currentUser?user.currentUser.pid:-1];
    qrcode.makeCode(url.join(''));
    setTimeout(function(){
    	qrcodeEle.style.visibility = 'visible';
    },200);
};