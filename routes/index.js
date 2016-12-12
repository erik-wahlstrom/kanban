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
router.delete('/api/work_item/:id', db.removeWorkItem);


router.get('/', function(req, res) { res.render('index.ejs', {states: ''})});
router.get('/manage', function(req, res) { res.render('manage.ejs', {states: ''})});




module.exports = router;