var promise = require('bluebird');
var Configuration = require('./config');

var options = {
  // Initialization Options
  promiseLib: promise,
};

var config = (new Configuration()).ActiveConfiguration();
var pgp = require('pg-promise')(options);

console.log("Connection: " + JSON.stringify(config.connection_string));
var db = pgp(config.connection_string);

// add query functions

module.exports = {
  getAllWorkItems: getAllWorkItems,
  getSingleWorkItem: getSingleWorkItem,
  createWorkItem: createWorkItem,
  updateWorkItem: updateWorkItem,
  removeWorkItem: removeWorkItem,
  findWorkItemsByStateId: findWorkItemsByStateId,
  findWorkItemsByGroupId: findWorkItemsByGroupId,
  selectStar: selectStar,
  findOne: findOne,
  findNotes: findNotes,
};

function selectStar(req, res, next) {
    if (req.params.table == null) {
        err = {code: 403,  responseText: "Table is null"};
        next(err);
        return;
    }
    if (req.params.desc) {
        if ('true' ===  req.params.desc) req.params.desc = true;
        else if ('false' ===  req.params.desc) req.params.desc = false;
        else {
            err = {code: 403,  responseText: "Desc is not a boolean"};
            next(err);
            return;
        }
    }

    var sql = "SELECT * FROM " + req.params.table;
    if (req.params.orderby != null) sql += " ORDER BY " + req.params.orderby ;
    if (req.params.desc) sql += " DESC" ;

    db.any(sql, req.params)
        .then(function (data) {
        res.status(200)
            .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL ' + req.params.table
            });
        })
        .catch(function (err) {
            if (handleNoData(err, res)) return;
            return next(err);
        });
}
function getAllWorkItems(req, res, next) {
  db.any('SELECT wi.*, p.name as person_name, g.description as group_name FROM work_item wi INNER JOIN work_item_group g ON wi.work_item_group_id = g.id INNER JOIN person p on wi.person_id = p.id')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL work items'
        });
    })
    .catch(function (err) {
        console.log('getAllWorkItems:error');
        return next(err);
    });
}

function findNotes(req, res, next) {
    console.log('findMany');
    var sql =  'SELECT n.*, p.name as name FROM note n INNER JOIN work_item wi ON n.work_item_id = wi.id INNER JOIN person p on n.person_id = p.id WHERE wi.id = $1';

    console.log("sql : " + sql);
    db.any(sql, [parseInt(req.params.work_item_id)])
        .then(function (data) {
        res.status(200)
            .json({
          status: 'success',
          data: data,
          message: 'Retrieved items.'
        });
    })
    .catch(function (err) {
        if (handleNoData(err, res)) return;
        console.log('findMany:error');
        return next(err);
    });
  }


function findWorkItemsByStateId(req, res, next) {
  console.log('findWorkItemsByStateId');
  var id = parseInt(req.params.state_id);
  db.any('SELECT * FROM work_item WHERE state_id=$1', [id])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one work items with state=' + id
        });
    })
    .catch(function (err) {
        if (handleNoData(err, res)) return;
        console.log('findWorkItemsByStateId:error');
        return next(err);
    });
}

function findMany(req, res, next, data) {
    console.log('findMany');
    var sql =  'SELECT * FROM ' + data.table + ' WHERE ';

    var values = [];
    console.log("data : " + JSON.stringify(data));
    var c = data.clauses;
    for (i = 0; i<c.length;i++) {
        sql += " " + c[i].name + " = " + "$" + (i+1);
        values.push(c[i].value);  
    }  
    console.log("sql : " + sql);
    console.log("values : " + values);
    db.any(sql, values)
        .then(function (data) {
        res.status(200)
            .json({
          status: 'success',
          data: data,
          message: 'Retrieved items.'
        });
    })
    .catch(function (err) {
        if (handleNoData(err, res)) return;
        console.log('findMany:error');
        return next(err);
    });
}


function findOne(req, res, next) {
  console.log('findOne');

  var data = { 
      table: req.params.table,
      column: req.params.column,
      value: req.params.value
  };

  var sql =  'SELECT * FROM ' + data.table + ' WHERE ' + data.column + ' = ${value}';
  console.log("dta : " + JSON.stringify(data));
    console.log("sql : " + sql);
  db.one(sql, data)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one item.'
        });
    })
    .catch(function (err) {
        if (handleNoData(err, res)) return;
        console.log('findOne:error');
        return next(err);
    });
}

