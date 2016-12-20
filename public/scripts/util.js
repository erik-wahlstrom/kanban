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

function Urlify(text, color) {
//    url = text.replace(urlRegex, `<span class='span-link' href='${text}'>${text}</span>`);
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        var out = `<span onclick='OpenNewTab("${url}")' style='color: ${color};'>${url}</span>`;
        return out;
    });
}
function OpenNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


/************************
 * UX Controls
 ************************/

function ToggleClass(e, add, remove) {
    if (e) {
        if (e.classList.contains(add)) e.classList.remove(add);
        if (e.classList.contains(remove)) e.classList.remove(remove);
        e.classList.add(add);
    }
}
function HideDiv(id)
{
    var e = document.getElementById(id); 
    if (e) {
        e.style.display = 'none';
    }
}
function ShowDivAsBlock(id)
{
    var e = document.getElementById(id); 
    if (e) {
        e.style.display = 'block';
    }
}
function ShowDivAsInlineBlock(id)
{
    var e = document.getElementById(id); 
    if (e) {
        e.style.display = 'inline-block';
    }
}

function LoadSelect(id, table, id_col, value_col, orderby, desc, selIdx) {
    var t = new Table();
    t.success = function(response) {
        var sel = document.getElementById(id);
        response.data.forEach( function(row) {
            var opt = sel.appendChild(document.createElement("option"));
            opt.setAttribute("value", row[id_col]);
            opt.appendChild(document.createTextNode(row[value_col]));
        });
        sel.selectedIndex = selIdx;
    };
    t.error = function(response) {
        HandleError("Couldn't load " + table);
    };
    t.SelectStar(table, orderby, desc);
}