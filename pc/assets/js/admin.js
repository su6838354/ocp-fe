var p = {
    'className': 'Admins'
};
p.init = function(){
    p.initVar();
    p.loadAdmins(p.loadDatas);
    p.initEvent();
};
p.initVar = function(){
    obj = {};
    obj.pid = misc.getParam('id')||userObj.currentUser.pid;
};

p.loadAdmins=function(cb){
    var param={
        "isDelete":"0",
        "isShow":"1",
        "limit":1000,
        "page_index":1,
        "type":'group'
    };
    if(userObj.currentUser.group_type==1){
        param['group_type']=1
    }
    misc.func.admin.get_admins(param,function(res){
        if(res.code=="0"){
            admins=res.data;
            admins=misc.objAZSortFun(admins,'name');
            var l=admins.length;
            if(l>0){
                var arr=[];
                for (var i=0;i<l;i++) {
                    var admin=admins[i];
                    admin.get=function(p){
                        return admin[p];
                    };
                    var s=['<option value="',admin.get("pid"),'">',admin.get('name'),'</option>'].join('');
                    arr.push(s)
                }
                $('.j_parent').append(arr.join(''))
                cb && cb();
            }
        }else{
            alert("服务器不给力哦！");
        }
    },function(err){
        alert("服务器不给力哦！");
    })
};
p.renderData=function(){

    obj['group_type']=obj.get('group_type')||0;
    obj['parentId']=obj.get('parentId')||"";
    // obj['flagNumber']=obj.get('flagNumber')||"";


    // $('.createdAt').text(misc.formatDateTime(obj['createdAt'],userObj.format));
    // $('.updatedAt').text(misc.formatDateTime(obj['updatedAt'],userObj.format));

    $('.name').val(obj.get('name'));
    $('.type').val(obj.get('type'));
    $('.tel').val(obj.get('tel'));
    $('.mobile').val(obj.get('mobile'));
    $('.address').val(obj.get('address'));
    $('.username').val(obj.get('username'));
    $('.person').val(obj.get('person'));

    $('.group_type').val(obj.get('group_type'));
    if(obj.get('group_type')==2){
        $('.j_parent').val(obj.get('parentId'));
    }

    if(userObj.currentUser.get('userRole')=='SuperAdmin'){
        $('input,select,textarea').removeAttr('disabled')
        // $('.name').removeAttr('disabled');
        // $('select').removeAttr('disabled');
        // $('.type').attr('disabled','disabled');
    }
    if(userObj.currentUser.group_type==1){
        $('.type').attr('disabled','disabled');
    }
    if(obj.get('type')=="group"){
    // if(userObj.currentUser.type=='group'&&userObj.currentUser.group_type==1){
        $('.group-type-li').removeClass('hide')
        $('.parent-li').removeClass('hide')
        $('.j_parent').val(obj.get('parentId'))
    }
    if(obj.group_type==1){
        $('.parent-li').addClass('hide')
        $('.j_parent').val('')
    }
};
p.loadDatas = function(){
    misc.func.admin.get_admin({
        "pid":obj.pid
    },function(res){
        if(res.code=="0"&&res.data){
            obj=res.data;
            obj.get=function(p){
                return obj[p];
            };
            p.renderData();
        }else{
            alert('该账号不存在');
        }
    },function(err){
        alert('该账号不存在');
    });
};

p.initEvent = function(){
    $('.group_type').change(function(e) {
        e.stopPropagation();
        if($('.group_type').val()=="2"){
            $('.parent-li').removeClass('hide')
            $('.j_parent').val(obj.get('parentId'))
        }else{
            $('.parent-li').addClass('hide')
            $('.j_parent').val('')
        }
    });
  $('.j_btn_modify').on('click',function(e){
    e.stopPropagation();
    e.preventDefault();
    $('.j_btn_modify').html('保存中...');
    var $this=$(this);
    var span_el = $this.siblings('div').first();
    // var param=$.extend({},userObj.currentUser);
    var param=$.extend({},obj);
    delete param["userRole"];
    delete param["get"];
    param["tel"]=$.trim($('.tel').val());
    param["mobile"]=$.trim($('.mobile').val());
    param["address"]=$.trim($('.address').val());
    param["person"]=$.trim($('.person').val());
    
    if(userObj.currentUser.get('userRole')=='SuperAdmin'||(userObj.currentUser.type=='group'&&userObj.currentUser.group_type==1)){
        // param["username"]=$.trim($('.username').val());
        // param["type"]=$.trim($('.type').val());
        param["name"]=$.trim($('.name').val());
    }
    param["createdAt"]=param["createdAt"];
    param["updatedAt"]=new Date().toISOString();
    param["group_type"]=parseInt($('.group_type').val())
    param["parentId"]=$('.j_parent').val()||"";
    if($this.hasClass(misc.vars.disable)){
        return false;
    }
    $this.addClass(misc.vars.disable);
    misc.func.admin.update_admin(param,function(res){
        $('.j_btn_modify').html('保存');
        $this.removeClass(misc.vars.disable);
        if(res.code=="0"&&res.data){
            span_el.text('修改成功').show().fadeOut(800);
        }else{
            span_el.text('修改失败').show().fadeOut(800);
        }
    },function(err){
        $this.removeClass(misc.vars.disable);
        span_el.text('修改失败').show().fadeOut(800);
    });
  });
};

