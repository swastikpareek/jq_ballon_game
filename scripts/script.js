(function() {
  var initialize_game = false;
  var marks_factor = 5;
  var max_limit_items = 40;
  var max_diameter = 90;
  var diameter = 50,
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
      speedUnit = speed / 10;
      var max_bottom_limit = $(window).height() - $obj.height();
      var max_left_limit = $(window).width() - $obj.width();

      var init_left = $obj.offset().left;
      var init_top = $obj.offset().top;
      setInterval(function() {
        $obj.css({
          top: init_top,
          left: init_left,
        });
        if (down_direc) {
          if (init_top < max_bottom_limit) {
            init_top = init_top + speedUnit;
            if (init_top >= max_bottom_limit) {
              init_top = max_bottom_limit;
            }
          }
          if (init_top === max_bottom_limit) {
            down_direc = false;
            up_direc = true;
          }
        }
        if (up_direc) {
          if (init_top > 0) {
            init_top = init_top - speedUnit;
            if (init_top <= 0) {
              init_top = 0;
            }
          }
          if (init_top === 0) {
            down_direc = true;
            up_direc = false;
          }
        }
        if (right_direc) {
          if (init_left < max_left_limit) {
            init_left = init_left + speedUnit;
            if (init_left >= max_left_limit) {
              init_left = max_left_limit;
            }
          }
          if (init_left === max_left_limit) {
            right_direc = false;
            left_direc = true;
          }
        }
        if (left_direc) {
          if (init_left > 0) {
            init_left = init_left - speedUnit;
            if (init_left <= 0) {
              init_left = 0;
            }
          }
          if (init_left === 0) {
            right_direc = true;
            left_direc = false;
          }
        }
      }, 1);
    };

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    function getRandomDirection() {
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
        $newObj = $('<div class="ball gravity-enabled small" style=" width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + ' ; left : ' + left + '; background-color : rgb(' + getRandomNumber(0, 255) + ', ' + getRandomNumber(0, 255) + ' ,' + getRandomNumber(0, 255) + ');" data-speed="' + speed + '"></div>');
      } else {
        if ($('.bomb').length < Math.floor(max_items / 5)) {
          $newObj = $('<div class="bomb gravity-enabled small" style="width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + ' ; left : ' + left + ';" data-speed="' + speed + '"></div>');
        } else {
          $newObj = $('<div class="ball gravity-enabled small" style="width : ' + diameter + 'px; height: ' + diameter + 'px; top : ' + top + ' ; left : ' + left + '; background-color : rgb(' + getRandomNumber(0, 255) + ', ' + getRandomNumber(0, 255) + ' ,' + getRandomNumber(0, 255) + ');" data-speed="' + speed + '"></div>');
        }
      }
      $('body').append($newObj);
      updatePosition($newObj, getRandomDirection(), speed);
    };
    var generateContiniousItems = function(interval, limit) {
      for (i = 0; i < 7; i++) {
        createItems();
      } // initial Boost
      var tt = setInterval(function() {
        if ($('.ball').length < limit) {
          createItems();
        }
      }, interval);
    };
    // $('.ball').each(function() {
    //   var left = getRandomNumber(0, $(window).width() - diameter);
    //   var top = getRandomNumber(0, $(window).height() - diameter);
    //   var speed = getRandomNumber(min_speed_limit, max_speed_limit);
    //   $(this).css({
    //     'background-color': 'rgb(' + getRandomNumber(0, 255) + ', ' + getRandomNumber(0, 255) + ' ,' + getRandomNumber(0, 255) + ')',
    //     'top': top + 'px',
    //     'left': left + 'px',
    //     'width': diameter + 'px',
    //     'height': diameter + 'px',
    //   });
    //   $(this).attr('data-speed', speed);
    //   updatePosition($(this), getRandomDirection(), speed);
    // });
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
    $('body').append('<div class="final-score-screen"><div class="table"><div class="table-cell"><div>Your Score is : ' + marks + '</div><div class="new_game"><button onclick="location.reload()">New Game </button></div></div></div></div>');
  });
})(jQuery);
