function enableAuthFields(cb) {
    //document.getElementById("wwwuser").disabled = !cb.checked;
    //document.getElementById("wwwpass").disabled = !cb.checked;
}

function submitFrm(frm) {
    if (document.getElementById("wwwauth").checked) {
        if ((document.getElementById("wwwuser").value != "") && (document.getElementById("wwwpass").value != "")) {
            //document.getElementById("submitResult").innerHTML = "Auth updated";
            console.log("User: " + document.getElementById("wwwuser").value);
            console.log("Pass: " + document.getElementById("wwwpass").value);
            console.log("Enable: " + document.getElementById("wwwauth").checked);
            frm.submit();
        } else {
            document.getElementById("submitResult").innerHTML = "User and password must be filled";
        }
    } else {
        //document.getElementById("wwwuser").value = "";
        document.getElementById("wwwpass").value = "";
        //document.getElementById("submitResult").innerHTML = "Auth disabled";
        console.log("User: " + document.getElementById("wwwuser").value);
        console.log("Pass: " + document.getElementById("wwwpass").value);
        console.log("Enable: " + document.getElementById("wwwauth").checked);
        frm.submit();
        
    }
}

function restartESP() {
    setValues("/admin/restart");
}

function GetState() {
    setValues("/admin/wwwauth");
}

window.onload = function () {
    load("style.css", "css", function () {
        load("microajax.js", "js", function () {
            GetState();
        });
    });
    enableAuthFields(document.getElementById("wwwauth"));
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

      function GetState() {
          setValues("/update/updatepossible")
          setTimeout(function () {
              if (document.getElementById("remupd").innerHTML == "OK") {
                  console.warn("ERROR = OK");
                  document.getElementById("fileName").disabled = false;
                  document.getElementById("updateButton").disabled = false;
                  document.getElementById("remupdResult").innerHTML = "";
              }
          }, 2000);
      }

        window.onload = function () {
            //load("style.css", "css", function () {
                load("scripts.js", "js", function () {
                    GetState();
                });
            //});
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

        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                  input = document.getElementById('fileName'),
                  running = false,
                  ua = navigator.userAgent.toLowerCase();

        function summd5() {
            //input = document.getElementById("fileName");
            if (running) {
                return;
            }
            if (!input.files.length) {
                console.error('Please select a file');
                return;
            }
            var fileReader = new FileReader(),
                    file = input.files[0],
                    time;
            fileReader.onload = function (e) {
                running = false;
                if (file.size != e.target.result.length) {
                    console.error('ERROR:Browser reported success but could not read the file until the end');
                } else {
                    md5hash = SparkMD5.hashBinary(e.target.result);
                    console.info('Finished loading!');
                    console.info('Computed hash: ' + md5hash); // compute hash
                    console.info('Total time: ' + (new Date().getTime() - time) + 'ms');
                    document.getElementById('md5row').hidden = false;
                    document.getElementById('clientHash').innerHTML = md5hash;
                    document.getElementById('fileSize').innerHTML = file.size;
                    setValues('/setmd5?md5=' + md5hash + '&size=' + file.size);
                }
            };
            fileReader.onerror = function () {
                running = false;
                console.error('ERROR: FileReader onerror was triggered, maybe the browser aborted due to high memory usage');
            };
            running = true;
            console.info('Starting normal test (' + file.name + ')');
            time = new Date().getTime();
            fileReader.readAsBinaryString(file);
        }