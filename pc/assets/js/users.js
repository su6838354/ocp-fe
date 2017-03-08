p={
    'page': 1,
    'size': 10
};
p.init=function(){
    p.page=parseInt(misc.getParam('page'))||1;
    $j_pagenation=$('.j_pagenation');
    p.loadDatas();
    p.initEvent();
};
p.loadPagination=function(){
    pg.pageCount=p.maxPage; // 定义总页数(必要)
    pg.argName='page';  // 定义参数名(可选,默认为page)
    pg.element=$j_pagenation; // 文本渲染在那个标签里面
    pg.printHtml(1);
};
p.initEvent=function(){
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
  // var type=p.admin.get("type"),
  //     adminId=userObj.currentUser.pid,
  $('#datatable tbody').empty();
  $j_pagenation.empty();
  var cb=p.showUsers;
  var searchType = $('.search-type').val(),
      searchWord = $.trim($('#search-word').val());
    var param={
        "isShow": "-1",
        "limit": p['size'],
        "page_index": p['page'],
        "group": "",
        "location":"",
        "flagNumber": "",
        "mobile": "",
        "idcard": "",
        "realname": "",
        "username": "",
        "group__name":"",
        "location__name":"",
        "order_by": "createdAt"
        // "order_by": "-flagNumber"
    };
    param[searchType]=searchWord.toLowerCase();
    misc.func.user.get_users(param,function(res){
        if(res.code=="0"&&res.data){
            p.pagination=res.pagination;
            p.maxPage=p.pagination.page_count;
            $('#maxCount').text(p.pagination.count);
            datas=res.data;
            if(datas && datas.length>0){
                cb && cb(datas);
            }
        }
        else{
            alert('没有数据哦')
        }
    },function(err){
        alert('没有数据哦')
    }); 
};
p.showUsers = function(datas){
    $('#datatable tbody').html(p.htmlDatas(datas));
    operateEvent();
    p.maxPage>=1 && $j_pagenation.show() && p.loadPagination();
};
p.htmlDatas = function(datas){
    var arr = [];
    for(var i=0,l=datas.length;i<l;i++){
        arr.push(htmlRow(datas[i]));
    }
    return arr.join('');
};
function htmlRow(data){
    data.get=function(d){
        return data[d];
    };
    var cki = data.get("checkin"),
    cki=eval(cki),
    cki_str = cki&&cki.length>1?[cki[1],"-",cki[2],"-",cki[3]," ",cki[4]].join(""):"未报到";
    var s = data.get("isShow") == "0" ? '<div class="outter-block outter-border"><div class="circle-block boxshowdow"><div></div>':'<div class="outter-block colorGreen"><div class="circle-block boxshowdow pull-right"><div></div>';
    return ['<tr data-pid="',data.get("pid"),'">',
              '<td>',s,'</td>',
              '<td>',data.get("flagNumber"),'</td>',
              '<td class="j_starmark">',data.get("username"),'</td>',
              '<td class="j_view" style="color:#4b8df8;cursor:pointer;max-width: 60px;">',data.get("realname"),'</td>',
              '<td>',data.get("sex")=="男"?"男":"女",'</td>',
              '<td>',data.get("idcard"),'</td>',
              '<td style="max-width:100px;">',data.get("mobile"),'</td>',
              '<td>',data.get("political")=="团员"?(misc.getAge(data.get('birth'))<=28 ?"团员":'青年'):data.get("political").replace('S',''),'</td>',
              '<td>',misc.getAge(data.get('birth')),'岁</td>',
              '<td>',(data.get("group__name")||"暂无"),'</td>',
              '<td>',(data.get("location__name")||"暂无"),'</td>',
              // '<td style="max-width:120px;">',data.get("job"),'</td>',
              // '<td>',(data.get(p.admin.get("type")=="group"?"location":"group")[2]||"暂无"),'</td>',
              '<td>',cki_str,'</td>',
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
        var curTR = $(this).closest('tr'),
        pid = curTR.attr('data-pid');
        if(!pid){
          return false;
        }
        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.user.get_user({
          "pid": pid
        },function(res){
            if(res.code){
                alert('当前用户不存在！')
            }else if(res.data){
                var param=res.data;
                param["isShow"]=(param["isShow"]=="1")?"0":"1";
                param["group"]=param["group"]?param["group"]["pid"]:"";
                param["location"]=param["location"]?param["location"]["pid"]:"";
                misc.func.user.update_user(param,function(res){
                    $this.removeClass(misc.vars.disable);
                    if(res.code){
                        alert('操作失败！')
                    }else{
                        alert('操作成功！')
                    }
                },function(err){
                    $this.removeClass(misc.vars.disable);
                    alert('操作失败！')
                });
            }
        },function(err){
            alert('当前用户不存在！')
        });
    });
    $('#datatable .j_view').off().on('click', function (e) {
        e.preventDefault();
        window.open('user.html?id='+$(this).parent().attr('data-pid')+'#user');
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
            'idcard': $('.idcard').val(),
            'flagNumber': $('input.flagNumber').val(),
            'username': $('input.username').val(),
            'realname': $('.realname').val(),
            'sex': $('.sex').val(),
            'political': $('.political').val(),
            'mobile': $('.mobile').val()
        };
        var birthArr = params.idcard.substring(6,14).split('');
        params.birth = new Date([birthArr[0],birthArr[1],birthArr[2],birthArr[3],'/',birthArr[4],birthArr[5],'/',birthArr[6],birthArr[7]].join(''));
        params.username = params.username+params.idcard.substring(14).toLowerCase();
        for (var i in params){
          if(!params[i]){
            alert("请将信息填写完整！");
            return false;
          }
        }
        params["birth"]=params.birth.toISOString();
        var params1={
            'password': '123456',//6位固定密码
            'userRole': "Users",
            'isShow': '1',
        };
        var params2=$.extend(params1, params);

        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.user.create_user_admin(params2,function(res){
            $this.removeClass(misc.vars.disable);
            debugger
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
        tempTR = $('<tr><td style="width:35px;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    
    if(firstTR.length==0){
      tempTR.appendTo($tbody);
    }else{
      tempTR.insertBefore(firstTR);
    }

    var tempTRTDs = tempTR.find('td');
    tempTRTDs.eq(0).html('<a class="add" href="">添加</a> <a class="cancel" href="">取消</a>');
    tempTRTDs.eq(1).html('<input class="flagNumber" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(2).html('<input class="username" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(3).html('<input class="realname" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(4).html('<select class="sex" style="width:90px;"><option value="">请选择</option><option selected="selected" value="男">男</option><option value="女">女</option></select>');
    tempTRTDs.eq(5).html('<input class="idcard" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(6).html('<input class="mobile" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(7).html('<input class="political" type="text" style="width: 70px !important;background: #ffffff;" value="">');
    createLateEvent();
}
