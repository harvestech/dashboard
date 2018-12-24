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

