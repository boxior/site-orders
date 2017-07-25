$(function () {
  app.init();
});

var app = {
  orders: [],
  fields: ['title', 'category', 'deadline', 'status'],
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

console.log(this.url);

function parseOrders() {
  app.orders.forEach(function(element){
    buildOrder(element);
  });
}

function buildOrder(element) {
  var order = $(app.templateId)
      .clone()
      .removeAttr('id')
      .css('display', 'block')
      .addClass('order--status_' + element.status);
  var statusBarWidth = element.currentStep / element.steps * 100 + '%';

  app.fields.forEach(function(field){
    order.find('.order__' + field).html(element[field]);      
  });

  order.find('.order__timeleft').html(getTimeLeft(element.deadline));

  // build status-bar
  order.find('.status-bar__inner').css({'width': statusBarWidth})

  order.appendTo('.tasksbody');
}

function getTimeLeft(deadline) {
  var currentDate = new Date();
  var deadlineDate = new Date(deadline + ' ' + currentDate.getFullYear());
  var diffDate = (deadlineDate - currentDate) / (24 * 3600 * 1000);
  var diffResult = '';
  
  // console.log(deadlineDate);

  if (diffDate > 1) {
    diffResult = Math.floor(diffDate) + ' days';
  } else {
    diffResult = Math.floor(diffDate* 24)  + ' hours'
  }

  return diffResult + ' left';
}