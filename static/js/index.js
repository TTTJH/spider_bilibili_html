//----------------------------api-------------------------------------------
//ajax函数
function ajax(url, type,data){
    return (
        new Promise((resolve, reject) => {
            if (window.XMLHttpRequest)  
            {
            // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp=new XMLHttpRequest();
            }
            else
            {
            // IE6, IE5 浏览器执行代码
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            xmlhttp.onreadystatechange=function()
            {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                resolve(xmlhttp.responseText);
            }
            else if(xmlhttp.status== 500 || xmlhttp.status== 404){
                reject("error!!!")
            }
            }
            xmlhttp.open(type,url,true);
            xmlhttp.send();
        })
    )
}
//获取排行榜ajax
let getRanking = (num) => {
    return ajax(`http://172.30.66.238:5000/api/ranking/${num}`, "GET")
}
//根据bc_cid获取弹幕慈云图
let getDanmu = (bv_cid) => {
    return ajax(`http://172.30.66.238:5000/api/danmu/${bv_cid}`, "POST")
}

//---------------------------主要函数------------------------------------------
//生成元素函数
function createElement(element,className = [],attr = null){
    let resultElement = document.createElement(element)

    className
    ?
    className.forEach((item) => {
        resultElement.className += `${item} `
    })
    :
    null

    if(attr){
        element == 'img'
        ?
        resultElement.src = attr
        :
        0
    }    
    return resultElement
}

