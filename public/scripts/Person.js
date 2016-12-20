    function LookupUser() {
        var t = new Table();
        t.success = function(response) {
            SetValueById("person_name", response.data.name);
        };
        t.error = function(response) {
            HandleError("Couldn't load person");
        };
        t.FindOne('person', 'fb_id', fbId);    
    }