'use strict';

const AV = require('leanengine');
var router = require('express').Router();

// const Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', async function(ctx) {
//   ctx.state.title = '无';
//   AV.Cloud.run('hello', paramsJson).then(function(data) {
//     cts.state.helloCallBack =  data;
//   }, function(err) {
//     // 处理调用失败
//   });
//   await ctx.render('todos.ejs');
await ctx.render('ztjy.ejs');
});

module.exports = router;