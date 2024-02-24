var canvas = document.getElementsByTagName("canvas")[0];
canvas.width = 1000;
canvas.height = 1000;
var cubes = 3;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#d9bf9a";
var areaSize = 1000/cubes;
var cubeSize = areaSize*0.96;
ctx.translate(areaSize*0.02,areaSize*0.02);
var rats = [];
var points;
var hp;
var interval;
var t,t2;
var Player;
const fd = document.getElementById("fd");
const los = document.getElementById("lose");
const dis = document.getElementById("disappear");
var onlineMode = confirm("需要赏金版请点确认,仅娱乐请点取消");

window.onload = function(){
    if (onlineMode){
        var input = prompt("请输入你的赏金码如:88888","请输入你的赏金码如:88888");
        if(input == 56789){
            alert("欢迎大聪明!");
            setTimeout (function(){
                startGame();
				Player = "大聪明";
            },500);
        }else{
            alert("错误!请稍后再试");
            setTimeout (function(){
                startGame();
				onlineMode = false;
            },500);

        }
    }else{
        setTimeout (function(){
			startGame();
	    },500);
    }
};

function startGame(){
	drawPannel();
	initGame();
}
function initGame(){
	time = 0;
	points = 0;
	hp = 3;
	interval = 100;
	document.getElementsByTagName("span")[0].innerHTML = "SCORE:"+points;
	document.getElementsByTagName("span")[1].innerHTML = "HP:"+hp;
	document.getElementsByTagName("span")[2].innerHTML = "Level:"+interval;
	t = setInterval(function(){
		generateRats();
		maintanceRats();
	},interval);
}
function drawPannel(){
	for(var i=0;i<cubes;i++){
		for(var j=0;j<cubes;j++){

			var img = new Image();
			img.src = "resourses/ds.png";
			img.style.left = i*33.33 + "%";
			img.style.top = j*0.3*canvas.clientHeight + "px";
			img.addEventListener("mousedown",clicked);
			img.addEventListener('touchstart', touched);
			document.getElementsByTagName("div")[0].appendChild(img);
			rats.push(img);
		}
	}
}
function touched(){
    fd.play();
	chosen(this);
	var touch = event.touches[0];
	var rect = canvas.getBoundingClientRect();
	checkArea(touch.pageX - rect.left,touch.pageY - rect.top);
}
function clicked(){
    fd.play();
	chosen(this);
	var rect = canvas.getBoundingClientRect();
	checkArea(event.clientX - rect.left,event.clientY - rect.top);
}
function chosen(rat){
	if(rat.className == "active"){
		rat.classList.remove("active");
		points ++;
		document.getElementsByTagName("span")[0].innerHTML = "SCORE:"+points;
		interval -= interval*0.03>2?interval*0.03:interval*0.015;
		document.getElementsByTagName("span")[2].innerHTML = "Level:"+interval;
	}
}
function generateRats(){//产生地鼠的方法
	if(parseInt(Math.random()*100)%parseInt(((interval/12)>2?(interval/12):2))==0){
		document.getElementsByTagName("span")[2].innerHTML = "Level:"+interval;
		var ID = Math.ceil(Math.random()*8);
		if(rats[ID].className == ""){
			t2 = setTimeout(function(){
				rats[ID].classList.add("active");
				rats[ID].id = interval/4;
			},500);
		}
	}
}
function maintanceRats(){
	var activeRats = document.getElementsByClassName("active");
	for(var i=0;i<activeRats.length;i++){//用id表示剩余时间
		activeRats[i].id --;
		if(activeRats[i].id<0){//如果到时间了
			activeRats[i].classList.remove("active");//当前隐藏
			dis.play();
			hp --;//掉血
			interval *= 1.2;//回退一点游戏难度
			document.getElementsByTagName("span")[2].innerHTML = "Level:"+interval;
			document.getElementsByTagName("span")[1].innerHTML = "HP:"+hp;
			if(hp == 0){
				lose();
                los.play();
			}
		}
	}
}
function lose(){//如果输了
	clearInterval(t);//停止计时器，等待游戏重新开始
	clearTimeout(t2);
	setTimeout(function(){
        if (onlineMode){
            var save = confirm( Player+"在"+interval+"的难度(Level,越小越难)下打了"+points+"个捣蛋鬼。是否需要提交并上榜?");
            if (save){
				send();
                alert("你的数据已上传!将在12小时内被记录!");
                for(var i=0;i<rats.length;i++){
                    rats[i].classList.remove("active");
                }
                setTimeout(function(){
                    initGame();
                },500);
            }else{
                alert("菜,就多练");
                for(var i=0;i<rats.length;i++){
                    rats[i].classList.remove("active");
                }
                setTimeout(function(){
                    initGame();
                },500);
            }
        }else{
            alert("你在"+interval+"的难度(Level,越小越难)下打了"+points+"个捣蛋鬼。");
            for(var i=0;i<rats.length;i++){
                rats[i].classList.remove("active");
            }
            setTimeout(function(){
                initGame();
            },500);
        }
	},10);
}
//赏金版
function send() {
	$.post('https://apis.tianapi.com/robot/index',
		{
			key:'868ffe977d3b445b541e7e28acb51e41',
			question:'S---'+ Player + " " + points + " " + interval
		}
	)
}