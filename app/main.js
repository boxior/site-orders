'use strict';

$(function () {
  app.init();
});

var app = {
  orders: [],
  fields: ['title', 'cat', 'deadline', 'status', 'name', 'id', 'paid', 'price', 'rate', 'bids'],
  templateId: '#order-template',
  url: 'data.json',
  init: getOrders,
}

function getOrders() {
  $.getJSON(this.url, function (data) {
    app.orders = data.slice();
    parseOrders();
  });
}

function parseOrders() {
  app.orders.forEach(function(e){
    buildOrder(e);
  });
}

function buildOrder(e) {
  var order = $(app.templateId)
      .clone()
      .removeAttr('id')
      .css('display', 'flex')
      .addClass('order__' + e.status);
console.log(order);

  var statusBarWidth = e.currentStep / e.steps * 100 + '%';

  app.fields.forEach(function(field){
    order.find('.order__' + field).html(e[field]);
  });

  if(e.title.length > 41) {
    order.find('.order__title').html(e.title.slice(0,41) + '...');
  }

  if(e.status === 'progress') {
    order.find('.order__status').html(e.status + " (pages " + e.currentStep + " of " + e.steps + ")");
    order.find('.order__log').css('display', 'block');
  }

  if(e.status === 'bidding') {
    order.find('.order__assigned').html(e.bids + ' bids');
    order.find('.letter').css('display', 'block');
  } else {
    order.find('.order__icon').css({"background-image" : "url('" + e.icon + "')"});
  }

  order.find('.order__timeleft').html(getTimeLeft(e.deadline));

  order.find('.status-bar__inner').css({'width': statusBarWidth})

  order.appendTo('.content');
}

function getTimeLeft(deadline) {
  var currentDate = new Date();
  var deadlineDate = new Date(deadline + ' ' + currentDate.getFullYear());
  var diffDate = (deadlineDate - currentDate) / (24 * 3600 * 1000);
  var diffResult = '';

  if (Math.abs(diffDate) > 1) {
    diffResult = Math.abs(Math.floor(diffDate)) + ' days';
  } else {
    diffResult = Math.abs(Math.floor(diffDate * 24))  + ' hours'
  }

  return diffResult + ' left';
}