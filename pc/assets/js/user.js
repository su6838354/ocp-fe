p={};
p.init=function(){
    p.initVar();
    p.loadAdmins(p.loadDatas);
    p.initEvent();
};
p.initVar=function(){
    obj={};
    obj.pid=misc.getParam('id') || '';
    $group=$('.group');
    $location=$('.location');
    admins=[];
};
p.loadAdmins=function(cb){
    misc.func.admin.get_admins({
        "isDelete":"0",
        "isShow":"1",
        "limit":1000,
        "page_index":1
    },function(res){
        if(res.code=="0"){
            admins=res.data;
            admins=misc.objAZSortFun(admins,'name');
            var l=admins.length;
            if(l>0){
                for (var i=0;i<l;i++) {
                  var admin=admins[i];
                  admin.get=function(p){
                      return admin[p];
                  };
                  var s=['<option value="',admin.get("pid"),'">',admin.get('name'),'</option>'].join('');
                  if(admin.get('type')=='group'){

                      if(userObj.currentUser.userRole=='SuperAdmin'||admin.pid==userObj.currentUser.pid||admin.parentId==userObj.currentUser.pid){
                          $group.append(s);
                      }
                  }
                  else if(admin.get('type')=='location'){
                      $location.append(s);
                  }
                }
                cb && cb();
            }
        }else{
            alert("服务器不给力哦！");
        }
    },function(err){
        alert("服务器不给力哦！");
    })
};
p.loadDatas = function(){
    misc.func.user.get_user({
      "pid": obj.pid
    },function(res){
        if(res.code){
            alert('当前用户不存在！')
        }else if(res.data){
            obj=res.data;
            obj.get=function(p){
                return obj[p];
            };
            // $('.createdAt').text(misc.formatDateTime(obj['createdAt'],userObj.format));
            // $('.updatedAt').text(misc.formatDateTime(obj['updatedAt'],userObj.format));
            $('.job').val(obj.get('job'));
            $('.political').val(obj.get("political")=="团员"?(misc.getAge(obj.get('birth'))<=28 ?"团员":'青年'):obj.get("political"));
            // $('.political').val(obj.get("political")=="团员"?(misc.getAge(obj.get('birth'))<=28 ?"团员":'青年'):(userObj.currentUser.get('userRole')=='Admins'?obj.get("political").replace('S',''):obj.get("political")));
            $('.mobile').val(obj.get('mobile'));
            $('.address').val(obj.get('address'));
            
            $('.realname').val(obj.get('realname'));
            $('.sex').val(obj.get('sex'));
            $('.idcard').val(obj.get('idcard'));
            $('.username').val(obj.get('username'));
            $('.flagNumber').val(obj.get('flagNumber'));
            $('.age').val(misc.getAge(obj.get('birth'))+' 岁');
            $('.birth').val(misc.formatDateTime(new Date(obj.get('birth')),misc.formatType['3']));
            p.location=obj.get('location');
            if(p.location){
                $location.val(p.location.pid);
            }
            p.group=obj.get('group');
            if(p.group){
                $group.val(p.group.pid);
            }

            // if(userObj.currentUser.get('userRole')!=='SuperAdmin'){
            //   $('input,select,textarea').attr('disabled', 'disabled');

            //   if(p.groupArr && p.groupArr.length>0 && p.groupArr[0]==userObj.currentUser.id){
            //     $('.political,.job,.address,.mobile').removeAttr('disabled');
            //   }
            //   else{
            //     $('.j_btn_modify').parent().remove();
            //   }
            // }

        }
    },function(err){
        alert('当前用户不存在！')
    });
};
p.initEvent=function(){
    $('.j_btn_modify').on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        var $this=$(this);
        var span_el = $this.siblings('span').first();
        var param=$.extend({},obj);
        delete param["get"];
        param["job"]=$.trim($('.job').val());
        param["mobile"]=$.trim($('.mobile').val());
        param["address"]=$.trim($('.address').val());
        param["political"]=$.trim($('.political').val());
        param["realname"]=$.trim($('.realname').val());
        param["sex"]=$.trim($('.sex').val());
        param["flagNumber"]=$.trim($('.flagNumber').val());
        param["group"]=$group.val();
        param["location"]=$location.val();
        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.user.update_user(param,function(res){
            $this.removeClass(misc.vars.disable);
            if(res.code){
                span_el.text('修改失败').show().fadeOut(800);
            }else{
                span_el.text('修改成功').show().fadeOut(800,function(){
                    location.reload();
                });
            }
        },function(err){
            $this.removeClass(misc.vars.disable);
            span_el.text('修改失败').show().fadeOut(800);
        });
    });
};

