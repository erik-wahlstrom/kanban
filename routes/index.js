var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../queries');

router.get('/api/work_item', db.getAllWorkItems);
router.get('/api/work_item/:id', db.getSingleWorkItem);
router.get('/api/work_items/state/:state_id', db.findWorkItemsByStateId);
router.get('/api/work_items/work_item_group/:work_item_group_id', db.findWorkItemsByGroupId);
router.post('/api/work_item', db.createWorkItem);
router.put('/api/work_item/:id', db.updateWorkItem);

router.get('/api/notes/:work_item_id', db.findNotes);
//router.put('/api/note/:value', db.createNote);

router.delete('/api/work_item/:id', db.removeWorkItem);
router.get('/api/find/:table', db.selectStar);
router.get('/api/find/:table/:orderby', db.selectStar);
router.get('/api/find/:table/:orderby/:desc', db.selectStar);
router.get('/api/find_one/string/:table/:column/:value', db.findOne);


router.get('/', function(req, res, next) { res.render('index.ejs', {req: req, res: res, states: ''})});
router.get('/manage', function(req, res, next) { res.render('manage.ejs', {req: req, res: res, states: ''})});




module.exports = router;