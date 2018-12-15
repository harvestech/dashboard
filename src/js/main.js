main = {

  /*
  =============УВЕДОМЛЕНИЯ==============
  */
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