function findWorkItemsByGroupId(req, res, next) {
  console.log('findWorkItemsByGroupId');
  var id = parseInt(req.params.work_item_group_id);

  var sql =  'SELECT wi.*, p.name as person_name, g.description as group_name '
            + ' FROM work_item wi INNER JOIN work_item_group g ON wi.work_item_group_id = g.id ' 
            + ' INNER JOIN person p on wi.person_id = p.id '
            + ' WHERE wi.work_item_group_id = $1' 
            + ' ORDER BY CASE WHEN wi.due_date IS NULL THEN 1 ELSE 0 end, wi.due_date DESC';

  db.any(sql, [id])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL work items with state=' + id
        });
    })
    .catch(function (err) {
        if (handleNoData(err, res)) return;
        console.log('findWorkItemsByStateId:error');
        return next(err);
    });
}


function handleNoData(err, res) {
    var ret = false;
    if (err.code == 0) {
        ret = true;
        res.status(404)
            .json({
                status: 'failure',
                data: {}, 
                message: err.message
            });
    }
    console.log(err);
    return ret;
}

function getSingleWorkItem(req, res, next) {
    var id = parseInt(req.params.id);
    var sql = 'SELECT wi.*, p.name as person_name, g.description as work_item_group_description ' +
       'FROM work_item wi INNER JOIN work_item_group g ON wi.work_item_group_id = g.id INNER JOIN person p on wi.person_id = p.id WHERE wi.id =$1'
    console.log(sql + '-->' + id);   
    db.one(sql, id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data, 
                    message: 'Retrieved ONE work_item'
                });
        })
      .catch(function (err) {
          if (handleNoData(err, res)) return;
          console.log('getSingleWorkItem:error');
          return next(err);
    });
}
function createWorkItem(req, res, next) {
    var wi = {
        id: null,
        state_id: 1,
        work_item_group_id: req.body.work_item_group_id,
        person_id: req.body.person_id,
        description: req.body.description,
        created_date: new Date(), 
        last_update: new Date(),
        due_date: req.body.due_date
    };

    var query = 'INSERT INTO work_item (state_id, work_item_group_id, person_id, description, created_date, due_date, last_update) ' +
        ' VALUES ( ${state_id}, ${work_item_group_id}, ${person_id}, ${description}, ${created_date}, ${due_date}, ${last_update}) RETURNING id;'
    console.log(wi);   
    db.one(query,wi)
      .then(function (data) {
        wi.id = data.id;
        res.status(200)
          .json({
            status: 'success',
            data: wi,
            message: 'Inserted one work_item'
          });
      })
      .catch(function (err) {
      console.log('createWorkItem:error');
        return next(err);
    });

}
function updateWorkItem(req, res, next) {
    var wi = {
        id: parseInt(req.params.id),
        state_id: parseInt(req.body.state_id),
        work_item_group_id: parseInt(req.body.work_item_group_id),
        person_id: parseInt(req.body.person_id),
        description: req.body.description,
        due_date: new Date(req.body.due_date),
        last_update: new Date()
    };
    var sql = 'UPDATE work_item SET state_id=${state_id}, work_item_group_id=${work_item_group_id}, '
        + 'person_id= ${person_id}, due_date=${due_date}, description=${description}, last_update=${last_update} WHERE id=${id}'
    console.log(sql);
    console.log(JSON.stringify(wi));
    db.none(sql, wi)
        .then(function () {
          res.status(200)
            .json({
                status: 'success',
                data: wi,
                message: 'Updated ONE work_item'
            });
        })
        .catch(function (err) {
          console.log(err);
          return next(err);
    });
}

function removeWorkItem(req, res, next) {
    var wi = {
        id: parseInt(req.params.id),
        state_id: 4,
        description: req.body.description,
        created_date: req.body.created_date,
        last_update: new Date()
    };
    db.none('UPDATE work_item SET state_id=4, last_update=$1 WHERE id=$2', [wi.state_id, wi.last_update ])
        .then(function () {
          res.status(200)
            .json({
                status: 'success',
                data: wi,
                message: 'Updated ONE work_item'
            });
        })
        .catch(function (err) {
          return next(err);
        })
}