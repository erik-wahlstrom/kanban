var modalConfig = {
    add: {
        div_id: 'modal-task',
        fields: [
            { id: 'modal-task_id',              display: 'none',},
            { id: 'modal-state_id',             display: 'none',      inputId: 'txt_state_id',               readOnly:false},
            { id: 'modal-owner_id',             display: 'table-row', inputId: 'sel-owner_id',               readOnly:false},
            { id: 'modal-work_item_group_id',   display: 'table-row', inputId: 'sel-work_item_group_id',     readOnly:false},
            { id: 'modal-created_date',         display: 'none',      inputId: 'txt-created_date',           readOnly:true},
            { id: 'modal-due_date',             display: 'table-row', inputId: 'txt-due_date',               readOnly:false},
            { id: 'modal-last_update',          display: 'none',      inputId: 'txt-last_update',       readOnly:false},
            { id: 'modal-description',          display: 'table-row', inputId: 'txt-description',            readOnly:false},
            { id: 'modal-create',               display: 'table-row', inputId: 'btn-create',                 readOnly:false},
            { id: 'modal-update',               display: 'none',      inputId: 'btn-update',                 readOnly:false},
            { id: 'modal-note',                 display: 'none',        inputId: 'txt-note',                   readOnly:false},
            { id: 'notes-table',                display: 'none' }
        ]
    },
    update: {
        div_id: 'modal-task',
        fields: [
            { id: 'modal-task_id',              display: 'table-row',   inpitId: 'txt-task_id',              readOnly:true},
            { id: 'modal-state_id',             display: 'none',      inputId: 'txt_state_id',               readOnly:false},
            { id: 'modal-owner_id',             display: 'table-row',   inputId: 'sel-owner_id',              readOnly:false},
            { id: 'modal-work_item_group_id',   display: 'table-row',   inputId: 'sel-work_item_group_id',    readOnly:false},
            { id: 'modal-created_date',         display: 'table-row',   inputId: 'txt-created_date',          readOnly:true},
            { id: 'modal-due_date',             display: 'table-row',   inputId: 'txt-due_date',              readOnly:false},
            { id: 'modal-last_update',          display: 'table-row',   inputId: 'txt-last_update',      readOnly:true},
            { id: 'modal-description',          display: 'table-row',   inputId: 'txt-description',           readOnly:false},
            { id: 'modal-create',               display: 'none',        inputId: 'btn-create',                 readOnly:false},
            { id: 'modal-update',               display: 'table-row',   inputId: 'btn-update',                 readOnly:false},
            { id: 'modal-note',                 display: 'table-row',   inputId: 'txt-note',                  readOnly:false},
            { id: 'notes-table',                display: 'table-row' }
        ]
    }
};