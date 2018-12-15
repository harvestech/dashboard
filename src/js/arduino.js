var xmlHttp=createXmlHttpObject();

function createXmlHttpObject(){
 if(window.XMLHttpRequest){
	xmlHttp=new XMLHttpRequest();
 }else{
	xmlHttp=new ActiveXObject('Microsoft.XMLHTTP');
 }
 return xmlHttp;
}

function process(){
 if(xmlHttp.readyState==0 || xmlHttp.readyState==4){
   xmlHttp.open('GET','test.json',true);
   xmlHttp.onreadystatechange=handleServerResponse;
   xmlHttp.send(null);
 }
 setTimeout('process()',1000);
}

/* Функция парсинга массива JSON насосов и изменения элементов управления pumpState на странице */
function parsePumps(pumpsArray){
    var pumpStateArr = ["pumpState1", "pumpState2", "pumpState3", "pumpState4", "pumpState5"];
    for (var i = 0; i < pumpsArray.length; i++) {
		var pump = parseInt(pumpsArray[i]);
		document.getElementById(pumpStateArr[i]).classList.remove('text-success');
		document.getElementById(pumpStateArr[i]).classList.remove('text-danger');
		document.getElementById(pumpStateArr[i]).classList.add(pump ? "text-success" : "text-danger");
    }
}

/* Функция парсинга массива JSON насосов и изменения элементов управления pumpState на странице */
function parsePowers(powersArray){
    var powerStateArr = ["powerState1", "powerState2"];
    for (var i = 0; i < powersArray.length; i++) {
		var power = parseInt(powersArray[i]);
		document.getElementById(powerStateArr[i]).classList.remove('text-success');
		document.getElementById(powerStateArr[i]).classList.remove('text-danger');
        document.getElementById(powerStateArr[i]).classList.add(power ? "text-success" : "text-danger");
    }
}

function handleServerResponse(){
    if(xmlHttp.readyState==4 && xmlHttp.status==200){
       //JSON
        try {
            var myObj = JSON.parse(xmlHttp.responseText);
            
            document.getElementById('nowtime').innerHTML=myObj.nowtime;
            document.getElementById('runtime').innerHTML=myObj.runtime;

            document.getElementById('now_temp').innerHTML=myObj.now_temp;
            document.getElementById('now_ph').innerHTML=myObj.now_ph;
            document.getElementById('now_ec').innerHTML=myObj.now_ec;
            
            parsePumps(myObj.pumps);
            parsePowers(myObj.powers);
        } catch(e) {
           console.log(e); // error in the above string (in this case, yes)!
        }
     }
   }


/* Функция обновления и настроек графика из graph.json */
    updateChart('graph.json');
	function updateChart(sourcefile) {
		$.getJSON(sourcefile, function (externaldata) {
		chart = c3.generate({
			size: {
				height: 250
			},
			zoom: {
				enabled: true
			},
			point: {
				show: true
			},
			bindto: '#chart',
			data: {
			    json: externaldata,
				x: 'Time',
				xFormat: '%H:%M'
			},
			axis: {
				x: {
				  type: 'timeseries',
				  tick: {
					  format: '%H:%M'
				  }
				},
				y : {
					tick: {
						format: function (d) { return d; + '\xB0С'}
					}
				},
				//y2: {
				//	tick: {
				//		format: d3.format(".0%")
				//	}
				//},
				//y2: {
				//	tick: {
				//		format: function (d) { return d + ' ppm'; }
				//	}
				//},
				y2: {
					tick: {
						format: function (d) { return d + ' pH'; }
					}
				},
				y3: {
					tick: {
						format: function (d) { return d + ' EC'; }
					}
				}
			},
			tooltip: {
				format: {
					title: function (date) { return 'Время: ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); },
					value: function(value, ratio, id) {
						if( id=='T') 		return value + '\xB0С';
						//else if( id=='H') 	{var format = d3.format(".0%"); return format(value);}
						//else if( id=='CO2') 		return value + ' ppm';
						else if( id=='PH') 		return value + ' pH';
						else if( id=='EC') 		return value + ' EC';
					}
				}
			},
			color: {
				pattern: ['#eef73d', '#1f77b4', '#aec7e8', '#ff7f0e', '#5ce53d']
			}
		})
		});	
	}
	setInterval(function(){ updateChart('graph.json'); }, 60000);