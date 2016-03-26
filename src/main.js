$(document).ready(function($) {
  // key provided in coding challenge doc
  API_KEY = '6752511f3291b2b182ee4d2ef312';

  var $eventsSection = $('.events');
  var zipcode = $('#search-field').val();

  function renderPage(zipcode) {
    $eventsSection.empty();

    $.ajax({
      url: 'https://api.meetup.com/2/open_events',
      method: 'GET',
      dataType: 'jsonp',
      data: {
        'key': API_KEY,
        'page': 10,
        'zip': zipcode || '98101',
        'topic': 'javascript',
        'radius': 15,
        'order': 'trending',
        'desc': true
      },
    }).done(function(data) {
      // loop through the results to display events
      $.each(data.results, function(index, event) {
        renderEventTemplate(index, event);
      });
    }).fail(function(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.status + ': ' + 'Check your request url and try again.');
    });
  }

  function attachEventListeners() {
    // Favoriting
    $eventsSection.on('click', '.favorite', function() {
      event.preventDefault();
      $(this).toggleClass('favorited');
      $('.fa-star-o').addClass('animate--spin');

      setTimeout(function () {
        $('.fa-star-o').removeClass('animate--spin');
      }, 300);
    });

    // Searching
    $('#search-field').on('keyup', function(event) {
      if (event.keyCode === 13) {
        renderPage(zipcode);
      }
    });

    $('.button--primary').on('click', function() {
      renderPage(zipcode);
    })
  }

  function renderEventTemplate(index, event) {
    var eventName = event.name;
    var eventUrl = event.event_url;
    var eventTime = new Date(event.time);
    var eventRsvpLimit = event.rsvp_limit;
    var eventYesRsvp = event.yes_rsvp_count;
    var groupName = event.group.name;
    var groupMembers = event.group.who;
    var ableToRsvp = spotsLeftText(eventRsvpLimit, eventYesRsvp) != 'No spots left';
    var cardColor = ableToRsvp ? 'card--event card--event--draft' : 'card--event';

    // date display
    var dateTearSheet = $('<div>', {
      'class': 'dateTime-tearsheet'
    }).text(eventTime.getDate());

    var eventDate = $('<p>', {
      'class': 'display--inlineBlock'
    }).text(renderDate(eventTime));

    var dateTime = $('<div>', {
      'class': 'dateTime'
    }).append([dateTearSheet, eventDate]);

    // favorite
    var favorite = $('<div>', {
      'class': 'row-item row-item--shrink align--right'
    }).
      append($('<p>', {'class': 'text--caption favorite'}).
        html('Favorite <i class="fa fa-star-o"></i>'));

    // card header which includes favorite and date display
    var cardHeader = $('<div>', {
      'class': 'row row--spaceBetween card-header'
    }).append([dateTime, favorite]);

    // spots left
    var spotsLeft = $('<div>', {
      'class': 'spots-available'
    }).
      append($('<p>', {
        'class': 'text--caption display--block'
      }).
        text(spotsLeftText(eventRsvpLimit, eventYesRsvp)));

    // event info
    var group = $('<p>', {
      'class': 'text--small text--bold meetup-group'
    }).text(groupName);

    var eventName = $('<h2>').text(eventName);

    var whoIsGoing = $('<p>', {
      'class': 'text--caption'
    }).text(eventYesRsvp + ' ' + groupMembers + ' ' + 'going')

    var eventInfo = $('<div>', {
      'class': 'event-info padding--top'
    }).append([group, eventName, whoIsGoing]);

    // event card
    var eventCard = $('<a>', {
      'href': eventUrl,
      'class': 'card ' + cardColor,
      'target': '_blank'
    }).append([cardHeader, spotsLeft, eventInfo]);

    return $eventsSection.append(eventCard);
  }

  function dayString(dayIndex) {
    return [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
    ][dayIndex];
  }

  function monthString(monthIndex) {
    return [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ][monthIndex];
  }

  /**
   * Formats datetime into the following format:
   * Monday Jan 13, 6:30 pm
   * @param {object} a date object
   */
  function renderDate(dateObject) {
    var day = dayString(dateObject.getDay());
    var month = monthString(dateObject.getMonth());
    var date = dateObject.getDate() + ',';
    var time = dateObject.toLocaleTimeString().substr(0, 4);
    var amPm = dateObject.toLocaleTimeString().substr(8).toLowerCase();

    return [day, month, date, time, amPm].join(' ');
  }

  function spotsLeftText(rsvpLimit, yesRsvp) {
    if (rsvpLimit) {
      var spotsRemaining = rsvpLimit - yesRsvp;

      if (spotsRemaining <= 0) {
        return 'No spots left'
      } else {
        return spotsRemaining + ' spots left';
      }
    } else {
      return "Meetup with us!"
    }
  }

  renderPage();
  attachEventListeners();
});

