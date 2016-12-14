// My Work Item
function Table() {
    this.success =  function(xhttp){};
    this.error =  function(xhttp){};
};

function CreateHttpRequest(wi) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            wi.success(JSON.parse(xhttp.responseText));
        } else if (this.readyState == 4 && this.status == 200) {
            wi.error(xhttp);
        }
    };
    return xhttp;
}

Table.prototype.SelectStar = function SelectStar(table, orderby, desc) {
    if (!table) {
        this.error("Table is null");
        return;
    }

    console.log("SelectStar");
    var url = "/api/find/" + table;

    if (orderby) url += "/" + orderby;
    if (desc) url += "/" + desc;
    
    var xhttp = CreateHttpRequest(this);
    xhttp.open("GET", url, true);
    xhttp.send();
}

Table.prototype.FindOne = function FindOne(table, column, value) {
    if (!table) {
        this.error("Table is null");
        return;
    }
    if (!column) {
        this.error("column is null");
        return;
    }
    if (!value) {
        this.error("value is null");
        return;
    }

    console.log("SelectStar");
    var url = "/api/find_one/string/" + table;

    
    url += "/" + column;
    url += "/" + value;

   console.log("url " + url ); 
    var xhttp = CreateHttpRequest(this);
    xhttp.open("GET", url, true);
    xhttp.send();
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Table;
else
    window.Validator = Table;