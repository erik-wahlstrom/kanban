    function UpdateNote() {
        alert('Create a note');
    }

    function ListNotes(wid) {
        var tbl = document.getElementById("tbl-notes");
        var wi = new WorkItem();
        wi.id = wid;

        wi.error = function(response) {
            HandleError("Could not retreive record(s)", response);
        }
        wi.success = function(response) {
            response.data.forEach( function(note) {
                var tr = tbl.appendChild(document.createElement("tr"));
                
                (tr.appendChild(document.createElement("td"))).appendChild(document.createTextNode(note.name));
                (tr.appendChild(document.createElement("td"))).appendChild(document.createTextNode(note.created_date));
                (tr.appendChild(document.createElement("td"))).appendChild(document.createTextNode(note.value));
            });
        }
        wi.FindNotes();
    }