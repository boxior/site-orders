'use strict';

$(function () {
  app.init();
  customSelectInit();
  
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

function sortedOrders(sortBy){

  var sortedArray = [];

  if (sortBy == 'deadline') {
    sortedArray = app.orders.sort(function(a,b){
      return new Date(b[sortBy]) - new Date(a[sortBy]);
    });
  } else {
    sortedArray = app.orders.sort(function(a,b){
      return a[sortBy].slice(1) - b[sortBy].slice(1);

    });
  }
  orderRemove();
  sortedArray.forEach(function(el){
    buildOrder(el);
  });
}
function customSelectInit(){
  var $sortSelect = $('.order-nav__sorted');

  $sortSelect.select2({
    minimumResultsForSearch: Infinity
  });
 
  $sortSelect.on("select2:select", function (e) { 
    sortedOrders(e.params.data.id);
  });
}

function buildOrder(e) {
  
  var order = $(app.templateId)
      .clone()
      .removeAttr('id')
      .attr('data-sort', e.id.slice(1))
      .css('display', 'flex')
      .addClass('order__' + e.status);

  var statusBarWidth = e.currentStep / e.steps * 100 + '%';

  app.fields.forEach(function(field){
    order.find('.order__' + field).html(e[field]);
  });

  if (e.title.length > 41) order.find('.order__title').html(e.title.slice(0, 41) + '...');

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

  order.find('.status-bar__inner').css({'width': statusBarWidth});

  order.appendTo('.content');

  function sortOrders(e){
    var sorted = +e.id.slice(1);
    var sortedBy = e.sort(function(b, a) {
          return (a.id - b.id);
        });
  };
  // sortOrders(e);
  // console.log(+e.id.slice(1))
  
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

function orderRemove(){
  $('.content').children().remove();
}

function getStatusOrder(status){
  orderRemove();
  app.orders.forEach(function(e){
    if(e.status === status) {
      buildOrder(e);
    }
  });
}

$('#finished').on('click', function(e){
  $('#recent').removeClass('active');
  $('#canceled').removeClass('active');
  $('#finished').addClass('active');
  getStatusOrder("bidding");
});

$('#canceled').on('click', function(e){

  $('#recent').removeClass('active');
  $('#canceled').addClass('active');
  $('#finished').removeClass('active');
  getStatusOrder("canceled automatically");
});

$('#recent').on('click', function(){
  $('#recent').addClass('active');
  $('#canceled').removeClass('active');
  $('#finished').removeClass('active');
  orderRemove();
  parseOrders();
});

$('.sorted').on('click', function(){
  orderRemove();
  sortOrders();
})

$('.balance').hover(function(){
  $('.balance__after').css('display','block');
}, function(){
  $('.balance__after').css('display','none');
});

function windowSize(){
    if ($(window).width() <= '768'){
        $('.mobile-nav-menu').children().remove();
        $('.nav-menu').clone().appendTo('.mobile-nav-menu');

       $('.balance').on('click', function(){
        $('.balance__after').toggle();
       });

       if(!$('.order__title').find('.content-header__title').length){
        $('.content-header__title').clone().prependTo('.order__title').css('display','block');
       }
        
       if(!$('.order__deadline').find('.content-header__deadline').length){
        $('.content-header__deadline').clone().prependTo('.order__deadline').css('display','block');
       }

        if(!$('.order__status').find('.content-header__status').length){
        $('.content-header__status').clone().prependTo('.order__status').css('display','block');
       }

        if(!$('.order__assigned').find('.content-header__assigned').length){
        $('.content-header__assigned').clone().prependTo('.order__assigned').css('display','block');
       }

        if(!$('.order__price').find('.content-header__price').length){
        $('.content-header__price').clone().prependTo('.order__price').css('display','block');
       }

        if(!$('.order__id').find('.content-header__id').length){
        $('.content-header__id').clone().prependTo('.order__id').css('display','block');
       }
      
    }
}
$(window).on('load resize',windowSize);

