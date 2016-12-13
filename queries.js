var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://erik:Leadville100@aacxnw4546m2a8.caoeqvnamynp.us-west-2.rds.amazonaws.com:5432/kanban';

var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllWorkItems: getAllWorkItems,
  getSingleWorkItem: getSingleWorkItem,
  createWorkItem: createWorkItem,
  updateWorkItem: updateWorkItem,
  removeWorkItem: removeWorkItem,
  findWorkItemsByStateId: findWorkItemsByStateId,
  findWorkItemsByGroupId: findWorkItemsByGroupId,
  selectStar: selectStar
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



function findWorkItemsByStateId(req, res, next) {
  console.log('findWorkItemsByStateId');
  var id = parseInt(req.params.state_id);
  db.any('SELECT * FROM work_item WHERE state_id=$1', [id])
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
        description: req.body.description,
        last_update: new Date()
    };

    console.log(wi);
    db.none('UPDATE work_item SET state_id=${state_id}, description=${description}, last_update=${last_update} WHERE id=${id}', wi)
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