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

Unicorn.prototype.renderInitial = function() {
  const templateClone = $('#photo-template').clone();
  templateClone.find('h2').text(this.title);
  templateClone.find('p').text(this.description);
  templateClone.find('img').attr('src', this.image_url);
  templateClone.removeAttr('id', '#photo-template').attr('id', this.title);
  templateClone.attr('class', `animal ${this.keyword}`);
  $('main').append(templateClone);
};

Unicorn.prototype.renderFilter = function() {
  let preventRepeat = 1;
  Unicorn.all.forEach(element => {
    if (element.keyword === this.keyword){
      preventRepeat --;
      console.log(preventRepeat);
    }
  });
  if (preventRepeat === 0){
    const optionClone = $('#filter').clone();
    optionClone.removeAttr('id', 'filter');
    optionClone.removeAttr('value', 'default').attr('value', `${this.keyword}`);
    optionClone.text(this.keyword);
    $('#filter').after(optionClone);
  }
};

//////// ajax
const ajaxSettings = {
  method: 'get',
  dataType: 'json',
};

$.ajax('../data/page-1.json', ajaxSettings).then((data) => {
  data.forEach(unicorn => {
    let unicornObject = new Unicorn(unicorn);
    // console.log(unicornObject);

    //populate window with images
    unicornObject.renderInitial();
    unicornObject.renderFilter();
  });
});

//////// filter selection event
$('select').change(function() {
  console.log(this.value);
  console.log(Unicorn.all[0].keyword);
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

