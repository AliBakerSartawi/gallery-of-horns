'use strict';

////// global variables
Unicorn.all = [];
let unicornPageOne = [];
let unicornPageTwo = [];
let noRepeatFilterArr = [];
let pageNumber = 1;

//////// Constructor
function Unicorn(unicorn) {
  this.title = unicorn.title;
  this.image_url = unicorn.image_url;
  this.description = unicorn.description;
  this.keyword = unicorn.keyword;
  this.horns = unicorn.horns;
  Unicorn.all.push(this);
}

//////// render image
Unicorn.prototype.renderImage = function() {
  let templatePhoto = $('#photo-mustache-template').html();
  let html = Mustache.render(templatePhoto, this);
  $('main').append(html);
};

//////// render filter
Unicorn.prototype.renderFilter = function() {

  if (!noRepeatFilterArr.includes(this.keyword)) {
    noRepeatFilterArr.push(this.keyword);
    let templateFilter = $('#filter-template').html();
    let html = Mustache.render(templateFilter, this);
    $('#select-filter').append(html);
  }
};

//////// ajax
const ajaxSettings = {
  method: 'get',
  dataType: 'json',
};

function ajaxAndRender(url, pageNum, pageArr, renderOrNot) {
  $.ajax(url, ajaxSettings).then(data => {
    data.forEach(unicorn => {
      let unicornObject = new Unicorn(unicorn);
      // add page property
      unicornObject.page = pageNum;

      /////splitting into two arrays after rendering
      if (unicornObject.page === 1){
        unicornPageOne.push(unicornObject);
      } else {
        unicornPageTwo.push(unicornObject);
      }

    });
    //populate window and filter with images
    if (renderOrNot === true){
      sortArrByTitle(pageArr);
      pageArr.forEach(element => {
        element.renderImage();
        element.renderFilter();
      });
    }
  });
  pageNumber = 1;
}
//////// initial rendering on load, and instantiating objects for both pages
ajaxAndRender('data/page-1.json', 1, unicornPageOne, true);
ajaxAndRender('data/page-2.json', 2, unicornPageTwo, false);
defaultButtonCheck();

//////// filter selection event
$('select').change(function() {
  // console.log(Unicorn.all);
  Unicorn.all.forEach(element => {
    if ('default' === this.value){
      $(`.${element.keyword}`).show();
      // console.log(element.title);
    } else if (element.keyword !== this.value) {
      $(`.${element.keyword}`).hide();
      // console.log(element.title);
    } else {
      $(`.${element.keyword}`).show();
      // console.log(element.title);
    }
  });
});

//////// page selection event
function pageOrSortChange(pageArr, pageNum) {
  ////remove images and filters
  $('.animal').remove();
  $('.filter').remove();
  noRepeatFilterArr = [];

  pageArr.forEach(element => {
    element.renderImage();
    element.renderFilter(pageArr);
  });
  console.log('before', pageNumber);
  pageNumber = pageNum;
  console.log('after', pageNumber);
}
$('#page-one').click(function() {
  pageOrSortChange(unicornPageOne, 1);
});
$('#page-two').click(function() {
  pageOrSortChange(unicornPageTwo, 2);
});


/////// sorting radio buttons
function defaultButtonCheck() {
  $('#by-title').prop('checked', true);
  if ($('#by-title').is(':checked')) {
    if (pageNumber === 1){
      console.log(pageNumber);
      sortArrByTitle(unicornPageOne);
      pageOrSortChange(unicornPageOne, 1);
      console.log('check');
    } else {
      sortArrByTitle(unicornPageTwo);
      pageOrSortChange(unicornPageTwo, 2);
    }
  }
}

$('#by-title').click(function() {
  if ($(this).is(':checked')) {
    console.log(pageNumber);
    if (pageNumber === 1){
      sortArrByTitle(unicornPageOne);
      pageOrSortChange(unicornPageOne, 1);
    } 
    if (pageNumber === 2) {
      sortArrByTitle(unicornPageTwo);
      pageOrSortChange(unicornPageTwo, 2);
    }
  }
});

function sortArrByTitle(pageArr){
  pageArr.sort((a, b) => {
    let fa = a.title.toLowerCase();
    let fb = b.title.toLowerCase();
    // console.log(pageArr);

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
}

$('#by-horn').click(function() {
  if ($(this).is(':checked')) {
    console.log(pageNumber);
    if (pageNumber === 1){
      sortArrByHorn(unicornPageOne);
      pageOrSortChange(unicornPageOne, 1);
    } 
    if (pageNumber ===2) {
      sortArrByHorn(unicornPageTwo);
      pageOrSortChange(unicornPageTwo, 2);
    }
  }
});

function sortArrByHorn(pageArr){
  pageArr.sort((a, b) => {
    let fa = a.horns;
    let fb = b.horns;
    console.log(pageArr);

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
}
