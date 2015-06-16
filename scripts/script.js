(function() {
  var marks_factor = 5; // Marks multiplying factor
  var max_limit_items = 40; // Max limit for items to render on page
  var max_diameter = 90; // Max limit for balloon diameter
  var diameter = 50, // Setting up deafult value
    max_items = 10,
    probability = 80,
    max_speed_limit = 10,
    min_speed_limit = 3;
  $(document).ready(function() {
    $("#diameter-slider").slider({
      value: 0,
      orientation: "horizontal",
      range: "min",
      animate: true,
      slide: function(event, ui) {
        diameter = Math.floor((ui.value / 100) * max_diameter + 50);
        $('.diameter-reading').html(Math.floor((ui.value / 100) * max_diameter + 50));
      }
    });
    $("#item-slider").slider({
      value: 0,
      orientation: "horizontal",
      range: "min",
      animate: true,
      slide: function(event, ui) {
        max_items = Math.floor((ui.value / 100) * max_limit_items + 10);
        $('.item-reading').html(Math.floor((ui.value / 100) * max_limit_items + 10));
      }
    });
    $('.form-action .action').click(function() {
      var complexity = $('.radio-button[type="radio"][name="complexity"]:checked').val();
      if (complexity === 'easy') {
        max_speed_limit = 10;
        min_speed_limit = 3;
        probability = 80;
      } else if (complexity === 'normal') {
        max_speed_limit = 25;
        min_speed_limit = 7;
        probability = 70;
      } else if (complexity === 'expert') {
        max_speed_limit = 40;
        min_speed_limit = 15;
        probability = 55;
      }
      $('.initial-screen').addClass('hidden');
      generateContiniousItems(1000, max_items);
    });

    var updatePosition = function($obj, direction, speed) {
      var down_direc, up_direc, left_direc, right_direc, speedUnit;
      // Setting up the local variables for setting up the left right directions
      // Splitting up the variables to smaller ones to enhance the code readbility
      if (direction === 'top-left') {
        down_direc = false;
        up_direc = true;
        right_direc = false;
        left_direc = true;
      } else if (direction === 'top-right') {
        down_direc = false;
        up_direc = true;
        right_direc = true;
        left_direc = false;
      } else if (direction === 'bottom-right') {
        down_direc = true;
        up_direc = false;
        right_direc = true;
        left_direc = false;
      } else if (direction === 'bottom-left') {
        down_direc = true;
        up_direc = false;
        right_direc = false;
        left_direc = true;
      } else {
        down_direc = false;
        up_direc = true;
        right_direc = false;
        left_direc = true;
      }
      // Having conditioning and massaging the speed varible to have sensible speed
      speedUnit = speed / 10;
      // Setting up the boundaries for rebound effect
      var max_bottom_limit = $(window).height() - $obj.height();
      var max_left_limit = $(window).width() - $obj.width();

      var init_left = $obj.offset().left; // Getting the current position of the div element
      var init_top = $obj.offset().top;
      setInterval(function() { // Main logic
        $obj.css({
          top: init_top, // Updating the position of the div element (starts from the second iteration)
          left: init_left,
        });
        if (down_direc) { // If the ball vertical movement is down
          if (init_top < max_bottom_limit) {
            init_top = init_top + speedUnit; // Update the top position
            if (init_top >= max_bottom_limit) { // If the element bottom position exceeds the max lower boundary limit
              init_top = max_bottom_limit; //set the element position to the max bottom boundary limit
            }
          }
          if (init_top === max_bottom_limit) { // If the element has reached to the bottom of the page update the direction variables.
            down_direc = false; // Direction to top
            up_direc = true;
          }
        }
        if (up_direc) { // If the ball vertical movement is up
          if (init_top > 0) {
            init_top = init_top - speedUnit; // Update the top position
            if (init_top <= 0) { // If the element bottom position exceeds the max upper boundary limit
              init_top = 0; //set the element position to the upper max boundary limit
            }
          }
          if (init_top === 0) { // If the element has reached to the bottom of the page update the direction variables.
            down_direc = true; // Direction to bottom
            up_direc = false;
          }
        }
        if (right_direc) { // If the ball horizontal movement is right
          if (init_left < max_left_limit) {
            init_left = init_left + speedUnit; // Update the left position
            if (init_left >= max_left_limit) { // If the element left position exceeds the max right boundary limit
              init_left = max_left_limit; //set the element position to the max right boundary limit
            }
          }
          if (init_left === max_left_limit) { // If the element has reached to the bottom of the page update the direction variables.
            right_direc = false; // Direction to left
            left_direc = true;
          }
        }
        if (left_direc) { // If the ball horizontal movement is left
          if (init_left > 0) {
            init_left = init_left - speedUnit; // Update the left position
            if (init_left <= 0) { // If the element left position exceeds the max left boundary limit
              init_left = 0; //set the element position to the max left boundary limit
            }
          }
          if (init_left === 0) {
            right_direc = true; // Direction to right
            left_direc = false;
          }
        }
      }, 1); // Updating the position on every ms
    };

    function getRandomNumber(min, max) { // To generate random speed between between max and min rage of speed for the created balloons
      return Math.floor(Math.random() * (max - min) + min);
    }

    function getRandomDirection() { // To generate random direction for the created balloons
      var decidingUnit = Math.floor(Math.random() * 100) % 4;
      if (decidingUnit === 0) {
        return 'top-left';
      } else if (decidingUnit === 1) {
        return 'top-right';
      } else if (decidingUnit === 2) {
        return 'bottom-left';
      } else if (decidingUnit === 3) {
        return 'bottom-right';
      }
    }
    var createItems = function() {
      var left = getRandomNumber(0, $(window).width() - diameter);
      var top = getRandomNumber(0, $(window).height() - diameter);
      var $newObj;
      var speed = getRandomNumber(min_speed_limit, max_speed_limit);
      if (getRandomNumber(0, 100) < probability) {
        $newObj = $('<div>', {
          class: 'ball gravity-enabled',
          style: 'width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + 'px ; left : ' + left + 'px; background-color : rgb(' + getRandomNumber(0, 255) + ', ' + getRandomNumber(0, 255) + ' ,' + getRandomNumber(0, 255) + ');',
          'data-speed': speed
        });
      } else {
        if ($('.bomb').length < Math.floor(max_items / 5)) {
          $newObj = $('<div>', {
            class: 'bomb gravity-enabled',
            style: 'width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + 'px ; left : ' + left + 'px',
            'data-speed': speed
          });
        } else {
          $newObj = $('<div>', {
            class: 'ball gravity-enabled',
            style: 'width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + 'px ; left : ' + left + 'px; background-color : rgb(' + getRandomNumber(0, 255) + ', ' + getRandomNumber(0, 255) + ' ,' + getRandomNumber(0, 255) + ');',
            'data-speed': speed
          });

        }
      }
      $('body').append($newObj);
      updatePosition($newObj, getRandomDirection(), speed);
    };
    var generateContiniousItems = function(interval, limit) { // This will be called when user hits start new gane button
      for (i = 0; i < 7; i++) {
        createItems();
      } // initial Boost
      var tt = setInterval(function() {
        if ($('.ball').length < limit) {
          createItems();
        }
      }, interval);
    };
  });
  $(document).on('click', '.ball', function() {
    $(this).fadeOut(100);
    var marks = parseInt($('.computed_score').text(), 10) + (parseInt($(this).attr('data-speed'), 10) * marks_factor);
    $('.computed_score').html(marks);
    $(this).remove();
  });
  $(document).on('click', '.bomb', function() {
    $(this).fadeOut(100);
    var marks = $('.computed_score').text();
    $('.score-board').html(marks);
    $('.final-score-screen').removeClass('hidden');
  });
})(jQuery);
