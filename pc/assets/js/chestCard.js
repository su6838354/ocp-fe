p={
	'size':2
}
p.init=function(){
    $j_pagenation=$('.j_pagenation');
    p.page=misc.getParam('page');
    p.page=parseInt(p.page)||1;
    p.political=misc.getParam('political')||"单位";
    p.political=decodeURIComponent(p.political);
    p.id=misc.getParam('id');
    p.flagNumber=misc.getParam('flagNumber');
    p.username=misc.getParam('username');
    p.loadUsers();
    template={
    	items:function(ds){
    		return ds.map(function(d,i){
    			return template.item(d,i)
    		}).join('')
    	},
    	item:function(d,i){
    		return [
				'<div class="icon chestcard ">',
					'<div class="qrcode"></div>',
					'<div class="flagnumber">',d.flagNumber,'</div>',
					'<div class="name">',d.realname,'</div>',
				'</div>'
			].join('')
    	}
    }
}
p.loadPagination = function(){
	pg.pageCount=p.maxPage; // 定义总页数(必要)
	pg.argName='page';  // 定义参数名(可选,默认为page)
	pg.element=$j_pagenation; // 文本渲染在那个标签里面
	pg.printHtml(1);
}
	// ~function loadUsers(cb){}()
p.loadUsers=function(){
    var param={
		"isShow": "1",
		"limit": p.size,
		"order_by": "-flagNumber"
        // "order_by": "-updatedAt"
	}
    if(p.id){
        param["pid"]=p.id
    }else if(p.flagNumber){
        param["flagNumber"]=p.flagNumber
    }else if(p.username){
        param["username"]=p.username
    }else{
        param["page_index"]=p.page
        param["political"]=p.political
    }
	misc.func.user.get_users(param,function(res){
        if(res.code=="0"&&res.data){
            p.pagination=res.pagination;
            p.maxPage=p.pagination.page_count;
            $('#maxCount').text(p.pagination.count);
            datas=res.data;
            datas.map(function(d,i){
            	$('.chestcard-box').append(template.item(d,i));
    			p.showMyQRCode(i,d.pid)
    		}).join('')
            p.maxPage>=1&&p.loadPagination();
        }
        else{
            alert('没有数据哦')
        }
    },function(err){
        alert('没有数据哦')
    })
}
p.showMyQRCode=function(index,id){
	qrcodeEle = document.getElementsByClassName('qrcode')[index];
    var qrcode = new QRCode(qrcodeEle, {
        width: 173,//设置宽高
        height: 173
    });
 	var url = ['http://card.weichongming.com/mobile/scanqrcode/?id=',id];
    qrcode.makeCode(url.join(''));
    qrcodeEle.style.visibility='visible';
}

// p.loadUsers()	