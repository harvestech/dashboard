var xmlHttp=createXmlHttpObject();


function microAjax(B,A){
    this.bindFunction=function(E,D) {
        return function() {
            return E.apply(D,[D]);
        };
    };
    this.stateChange=function(D) {
        if (this.request.readyState == 4) {
            this.callbackFunction(this.request.responseText);
        }
    };
    this.getRequest = function () {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
        } return false;
    };
    this.postBody = (arguments[2] || "");
    this.callbackFunction = A;
    this.url = B;
    this.request = this.getRequest();
    if (this.request) {
        var C = this.request;
        C.onreadystatechange = this.bindFunction(this.stateChange, this);
        if (this.postBody !== "") {
            C.open("POST", B, true);
            C.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            C.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            C.setRequestHeader("Connection", "close");
        } else {
            C.open("GET", B, true);
        }
        C.send(this.postBody);
    }
}

function setValues(url)
{
	microAjax(url, function (res) {
	    res.split(String.fromCharCode(10)).forEach(
            function (entry) {
		        fields = entry.split("|");
		        if(fields[2] == "input") {
				    document.getElementById(fields[0]).value = fields[1];
		        }
		        else if(fields[2] == "div") {
				    document.getElementById(fields[0]).innerHTML  = fields[1];
		        } else if(fields[2] == "chk") {
				    document.getElementById(fields[0]).checked  = fields[1];
		        }
            }
        );
	});
}


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
	  xmlHttp.open('GET','json',true);
	  xmlHttp.onreadystatechange=handleServerResponse;
	  xmlHttp.send(null);
	}
	setTimeout('process()',1500);
}


/* Функция парсинга массива JSON насосов и изменения элементов управления pumpState на странице */
function parsePumps(pumpsArray){
    var pumpStateArr = ["pumpState1", "pumpState2", "pumpState3", "pumpState4", "pumpState5"];
    for (var i = 0; i < pumpsArray.length; i++) {
		var pump = parseInt(pumpsArray[i]);
		if(document.getElementById(pumpStateArr[i]) != null) {
			document.getElementById(pumpStateArr[i]).classList.remove('text-success');
			document.getElementById(pumpStateArr[i]).classList.remove('text-danger');
			document.getElementById(pumpStateArr[i]).classList.add(pump ? "text-success" : "text-danger");
		}
    }
}

/* Функция парсинга массива JSON насосов и изменения элементов управления pumpState на странице */
function parsePowers(powersArray){
    var powerStateArr = ["powerState1", "powerState2"];
    for (var i = 0; i < powersArray.length; i++) {
		var power = parseInt(powersArray[i]);
		if(document.getElementById(powerStateArr[i]) != null) {
			document.getElementById(powerStateArr[i]).classList.remove('text-success');
			document.getElementById(powerStateArr[i]).classList.remove('text-danger');
			document.getElementById(powerStateArr[i]).classList.add(power ? "text-success" : "text-danger");
		}
    }
}

function setHtmlValuesFromJson (jsonData) {
		$.each(jsonData, function(key, value){
			if (document.getElementById(key)!=null) {
				//if(value instanceof Integer){
				document.getElementById(key).innerHTML=value;
			}
		});
}

function handleServerResponse(){
    if(xmlHttp.readyState==4 && xmlHttp.status==200){
       //JSON
        try {
			var myObj = JSON.parse(xmlHttp.responseText);
			
			if(myObj != null) {

				setHtmlValuesFromJson (myObj);
            
            	parsePumps(myObj.pumps);
				parsePowers(myObj.powers);
			}
        } catch(e) {
           console.log(e); // error in the above string (in this case, yes)!
        }
     }
   }
   
	/* Функция обновления и настроек графика из graph.json */
	function updateChart(sourcefile) {
		var bind = '#chart';
		if(document.getElementById(bind) != null) {
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
			bindto: bind,
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
	}
$(function() {
	updateChart('graph.json');
	setInterval(function(){ updateChart('graph.json'); }, 60000);
});