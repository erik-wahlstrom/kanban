// My Work Item
function WorkItem() {
    this.id  = null;
    this.description = null;
    this.created_date = null;
    this.last_update = null;
    this.person_id = null;
    this.work_item_group_id = null;
    this.person_name = null;
    this.work_item_group_description = null;
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

WorkItem.prototype.CreateWorkItem = function CreateWorkItem() {
    var data = JSON.stringify(this);
    var xhttp = CreateHttpRequest(this);
    xhttp.open("POST", "/api/work_item", true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(data);
}

WorkItem.prototype.FindWorkItem = function FindWorkItem() {
    var xhttp = CreateHttpRequest(this);
    if (!Number.isInteger(parseInt(this.id))) this.error("id is not a Number");
    xhttp.open("GET", "/api/work_item/" + this.id, true);
    xhttp.send();
}
WorkItem.prototype.FindAllWorkItems = function FindAllWorkItems() {
    var xhttp = CreateHttpRequest(this);
    xhttp.open("GET", "/api/work_item", true);
    xhttp.send();
}


WorkItem.prototype.FindByStateId = function FindByStateId() {
    if (!Number.isInteger(parseInt(this.state_id))) {
        this.error("state_id is not a Number");
        return;
    }
    var xhttp = CreateHttpRequest(this);
    xhttp.open("GET", "/api/work_items/state/" + this.state_id, true);
    xhttp.send();
}


WorkItem.prototype.UpdateWorkItem = function UpdateWorkItem() {
    if (!Number.isInteger(parseInt(this.id))) {
        this.error("id is not a Number");
        return;
    }
    var xhttp = CreateHttpRequest(this);
    var data = JSON.stringify(this);
    xhttp.open("PUT", "/api/work_item/" + this.id, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhttp.send(data);
}
WorkItem.prototype.DeleteWorkItem = function DeleteWorkItem() {
    this.state_id = 4;
    this.UpdateWorkItem();
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = WorkItem;
else
    window.Validator = WorkItem;