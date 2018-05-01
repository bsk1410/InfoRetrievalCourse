function Listitemfilter(form){
  this.form = form;
  this.ele = this.form.querySelector('input');
  this.usetitles = (this.form.getAttribute('data-lif-use-titles') === 'true');
  this.needsPolyfillPlaceholder = (typeof this.ele.placeholder == 'undefined');

  var items = {
    eles: form.parentNode.getElementsByTagName('li'),
    text: []
  };

  this.init = function(){

    // Collect the list items
    if(items.eles.length > 0){

      // Pass search text from elements to a stored array
      for(var i = 0; i < items.eles.length; i++){

        var html = items.eles[i].innerHTML,
            main = '',
            title = '',
            all = [];

        // Isolate main element text
        main = html.replace(/<[^<>]+>/g,'');

        // Isolate title attribute text
        if(this.usetitles){

          // Isolate first title in html, replace commas with spaces, remove extra spaces
          title = html.match(/title="([^"]*)"/);
          if(title)
            title = title[1].replace(/\s*,\s*/g,' ').replace(/\s+/,' ');

        }

        // Combine text to be stored
        if(main != '')
          all.push(main);
        if(title != '')
          all.push(title);

        // Store text
        items.text.push(all.join(' '));

      }

      // Initialize the search box
      this.ele.addEventListener('keyup', this.handler);

      // Prevent the form from being submitted
      this.form.addEventListener('submit', this.preventSubmit);

      // Polyfill for IE9, input's placeholder attribute
      if(this.needsPolyfillPlaceholder){
        this.polyfillPlaceholder();
      }

    }
  };

  this.handler = function(e){
    
    var value = e.target.value,
        toShow = [],
        toHide = [],
        valuesToCheck = [];

    // Remove the commas and spaces at the ends of the search string
    value = value.replace(/^\s+/, '').replace(/\s+$/, '').replace(/,/g, '');

    if(value != ''){

      // Show only some items
      // If the search box has multiple words, search for them individually in addition to the whole value
      if(value.indexOf(' ') > 0){
        valuesToCheck = value.split(' ');
      }

      // Add the full value to the checked group
      valuesToCheck.push(value);

      // Loop through each stored item
      for(var i = 0; i < items.text.length; i++){

        var itemtext = items.text[i].toLowerCase(),
            found = false;

        // Compare each word in the search string to the item's searchable text
        for(var j = 0; j < valuesToCheck.length; j++){

          if(itemtext.indexOf(valuesToCheck[j]) > -1){

            // Show item
            toShow.push(items.eles[i]);
            found = true;
            break;

          }

        }

        // Hide unmatched stored items
        if(!found) {
          toHide.push(items.eles[i]);
        }

      }

    } else {

      // Show all items
      toShow = items.eles;

    }
    
    // Show and hide elements
    for(var i = 0; i < toShow.length; i++){
      toShow[i].style.display = '';
    }

    for(var i = 0; i < toHide.length; i++){
      toHide[i].style.display = 'none';
    }

  };

  this.preventSubmit = function(e){

    e.preventDefault();
    return false;

  };

  this.polyfillPlaceholder = function(){

    this.ele.value = this.ele.getAttribute('placeholder');
    this.ele.addEventListener('focus', this.polyfillPHFocus);
    this.ele.addEventListener('blur', this.polyfillPHBlur);

  };

  this.polyfillPHFocus = function(e){

    var placeholder = e.target.getAttribute('placeholder');
    if(e.target.value == placeholder){
      e.target.value = '';
    }

  };

  this.polyfillPHBlur = function(e){

    var placeholder = e.target.getAttribute('placeholder');
    if(e.target.value == ''){
      e.target.value = placeholder;
    }

  };

  this.init();
}

// For each instance of shortcode, create new list filter object
window.addEventListener('load', function(){

  var forms = document.querySelectorAll('form.listitem-filterbox');

  for(var i = 0; i < forms.length; i++){
    new Listitemfilter(forms[i]);
  }

});
