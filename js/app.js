'use strict';

//////// Constructor
function Unicorn(unicorn) {
  this.title = unicorn.title;
  this.image_url = unicorn.image_url;
  this.description = unicorn.description;
  this.keyword = unicorn.keyword;
  this.horns = unicorn.horns;
  Unicorn.all.push(this);
}
Unicorn.all = [];

Unicorn.prototype.renderImage = function() {
  // const templateClone = $('#photo-template').clone();
  // templateClone.find('h2').text(this.title);
  // templateClone.find('p').text(this.description);
  // templateClone.find('img').attr('src', this.image_url);
  // templateClone.removeAttr('id', '#photo-template').attr('id', this.title);
  // templateClone.attr('class', `animal ${this.keyword}`);
  // $('main').append(templateClone);

  let templatePhoto = $('#photo-mustache-template').html();
  let html = Mustache.render(templatePhoto, this);
  $('main').append(html);
};

// Unicorn.prototype.renderFilter = function(pageNum) {
//   let preventRepeat = 1;
//   Unicorn.all.forEach(element => {
//     if (element.keyword === this.keyword && element.page === pageNum){
//       preventRepeat --;
//       // console.log(preventRepeat);
//     }
//   });
//   if (preventRepeat === 0){
//     const optionClone = $('#filter').clone();
//     optionClone.removeAttr('id', 'filter');
//     optionClone.attr('class', 'option filter');
//     optionClone.removeAttr('value', 'default').attr('value', `${this.keyword}`);
//     optionClone.text(this.keyword);
//     $('#filter').after(optionClone);
//   }
// };

Unicorn.prototype.renderFilter = function() {
  // const optionClone = $('#filter').clone();
  // optionClone.removeAttr('id', 'filter');
  // optionClone.attr('class', `option filter`);
  // optionClone.removeAttr('value', 'default').attr('value', `${this.keyword}`);
  // optionClone.text(this.keyword);
  // $('#filter').after(optionClone);

  let templateFilter = $('#filter-template').html();
  let html = Mustache.render(templateFilter, this);
  $('#select-filter').append(html);
};

//////// ajax
const ajaxSettings = {
  method: 'get',
  dataType: 'json',
};

// $.ajax('data/page-1.json', ajaxSettings).then((data) => {
//   data.forEach(unicorn => {
//     let unicornObject = new Unicorn(unicorn);
//     // add page property
//     unicornObject.page = 1;
//     console.log('page', unicornObject.page);

//     //populate window with images
//     unicornObject.renderImage();
//     unicornObject.renderFilter();
//   });
// });

function ajaxAndRender(url, pageNum, renderOrNot) {
  $.ajax(url, ajaxSettings).then((data) => {
    data.forEach(unicorn => {
      let unicornObject = new Unicorn(unicorn);
      // add page property
      unicornObject.page = pageNum;
      console.log('page', unicornObject.page);

      //populate window and filter with images
      if (renderOrNot === true){
        unicornObject.renderImage();
        unicornObject.renderFilter();
      }
    });
  });
}

//////// initial rendering on load, and instantiating objects for both pages
ajaxAndRender('data/page-1.json', 1, true);
ajaxAndRender('data/page-2.json', 2, false);

//////// page selection event
function pageChange(pageNum) {
  ////remove images and filters
  $('.animal').remove();
  $('.filter').remove();
  Unicorn.all.forEach(element => {
    if (element.page === pageNum){
      element.renderImage();
      element.renderFilter();
    }
  });
  console.log(Unicorn.all);
}
$('#page-one').click(function() {
  pageChange(1);
});
$('#page-two').click(function() {
  pageChange(2);
});


//////// filter selection event
$('select').change(function() {
  console.log(this.value);
  Unicorn.all.forEach(element => {
    if ('default' === this.value){
      $(`.${element.keyword}`).show();
    } else if (element.keyword !== this.value) {
      $(`.${element.keyword}`).hide();
    } else {
      $(`.${element.keyword}`).show();
    }
  });
});

