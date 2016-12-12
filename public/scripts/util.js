function HandleError(msg, err) {
    alert("[ERROR: " + msg + "] " + err);
}

function GetValueById(id) {
    var ctrl =  document.getElementById(id);
    if (ctrl != null) {
        if (ctrl.value) {
            return ctrl.value.trim();
        }
    }
    return null;
}

function SetValueById(id, value) {
    var ctrl =  document.getElementById(id);
    if (ctrl == null) return false;
    ctrl.value = value;
    return true;
    
}
function Trace() {
    if (debug) {
        var myName = Trace.caller.toString();
        myName = myName.substr('function '.length);
        myName = myName.substr(0, myName.indexOf('('));
        console.log(myName);
    }
}

