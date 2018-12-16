main = {
  initWizard: function() {
    //Русская локализация
    $.extend( $.validator.messages,  {
      required: "Это поле необходимо заполнить.",
      remote: "Пожалуйста, введите правильное значение.",
      email: "Пожалуйста, введите корректный адрес электронной почты.",
      url: "Пожалуйста, введите корректный URL.",
      date: "Пожалуйста, введите корректную дату.",
      dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
      number: "Пожалуйста, введите число.",
      digits: "Пожалуйста, вводите только цифры.",
      creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
      equalTo: "Пожалуйста, введите такое же значение ещё раз.",
      extension: "Пожалуйста, выберите файл с правильным расширением.",
      maxlength: $.validator.format( "Пожалуйста, введите не больше {0} символов." ),
      minlength: $.validator.format( "Пожалуйста, введите не меньше {0} символов." ),
      rangelength: $.validator.format( "Пожалуйста, введите значение длиной от {0} до {1} символов." ),
      range: $.validator.format( "Пожалуйста, введите число от {0} до {1}." ),
      max: $.validator.format( "Пожалуйста, введите число, меньшее или равное {0}." ),
      min: $.validator.format( "Пожалуйста, введите число, большее или равное {0}." )
    });
    // Code for the Validator
    var $validator = $('.card-wizard form').validate({
      rules: {
        firstname: {
          required: true,
          minlength: 3
        },
        lastname: {
          required: true,
          minlength: 3
        },
        email: {
          required: true,
          minlength: 3,
        }
      },
      highlight: function(element) {
        $(element).closest('.input-group').removeClass('has-success').addClass('has-danger');
      },
      success: function(element) {
        $(element).closest('.input-group').removeClass('has-danger').addClass('has-success');
      }
    });

    // Wizard Initialization
    $('.card-wizard').bootstrapWizard({
      'tabClass': 'nav nav-pills',
      'nextSelector': '.btn-next',
      'previousSelector': '.btn-previous',

      onNext: function(tab, navigation, index) {
        var $valid = $('.card-wizard form').valid();
        if (!$valid) {
          $validator.focusInvalid();
          return false;
        }
      },

      onInit: function(tab, navigation, index) {
        //check number of tabs and fill the entire row
        var $total = navigation.find('li').length;
        var $wizard = navigation.closest('.card-wizard');

        first_li = navigation.find('li:first-child a').html();
        $moving_div = $("<div class='moving-tab'></div>");
        $moving_div.append(first_li);
        $('.card-wizard .wizard-navigation').append($moving_div);



        refreshAnimation($wizard, index);

        $('.moving-tab').css('transition', 'transform 0s');
      },

      onTabClick: function(tab, navigation, index) {
        var $valid = $('.card-wizard form').valid();

        if (!$valid) {
          return false;
        } else {
          return true;
        }
      },

      onTabShow: function(tab, navigation, index) {
        var $total = navigation.find('li').length;
        var $current = index + 1;

        var $wizard = navigation.closest('.card-wizard');

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
          $($wizard).find('.btn-next').hide();
          $($wizard).find('.btn-finish').show();
        } else {
          $($wizard).find('.btn-next').show();
          $($wizard).find('.btn-finish').hide();
        }

        button_text = navigation.find('li:nth-child(' + $current + ') a').html();

        setTimeout(function() {
          $('.moving-tab').html(button_text);
        }, 150);

        var checkbox = $('.footer-checkbox');

        if (!index == 0) {
          $(checkbox).css({
            'opacity': '0',
            'visibility': 'hidden',
            'position': 'absolute'
          });
        } else {
          $(checkbox).css({
            'opacity': '1',
            'visibility': 'visible'
          });
        }

        refreshAnimation($wizard, index);
      }
    });


    // Prepare the preview for profile picture
    $("#wizard-picture").change(function() {
      readURL(this);
    });

    $('[data-toggle="wizard-radio"]').click(function() {
      wizard = $(this).closest('.card-wizard');
      wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
      $(this).addClass('active');
      $(wizard).find('[type="radio"]').removeAttr('checked');
      $(this).find('[type="radio"]').attr('checked', 'true');
    });

    $('[data-toggle="wizard-checkbox"]').click(function() {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).find('[type="checkbox"]').removeAttr('checked');
      } else {
        $(this).addClass('active');
        $(this).find('[type="checkbox"]').attr('checked', 'true');
      }
    });

    $('.set-full-height').css('height', 'auto');

    //Function to show image before upload

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }

    $(window).resize(function() {
      $('.card-wizard').each(function() {
        $wizard = $(this);

        index = $wizard.bootstrapWizard('currentIndex');
        refreshAnimation($wizard, index);

        $('.moving-tab').css({
          'transition': 'transform 0s'
        });
      });
    });

    function refreshAnimation($wizard, index) {
      $total = $wizard.find('.nav li').length;
      $li_width = 100 / $total;

      total_steps = $wizard.find('.nav li').length;
      move_distance = $wizard.width() / total_steps;
      index_temp = index;
      vertical_level = 0;

      mobile_device = $(document).width() < 600 && $total > 3;

      if (mobile_device) {
        move_distance = $wizard.width() / 2;
        index_temp = index % 2;
        $li_width = 50;
      }

      $wizard.find('.nav li').css('width', $li_width + '%');

      step_width = move_distance;
      move_distance = move_distance * index_temp;

      $current = index + 1;

      // if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
      //     move_distance -= 8;
      // } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
      //     move_distance += 8;
      // }

      if (mobile_device) {
        vertical_level = parseInt(index / 2);
        vertical_level = vertical_level * 38;
      }

      $wizard.find('.moving-tab').css('width', step_width);
      $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

      });
    }
  },
  
  initDateTimePicker: function() {
    if ($(".datetimepicker").length != 0) {
      $('.datetimepicker').datetimepicker({
        locale: 'ru',
        icons: {
          time: "nc-icon icon-clock-1",
          date: "nc-icon icon-calendar",
          up: "nc-icon icon-up-open",
          down: "nc-icon icon-down-open",
          previous: 'nc-icon icon-left-open',
          next: 'nc-icon icon-right-open',
          today: 'nc-icon icon-desktop',
          clear: 'nc-icon icon-trash-empty',
          close: 'nc-icon icon-cancell'
        }
      });
    }

    if ($(".timepicker").length != 0) {
      $('.timepicker').datetimepicker({
        //          format: 'H:mm',    // use this format if you want the 24hours timepicker
        format: 'H:mm', //use this format if you want the 12hours timpiecker with AM/PM toggle
        icons: {
          time: "nc-icon icon-clock-1",
          date: "nc-icon icon-calendar",
          up: "nc-icon icon-up-open",
          down: "nc-icon icon-down-open",
          previous: 'nc-icon icon-left-open',
          next: 'nc-icon icon-right-open',
          today: 'nc-icon icon-desktop',
          clear: 'nc-icon icon-trash-empty',
          close: 'nc-icon icon-cancell'
        }
      });
    }
  },

  initSliders: function() {
    // Sliders for demo purpose in refine cards section
    var slider = document.getElementById('sliderRegular');

    noUiSlider.create(slider, {
      start: 40,
      connect: [true, false],
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById('sliderDouble');

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });
  },
  /*
  =============УВЕДОМЛЕНИЯ==============
  */
 	/* Функция поллучения уведомлений из notifi.json */
  updateNotifications: function() {
    var messages = new Array();
    $.getJSON("notifi.json", function (jsonData) {
      $.each(jsonData, function(idx, obj) {
          if(obj.status) {
            var elemsNotifyClass = document.getElementById('notifyClass').getElementsByTagName('*');
            var unique = true;
            for(var i=0; i<elemsNotifyClass.length; i++) {
              if(elemsNotifyClass[i].innerHTML==obj.text) {
                unique = false;
              }
            }
          if(unique) {
            var notifi = document.createElement("A");      
            notifi.className = "dropdown-item";
            notifi.onclick = function (onclick) { 
              main.showNotificationByCode(obj.code, obj.type);
            };        
            notifi.innerHTML = obj.text;                          
            document.getElementById("notifyClass").appendChild(notifi);
          }
        }
      });
    });
  },

  showNotificationByCode: function(code, type) {
   var options = {
     from: 'bottom',
     align: 'right',
     timer: 8000,
   }

   switch(code) {
    case 1:
      options.message = 'Фатальная ошибка системы.';
      break;
    case 3:
      options.message = 'Изменения сохранены.'
      break;
    default:
      options.message = 'Произошла неизвестная ошибка.';
      break;
    }

    switch(type) {
      case 'error':
        options.color = 'danger';
        options.message += '</br><b>Код ошибки: ' + code.toString() + '</b>';
        break;
      case 'info':
        options.color = 'info';
        break;
      case 'success':
        options.color = 'success';
        break;
      case 'warning':
        options.color = 'warning';
        break;
      default:
        options.color = 'primary';
        break;
    }

    main.showNotification(options);  
 },

 showNotification: function(options) {
  var message_time = options.timer || 8000;
  var vertical_aligh = options.from || 'bottom';
  var horizontal_align = options.align || 'right';
  var message_type = options.color || 'primary';
  var message_text = options.message || 'Добро пожаловать в панель управления <b>HARVESTECH</b>';

    $.notify({
      icon: "nc-icon icon-bell",
      message: message_text

    }, {
      type: message_type,
      timer: message_time,
      placement: {
        from: vertical_aligh,
        align: horizontal_align
      }
    });
  }
};
$(function() {
  setInterval(function(){ main.updateNotifications(); }, 10000);
});