var p = {
    'page':1,
    'size':10
};
p.init = function(){
    $j_pagenation=$('.j_pagenation');
    p.page=misc.getParam('page')||1;
    p.page=parseInt(p.page);
    p.loadDatas();
    p.initEvent();
};
p.loadPagination = function(){
  pg.pageCount=p.maxPage; // 定义总页数(必要)
  pg.argName='page';  // 定义参数名(可选,默认为page)
  pg.element=$j_pagenation; // 文本渲染在那个标签里面
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
        searchWord = $.trim($('#search-word').val());
    var param={
        "limit":p.size,
        "page_index":p.page
    };
    param[searchType]=searchWord;
    if(userObj.currentUser.get("userRole")=="Admins"){
        param["admin"]=userObj.currentUser.pid;
    }
    misc.func.activity.get_tags(param,function(res){
        if(res.code=="0"&&res.data){
            p.pagination=res.pagination;
            p.maxPage=p.pagination.page_count;
            $('#maxCount').text(p.pagination.count);
            ds=res.data;
            $('#datatable tbody').html(p.htmlDatas(ds));
            p.maxPage>=1 && p.loadPagination();
            operateEvent();
        }else{
            alert('出错啦')
        }
    },function(err){
        alert('出错啦')
    });
};
p.htmlDatas = function(datas){
  var arr = [];
  for(var i=0,l=datas.length;i<l;i++){
    arr.push(htmlRow(datas[i],i));
  }
  return arr.join('');
};
function htmlRow(data,idx){
    data.get=function(prop){
        return data[prop];
    };
    var del = '<a class="del_act" style="margin-left:10px;" href="javascript:;">删除</a>';
    var s = data.get("isShow") == "0" ? '<div style="float:left !important;" class="outter-block outter-border"><div class="circle-block boxshowdow"></div></div>':'<div style="float:left !important;" class="outter-block colorGreen"><div class="circle-block boxshowdow pull-right"></div></div>';
    return ['<tr data-name="',data.get("txt"),'" data-id="',data.id,'">',
              '<td>',del,'</td>',
              '<td class="" style="color:#4b8df8;cursor:pointer;">',data.get("txt"),'</td>',
              '<td>',misc.formatDateTime(new Date(data.createdAt),userObj.format),'</td>',
            '</tr>'].join('');
}
function operateEvent(){
    $('#datatable a.del_act').off().on('click', function (e) {
        e.preventDefault();
        if(confirm('不可撤销，确认删除该标签？')){
          var $this=$(this);
          curTR=$this.closest('tr'),
          id=curTR.attr('data-id');
          id=parseInt(id);
          if(!id){
            return false;
          }
          misc.func.activity.delete_tags({
              "tag_ids": [id]
          },function(res){
              if(res.code=="0"){
                curTR.fadeOut('fast', function() {});
              }else{
                alert("删除失败");
              }
          },function(err){
              alert("删除失败");
          });
          
        }

    });
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
        id = curTR.attr('data-id');
        if(!id){
          return false;
        }

        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.activity.get_activity({
          "objectId": id
        },function(res){
          if(res.code){
            alert('当前活动不存在！')
          }else if(res.data){
              activity=res.data;
              if(activity && activity.objectId){
                var param2={
                  "title":activity.title,
                  "content":activity.content,
                  "place":activity.place,
                  "limit":activity.limit,
                  "admin":activity.admin.pid,
                  "objectId":activity.objectId,
                  "isShow":activity.isShow,
                  "isDelete":activity.isDelete
                };
                param2["isShow"]=(param2["isShow"]=='1')?'0':'1';

                misc.func.activity.update_activity(param2,function(res){
                    $this.removeClass(misc.vars.disable);
                    if(res.code=="0"&&res.data){
                      alert("操作成功")
                    }else{
                      alert("操作失败");
                    }
                },function(err){
                    $this.removeClass(misc.vars.disable);
                    alert("操作失败");
                });
              }
          }
        },function(err){
            alert('当前活动不存在！')
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
            "txt": $('input.txt').val()
        };
        for (var i in params){
          if(!params[i]){
            alert("请将信息填写完整！");
            return false;
          }
        }
        params["id"]=0;
        if($this.hasClass(misc.vars.disable)){
            return false;
        }
        $this.addClass(misc.vars.disable);
        misc.func.activity.add_update_tag(params,function(res){
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
        tempTR = $('<tr><td style="width:35px;"></td><td></td><td></td></tr>');
    
    if(firstTR.length==0){
      tempTR.appendTo($tbody);
    }else{
      tempTR.insertBefore(firstTR);
    }

    var tempTRTDs = tempTR.find('td');
    tempTRTDs.eq(0).html('<a class="add" href="">添加</a> <a class="cancel" href="">取消</a>');
    tempTRTDs.eq(1).html('<input class="txt" type="text" style="width: 270px !important;background: #ffffff;" value="">');
    tempTRTDs.eq(2).html('');
    createLateEvent();
}
