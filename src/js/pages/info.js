function GetState()
  {
    setValues("/admin/infovalues");
  }

  window.onload = function ()
  {
    load("style.css","css", function()
    {
      load("microajax.js","js", function()
      {
        GetState();
      });
    });
  }
  function load(e, t, n) {
    if ("js" == t) {
      var a = document.createElement("script");
      a.src = e,
      a.type = "text/javascript",
      a.async = !1,
      a.onload = function () { n() },
      document.getElementsByTagName("head")[0].appendChild(a)
    } else if ("css" == t) {
      var a = document.createElement("link");
      a.href = e,
      a.rel = "stylesheet",
      a.type = "text/css",
      a.async = !1,
      a.onload = function () { n() },
      document.getElementsByTagName("head")[0].appendChild(a)
    }
  }
function initEvt() {
    startEvents();
}

function startEvents() {
    var evs = new EventSource('/events');
    evs.onopen = function (evt) {
        console.log("Event source connected");
    };

    evs.onerror = function (evt) {
        if (evt.target.readyState != EventSource.OPEN) {
            console.log("Event source disconnected. Error: " + evt.data);
        }
    };

    evs.onmessage = function (evt) {
        console.log("Event " + evt.data);
    };
    evs.addEventListener('timeDate', function (evt) {
        var jsonTimeDate = JSON.parse(evt.data);
        document.getElementById("x_ntp_time").innerHTML = jsonTimeDate.time;
        document.getElementById("x_ntp_date").innerHTML = jsonTimeDate.date;
        document.getElementById("x_ntp_sync").innerHTML = jsonTimeDate.lastSync;
        document.getElementById("x_uptime").innerHTML = jsonTimeDate.uptime;
        document.getElementById("x_last_boot").innerHTML = jsonTimeDate.lastBoot;
    }, false);
}

window.addEventListener('load', initEvt, true);