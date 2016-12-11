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
  findWorkItemsByStateId: findWorkItemsByStateId
};

function getAllWorkItems(req, res, next) {
  db.any('SELECT * FROM work_item')
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
        console.log('findWorkItemsByStateId:error');
        return next(err);
    });
}

function getSingleWorkItem(req, res, next) {
    var id = parseInt(req.params.id);
    db.one('SELECT * FROM work_item WHERE id =$1', id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data, 
                    message: 'Retrieved ONE work_item'
                });
        })
      .catch(function (err) {
          console.log('getSingleWorkItem:error');
          return next(err);
    });
}
function createWorkItem(req, res, next) {
    var wi = {
        id: null,
        state_id: 1,
        description: req.body.description,
        created_date: new Date(), 
        last_update: new Date()
    };

    db.one('INSERT INTO work_item(state_id, description, created_date, last_update)' +
        'VALUES(${state_id}, ${description}, ${created_date}, ${last_update}) RETURNING id;',wi)
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