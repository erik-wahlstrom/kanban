/** General UI **/
/***************************************************************/
/***************************************************************/
//    <li>
//      <a href="#">
//        <h2>Title #1</h2>
//        <p>Text Content #1</p>
//      </a>
//    </li>
function AppendTask(task) {
    var column = stateMapping[task.state_id];
    if (!column) return;
    if (!column.id) return;
    var div = document.getElementById(stateMapping[task.state_id].id);
    var ul = div.childNodes[1];

    var li = ul.appendChild(document.createElement("li"));
    li.setAttribute("id","task-" + task.id);
    li.setAttribute("draggable", "true");
    li.task_id = task.id;
    var a = li.appendChild(document.createElement("a"));
    a.task = task;
    a.setAttribute("href", "#");

    var h2 = a.appendChild(document.createElement("h2"));
    h2.appendChild(document.createTextNode("Id: " + task.id));
    var span = a.appendChild(document.createElement("span"));
    span.setAttribute("class", "close_x");
    span.appendChild(document.createTextNode("X"));
    span.onclick= RemoveTask

    span = a.appendChild(document.createElement("span"));
    span.setAttribute("class", "close_x");
    span.appendChild(document.createTextNode("?"));
    span.onclick= ShowUpdateUi;


    var person_name = task.person_name ? task.person_name : null;
    var description = task.description ? task.description : null;
    var created_date = task.created_date ? FormatDate(task.created_date) : null;
    var due_date = task.due_date ? FormatDate(task.due_date) : null;

    var color = null;
    if (task.due_date)
    {
        var due = new Date(due_date);
        if (IsTodayOrInPast(due)) color = "red";  
    } 

    var fields = [ 
        ['Owner', person_name, 50, color, false]
        , ['Due', due_date, 50, color, false] 
        , ['Created', created_date, 50, color, false] 
        , ['Description', description, 200, color, true]
        ];
    
    //TODO make this work better
    if (!description) {
        a.setAttribute("style","display:block;height:6em;");
        a.style.height='6em';
    } else if (description.length > 50) {
        a.setAttribute("style","display:block;height:15em;");
        a.style.height='15em';
    }
    var p = a.appendChild(document.createElement("p"));

    p.setAttribute("style", "white-space: pre-wrap;");
    var id = "sticky-" + task.id;
    p.setAttribute("id", "sticky-" + task.id);

        var innerHtml = "";
        fields.forEach( function(field) {
            if (field[1]) {
                var label = `<strong>${field[0]}:&nbsp;</strong>`;
                var text = field[1];

                //URLifly
                if (field[4]) {
                    text = Urlify(text, "#0000ff");
                }
                var text = `<span style='${field[3]}' >` + text + "</span>";
                var html = document.getElementById(id);
                innerHtml += label + text + "<br/>";
            }
        });
        p.innerHTML = innerHtml;
        /*
        var links = document.querySelectorAll(".span-link");
        [].forEach.call(links, function(link) {
            link.onclick = function() {window.location = link.attributes['href'].nodeValue;}
        });
*/

    li.addEventListener('dragstart', taskDragStart, false);
    li.addEventListener('drag', taskDrag, false);
    return div;
}

function RemoveTask(e) {
    var parent = FindParent(e.srcElement, "li");
    if (parent) {
        var task_id = parent.task_id;
        var chk = document.getElementById('chk-failsafe');
        if (chk.checked) {
            if(!(confirm("Delete task '" + task_id + "'?"))) {
                return;
             }
        }
        var task = {id: task_id, state_id: 4, description: 'Deleted'};
        DeleteTask(task);
    }
}

function CreateTask() {
    var wi = new WorkItem();
    wi.error = function(response) {
        HandleError("Could not create record(s)", response);
    }
    wi.success = function(response) {
        //Add sticky
        var wi2 = new WorkItem();
        wi2.id = response.data.id;
        wi2.error = function(response) {
            HandleError("Could not retreive record(s)", response);
        }
        wi2.success = function(response) {
            AppendTask( stateMapping[response.data.state_id], response.data);
            CloseModals();
        }
        wi2.FindWorkItem();
    }
    wi.description = GetValueById('txt-description');
    wi.person_id = parseInt(GetValueById('sel-owner_id'));
    wi.work_item_group_id = parseInt(GetValueById('sel-work_item_group_id'));
    
    var strDate = GetValueById('txt-due_date');
    var due_date = null;
    try { 
        due_date = new Date(strDate);
    } catch (e) {
        due_date = null;
    } 
    wi.due_date = due_date;
    wi.CreateWorkItem();
}

/***************************************************************/
/***************************************************************/
/** Tasks **/
/***************************************************************/
/***************************************************************/
function ClearTasks()
{
    var tasks = document.querySelectorAll("li");
    [].forEach.call(tasks, function(task) {
        if (task.task_id) {
            ClearTask(task);
        }
    });
}
function ClearTask(task) {
    var parent = task.parentNode;
    parent.removeChild(task);
}
function InitTasks(arrTasks) {
    arrTasks.forEach( function(task){ 
        AppendTask(task);
    });
}

function DeleteTask(task) {
    //Start doing the DB Update to the new state
    task.state_id = 4;
    UpdateTask(task);
}

function UpdateTaskUi() {
    var task = {
        id: parseInt(GetValueById('txt-task_id')),
        state_id: parseInt(GetValueById('txt-state_id')),
        work_item_group_id: parseInt(GetValueById('sel-work_item_group_id')),
        person_id: parseInt(GetValueById('sel-owner_id')),
        description: GetValueById('txt-description'),
        due_date: FormatDate(GetValueById('txt-due_date')),
        created_date: (GetValueById('txt-created_date')),
        last_update: FormatDate(GetValueById('txt-last_update')),
    }
    UpdateTask(task);
}
function UpdateTask(task) {
    //Start doing the DB Update to the new state
    var wi = new WorkItem();
    wi.id = task.id;
    wi.state_id = task.state_id;
    wi.work_item_group_id = task.work_item_group_id;
    wi.description = task.description;
    wi.due_date = task.due_date;        
    wi.person_id = task.person_id;        
    wi.created_date = task.created_date;        
    wi.last_update = task.last_update;        


    wi.error = function(response) {
        HandleError("Could not update record: " + wi.id, response);
    }
    wi.success = function(response) {
        //If this was sucessful then 
        //Delete the old one.
        task.state_id = wi.state_id;
        var div = document.getElementById("task-" + task.id);
        ClearTask(div);
        //Create the new Item
        AppendTask(task);
        CloseModals();
    }
    wi.UpdateWorkItem();
}