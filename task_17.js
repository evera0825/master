/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

//跨浏览器时间跟踪
/**
 * addEventListener:监听DOM元素的事件
 * obj：监听对象
 * event：监听函数类型，如click，mouseover
 * func：监听函数
 * 
 */
function addEventHandler(obj,event,func){
	if(obj.addEventListener){
		obj.addEventListener(event,func,false);
	} else if(obj.attachEvent){
		obj.attachEvent("on" +　event,func);
	} else{
		obj["on" + event] = func;
	}
}


// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

var cityselet = document.getElementById("city-select");
var formgratime = document.getElementById("form-gra-time");
var aqichartwrap = document.getElementsByClassName("aqi-chart-wrap")[0];

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
   var color='',text='';
   for ( var item in chartData ) {
   	 if(chartData[item] <= 100){
   	 	color = '#008100';
   	 } else if (chartData[item] > 100 && chartData[item]<=200 ) {
   	 	color = '#0100FE';
   	 } else if (chartData[item] > 200 && chartData[item]<=300 ) {
   	 	color = '#F80605';
   	 } else if (chartData[item] > 300 && chartData[item]<=400 ) {
   	 	color = '#82007F';
   	 } else {
   	 	color = '#000';
   	 }
   	 
   	 text += '<div title="'+item+":"+chartData[item]
   	 +'" style="height:'+chartData[item]+'px; margin-left:3px; border:none; background-color:'
   	 +color+'"></div>';
   }
	aqichartwrap.innerHTML = text;
}


  

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
	if (pageState.nowGraTime == this.value) {
		return;
	} else { 
		pageState.nowGraTime = this.value;
	}
  // 设置对应数据
	initAqiChartData();
  // 调用图表渲染函数
  	renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
	if (pageState.nowSelectCity == this.value) {
		return;
	} else {
		pageState.nowSelectCity = this.value;
	}
  // 设置对应数据
		initAqiChartData();
  // 调用图表渲染函数
  		renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var pageradio = formgratime.getElementsByTagName("input");
	console.log(pageradio);
	for (var i in pageradio){
		addEventHandler( pageradio[i],'click',graTimeChange );	
	}
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var city = '';
  for(var i in  aqiSourceData){
  	 city += '<option>' + i + '</option>';  	
  }
  cityselet.innerHTML = city;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(cityselet,'click',citySelectChange);
}


/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowcitydata = aqiSourceData[pageState.nowSelectCity]; 
  
  //nowCityData是确定的一个城市的92天降水数组，key是日期，nowCityData[key]是降水量
 
 //如果日期粒度选择日
  if (pageState.nowGraTime == 'day') {
  	chartData = nowcitydata;
  }
  //如果日期粒度选择周
   if (pageState.nowGraTime =='week') {
   	chartData = {};
   	var countSum = 0; daySum = 0; week = 0;
   	for ( var item in nowcitydata ) {
   		countSum += nowcitydata[item];
   		daySum ++;
   		if (  (new Date(item)).getDay() ==6 ) {
   			week ++;
   			chartData["第" + week +"周"] = Math.floor(countSum/daySum);
   			countSum = 0;
   			daySum = 0;
   		}
   	}
   	//保证最后一周若不满也能算一周
   	if (daySum !=0){
   		week++;
   		chartData["第" + week +"周"] = Math.floor(countSum/daySum);
   	}
   }
   
   //如果日期粒度选择月
   if (pageState.nowGraTime =='month') {
   	  chartData ={};
   	  var countSum = 0; daySum = 0; month = 0;
   	  for ( var item in nowcitydata ) {
   	  	countSum += nowcitydata[item];
   	  	daySum ++;
   	  	if ( (new Date(item)).getMonth() !== month )   {
   	  		month++;
   	  		chartData["第" + month + "月"] = Math.floor(countSum/daySum);
   	  		countSum = 0;
   	  		daySum = 0;
   	  	}
   	  }
   	  if ( daySum !==0) {
   	  	month ++;
   	  	chartData["第" + month + "月"] = Math.floor(countSum/daySum);
   	  }
   }
 
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
