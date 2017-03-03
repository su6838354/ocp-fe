var p = {
    'page':1,
    'size':10
};
p.init = function(){
    p.page=parseInt(misc.getParam('page')) || 1;
    $j_pagenation = $('.j_pagenation');
    p.loadDatas();
    p.initEvent();
};
p.loadPagination = function(){
    pg.pageCount = p.maxPage; // 定义总页数(必要)
    pg.argName = 'page';  // 定义参数名(可选,默认为page)
    pg.element = $j_pagenation; // 文本渲染在那个标签里面
    pg.printHtml(1);
};
p.initEvent = function(){
    $('#j_create_new').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        if($('.cancel').length<=0){
            createRow('create');
        }else{
            alert('请先执行完当前的操作！');
        }
    });
    $('#search').on('click', function (e) {
        e.preventDefault();
        p.loadDatas();
    });
};
p.loadDatas = function(){
    var searchType = $('.search-type').val(),
        searchWord = $.trim($('#search-word').val()).toLowerCase();
    if(searchType=="type"){
        switch(searchWord){
            case '单位': searchWord='group';break;
            case '居委': searchWord='location';break;
            default: searchWord='';break;
        }
    }
    var param={
        "isDelete":"0",
        "isShow":"-1",
        "limit":p.size,
        "page_index":p.page
    };
    // if(searchWord){
    //     param[searchType]=searchWord;
    // }
    misc.func.admin.get_admins(param,function(res){
        if(res.code=="0"&&res.data){
            p.pagination=res.pagination;
            p.maxPage=p.pagination.page_count;
            $('#maxCount').text(p.pagination.count);
            datas=res.data;
            if(datas && datas.length>0){
                $('#datatable tbody').html(p.htmlDatas(datas));
                operateEvent();
                p.maxPage>=1 && $('.j_pagenation').show() && p.loadPagination();
            }
        }
        else{
            alert('没有数据哦')
        }
    },function(err){
        alert('没有数据哦')
    });
};
p.htmlDatas = function(datas){
    var arr = [];
    for(var i=0,l=datas.length;i<l;i++){
        arr.push(htmlRow(datas[i]));
    }
    return arr.join('');
};
function htmlRow(data){
    data.get=function(p){
        return data[p];
    };
    var s = data.get("isShow") == "0" ? '<div class="outter-block outter-border"><div class="circle-block boxshowdow"><div></div>':'<div class="outter-block colorGreen"><div class="circle-block boxshowdow pull-right"></div></div>';
    return ['<tr data-pid="',data.get("pid"),'" data-name="',data.get("name"),'">',
              '<td>',s,'</td>',
              '<td class="j_show_users">',data.get("username"),'</td>',
              '<td onclick="alert(',data.get("pwd"),')" class="" style="color:#4b8df8;cursor:pointer;">',data.get("name"),'</td>',
              '<td>',data.get("type")=="group"?"单位":"居委",'</td>',
              '<td>',data.get("address"),'</td>',
              '<td >',data.get("person"),'</td>',
              '<td>',data.get("mobile"),'</td>',
              '<td>',data.get("tel"),'</td>',
              // '<td>',misc.formatDateTime(data.createdAt,userObj.format2),'</td>',
              // '<td>',misc.formatDateTime(data.updatedAt,userObj.format2),'</td>',
            '</tr>'].join('');
}
function operateEvent(){
    $('#datatable div.circle-block').off().on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        if($this.hasClass('pull-right')){
            $this.removeClass('pull-right');
            $this.parent().removeClass('colorGreen').addClass('outter-border');
        }
        else{
            $this.addClass('pull-right');
            $this.parent().addClass('colorGreen').removeClass('outter-border');
        }
        var curTR=$(this).closest('tr'),
            pid=curTR.attr('data-pid');
        if(!pid){
          return false;
        }
        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.admin.get_admin({
          "pid": pid
        },function(res){
            if(res.code){
                alert('居委不存在！')
            }else if(res.data){
                var param=res.data;
                param["isShow"]=(param["isShow"]=="1")?"0":"1";
                misc.func.admin.update_admin(param,function(res){
                    $this.removeClass(misc.vars.disable);
                    if(res.code){
                        alert('操作失败！')
                    }else{
                        alert('操作成功！')
                    }
                },function(err){
                    alert('操作失败！')
                    $this.removeClass(misc.vars.disable);
                });
            }
        },function(err){
            alert('当前单位/居委不存在！')
        });
    });
}

function createLateEvent(){
    $('#datatable a.cancel').off().on('click', function (e) {
        e.preventDefault();
        $(this).parent().parent().remove();
    });
    $('#datatable a.add').off().on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var params = {
            'username': $('input.username').val(),
            'name': $('.name').val(),
            'type': $('.type').val(),
            'address': $('.address').val(),
            'person': $('.person').val(),
            'tel': $('.tel').val(),
            'mobile': $('.mobile').val()
        };
        for (var i in params){
            if(!params[i]){
                alert("请将信息填写完整！");
                return false;
            }
        }
        var params1={
            'password': misc.generateRandom(100000).toString(),//6位随机密码
            'userRole': "Admins",
            'isShow': '1',
        };
        var params2=$.extend(params1, params);
        params2['pwd']=params1.password;
        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.user.create_user_admin(params2,function(res){
            $this.removeClass(misc.vars.disable);
            if(res.code=="0"){
                location.reload();
            }else{
                alert("添加失败");
            }
        },function(err){
            $this.removeClass(misc.vars.disable);
            alert("添加失败");
        });
    });
}

function createRow() {
    var $tbody = $('tbody').eq(0),
        firstTR = $tbody.find("tr:first"),
        tempTR = $('<tr><td style="width:35px;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    
    if(firstTR.length==0){
      tempTR.appendTo($tbody);
    }else{
      tempTR.insertBefore(firstTR);
    }

    var tempTRTDs = tempTR.find('td');
    tempTRTDs.eq(0).html('<a class="add" href="">添加</a> <a class="cancel" href="">取消</a>');
    tempTRTDs.eq(1).html('<input class="username" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(2).html('<input class="name" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(3).html('<select class="type" style="width:90px;"><option value="">请选择</option><option value="group">单位</option><option value="location">居委</option></select>');
    tempTRTDs.eq(4).html('<input class="address" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(5).html('<input class="person" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(6).html('<input class="mobile" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(7).html('<input class="tel" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(8).html('');
    createLateEvent();
}
