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

var monthNames = [
    "Jan.", "Feb.", "Mar.",
    "Apr.", "May", "Jun.", "Jul.",
    "Aug.", "Sept.", "Oct.",
    "Nov.", "Dec."
];
function FormatDate(zdate) {
    var year = zdate.substr(0, 4);
    var monthIndex = parseInt(zdate.substr(5,2)) - 1;
    var day = zdate.substr(8,2);

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function FindParent(node, parentName, idPrefix) {
    var parent = node;
    while (parent != null) {
        if (parent.nodeName.toLowerCase() == parentName.toLowerCase()) {
            if (idPrefix != null) {
                var id = parent.getAttribute("id");
                if (!id.startsWith(idPrefix)) {
                    continue;
                }
            } 
            return parent;
        }
        parent =parent.parentNode;
    }
    return null;
}

function IsTodayOrInPast(test) {
    var now = new Date();
    if (now > test) return true;
    return now.getFullYear() == test.getFullYear()
        && now.getMonth() == test.getMonth()
        && now.getDate() == test.getDate();

}