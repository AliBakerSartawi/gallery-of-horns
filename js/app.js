'use strict';

////// global variables
Unicorn.all = [];
let unicornPageOne = [];
let unicornPageTwo = [];

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
Unicorn.prototype.renderFilter = function(filterPageArr) {
  let preventRepeat = 1;

  filterPageArr.forEach(element => {
    if (element.keyword === this.keyword){
      preventRepeat --;
      // console.log(preventRepeat);
    }
  });
  // console.log(preventRepeat);
  if (preventRepeat === 0){
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

function ajaxAndRender(url, pageNum, filterPageArr, renderOrNot) {
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

      //populate window and filter with images
      if (renderOrNot === true){
        unicornObject.renderImage();
        unicornObject.renderFilter(filterPageArr);
      }
    });
  });
}

//////// filter selection event
$('select').change(function() {
  // console.log(this.value);
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


//////// page selection event
function pageChange(pageNum, filterPageArr) {
  ////remove images and filters
  $('.animal').remove();
  $('.filter').remove();
  // Unicorn.all.forEach(element => {
  //   console.log(element.page);
  //   if (element.page === pageNum){
  //     console.log(element.page);
  //     element.renderImage();
  //     element.renderFilter(filterPageArr);
  //   }
  // });
  filterPageArr.forEach(element => {
    element.renderImage();
    element.renderFilter(filterPageArr);
  });
}
$('#page-one').click(function() {
  pageChange(1, unicornPageOne);
});
$('#page-two').click(function() {
  pageChange(2, unicornPageTwo);
});



///////title sorting function
console.log(unicornPageOne);


unicornPageOne.sort((a, b) => {
  let fa = a.title.toLowerCase();
  let fb = b.title.toLowerCase();
  console.log(unicornPageOne);

  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
});

/////// sorting test, works fine
let testArr = [
  {number: 3},
  {number: 6},
  {number: 17},
];
// console.log(testArr);
testArr.sort((a, b) => {
  let fa = a.horns;
  let fb = b.horns;
  // console.log(testArr);

  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
});


///////// sorting radio buttons
// if ($('#by-title').is(':checked')) {
//   initial sorting here
// }

$('#by-title').click(function() {
  if ($(this).is(':checked')) {
    alert('wow');
  }
});

//////// initial rendering on load, and instantiating objects for both pages
ajaxAndRender('data/page-1.json', 1, unicornPageOne, true);
ajaxAndRender('data/page-2.json', 2, unicornPageTwo, false);