//getRanking结果生成函数，dom操作都在此处
function createDom(num){
    //获取数据库data
    getRanking(num)
    .then(val =>{
        ranking = JSON.parse(val).data.ranking
        
        console.log(ranking)
        //抓取dom   
        let cardBox = document.querySelector(".card-Box")
    
        //隐藏loading-card
        let loadingcard = document.querySelector(".loading-card")
        loadingcard.className += " hidden "
    
        //抓取mabu
        let mabu = document.querySelector(".mabu")
        //为mabu绑定单机消失事件
        mabu.onclick = () => {
            mabu.classList.add("hidden")
        }
    
        let danmubox = document.querySelector(".danmu-box")
    
        //取消冒泡
        danmubox.onclick = (event) => {
            event.cancelBubble = true
        }
    
        ranking.forEach((item, index) => {
            let cardbox = createElement(
                "div",
                ["card-box", "animate__animated", "animate__flipInY"]    
            )
    
            let card = createElement(
                "div",
                ["card"]
            )
    
            let eyesbox = createElement(
                "div",
                ["eyes-box"]
            )
    
            let eye1 = createElement(
                "div",
                ["eye"]
            )
    
            let eye2 = createElement(
                "div",
                ["eye"]
            )
    
            let linebox = createElement(
                "div",
                ["line-box"]
            )
    
            let emoji = createElement(
                "p",
                ["emoji"]
            )
    
            emoji.innerHTML = "ㅅ"
    
            let videoimg = createElement(
                "img",
                ["video-img","hidden","absolute"],
                `https://images.weserv.nl/?url=${item.bv_pic}`
            )

            let loadingimg = createElement(
                "img",
                ["loading-img"],
                `./static/images/loading.gif`
            )
    
            let dotbox = createElement(
                'div',
                ["dot-box"]
            )
    
            let dot1 = createElement(
                "div",
                ["dot"]
            )
    
            let dot2 = createElement(
                "div",
                ["dot", "dot-danmu"],
            )
    
            let dot3 = createElement(
                "div",
                ["dot"]
            )
    
            let iconimg1 = createElement(
                "img",
                [],
                "./static/images/play.png"
            )
    
            let iconimg2 = createElement(
                "img",
                [],
                "./static/images/message.png"
            )
    
            let iconimg3 = createElement(
                "img",
                [],
                "./static/images/user.png"
            )
    
            let span1 = createElement(
                "span"
            )
    
            let span2 = createElement(
                "span"
            )
    
            let span3 = createElement(
                "span"
            )
    
            let title = createElement(
                "p",
                ['title']
            )
    
            //操作Dom
            span1.innerHTML = `${item.bv_players}次`
            span2.innerHTML = `${item.bv_comments}枚`
            span3.innerHTML = `${item.bv_up}`
            title.innerHTML = `${item.bv_title}`
    
            dot1.appendChild(iconimg1)
            dot1.appendChild(span1)
            dot2.appendChild(iconimg2)
            dot2.appendChild(span2)        
            dot3.appendChild(iconimg3)
            dot3.appendChild(span3)
                        
            dotbox.appendChild(dot1)
            dotbox.appendChild(dot2)
            dotbox.appendChild(dot3)
    
            eyesbox.appendChild(eye1)
            eyesbox.appendChild(eye2)
    
    
            card.appendChild(eyesbox)
            card.appendChild(linebox)
            card.appendChild(emoji)
            card.appendChild(loadingimg)
            card.appendChild(videoimg)
            card.appendChild(title)
            card.appendChild(dotbox)
    
            cardbox.appendChild(card)
            cardBox.appendChild(cardbox)
    
    
        });
        let dot2s = document.querySelectorAll(".dot-danmu")
        let videoimgs = document.querySelectorAll(".video-img")
        let loadingimgs = document.querySelectorAll(".loading-img")
        //为dot2绑定显示抹布事件
        dot2s.forEach((item ,index)=> {
            item.onclick = () => {
                //显示抹布
                mabu.classList.remove("hidden")
                mabu.classList.add("show")
                //删除上一次danmuimg
                let img = document.querySelector(".danmu-img")
                if(img){
                    danmubox.removeChild(img)
                }
                getDanmu(ranking[index].bv_cid)
                .then(val => {
                    danmuimgurl = JSON.parse(val).data.url
                    let danmuimg = createElement(
                        "img",
                        ["danmu-img"],
                        `http://172.30.66.238:5000/${danmuimgurl}`
                    )
                    danmubox.appendChild(danmuimg)
                })
                .catch(err => {
                    alert("出现了问题！")
                })
            }
        })
    
        //为videoimg绑定b站跳转事件
        videoimgs.forEach((item, index) => {
            item.onclick = () => {
                window.location.href = `${ranking[index].bv_url}`
            }
        })
    
        loadingimgs.forEach((item, index) => {
            videoimgs[index].onload = function(){
                videoimgs[index].classList.remove("hidden")
                videoimgs[index].classList.add("show")
                videoimgs[index].classList.remove("absolute")
                item.parentNode.removeChild(item)
            }
        })
    })
    .catch(err => {
        alert("出现了问题，请稍候再试")
    })
}

//右下角按钮函数
function btnfun(){
    let btn = document.querySelector(".handle-btn")
btn.onclick = function(){
    // 先清除现有dom
    let cardbox = document.querySelectorAll(".card-box")
    let loadingcard = document.querySelector(".loading-card")
    loadingcard.classList.remove("hidden")
    loadingcard.classList.add("show2")
    //展示loading-gif
    cardbox.forEach((item, index) => {
        item.parentNode.removeChild(item)
    })
    //执行getRanking(0)
    createDom(0)
}

let btn2 = document.querySelector(".handle-btn2")
btn2.onclick = function(){
    let mabu = document.querySelector(".mabu")
    let danmubox = document.querySelector(".danmu-box")
    //显示抹布
    mabu.classList.remove("hidden")
    mabu.classList.add("show")
    //删除上一次danmuimg
    let img = document.querySelector(".danmu-img")
    if(img){
        danmubox.removeChild(img)
    }
    let danmuimg = document.createElement("img")
    danmuimg.className = "danmu-img"
    danmuimg.src = 'http://172.30.66.238:5000/static/ranking_tag.png'
    danmubox.appendChild(danmuimg)
}

}

//--------------------------handle-------------------------------------------
//总数据
let ranking = []

//开局执行getRanking(1)
createDom(1)

//右下角按钮功能函数
btnfun()


















