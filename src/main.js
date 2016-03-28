var MeetupApp = {
  handleFavorite: function() {
    $('.events').on('click', '.favorite', function(event) {
      event.preventDefault();
      MeetupApp.favoriteEvent(event);
    });
  },

  handleSearch: function() {
    $('#search-field').on('keyup', function(event) {
      if (event.keyCode === 13) {
        MeetupApp.renderEvents($('#search-field').val());
      }
    });

    $('.button--primary').on('click', function() {
      MeetupApp.renderEvents($('#search-field').val());
    })
  },

  favoriteEvent: function(event) {
    var target = event.target;
    var star = target.firstElementChild;

    $(target).toggleClass('favorited');
    $(star).addClass('animate--bounceInSubtle');

    setTimeout(function () {
      $(star).removeClass('animate--bounceInSubtle');
    }, 300);
  },

  renderSearchTemplate: function() {
    var $searchSection = $('.search');

    var title = $('<h2>').text('JavaScript Meetups');

    var inputField = $('<input>', {
      'id': 'search-field',
      'type': 'text',
      'placeholder': 'Search by ZIP code',
      'autocomplete': 'postal-code',
      'autofocus': true
    });

    var searchButton = $('<button>', {
      'class': 'button button--primary'
    }).text('Search');

    return $searchSection.append([title, inputField, searchButton]);
  },

  renderEventTemplate: function(index, event) {
    var eventName = event.name;
    var eventUrl = event.event_url;
    var eventTime = new Date(event.time);
    var eventRsvpLimit = event.rsvp_limit;
    var eventYesRsvp = event.yes_rsvp_count;
    var groupName = event.group.name;
    var groupMembers = event.group.who;
    var ableToRsvp = MeetupApp.spotsLeft(eventRsvpLimit, eventYesRsvp) != 'No spots left';
    var cardColor = ableToRsvp ? 'card--event card--event--draft' : 'card--event';

    // date display
    var dateTearSheet = $('<div>', {
      'class': 'dateTime-tearsheet'
    }).text(eventTime.getDate());

    var eventDate = $('<p>', {
      'class': 'display--inlineBlock'
    }).text(MeetupApp.eventDateTime(eventTime));

    var dateTime = $('<div>', {
      'class': 'dateTime'
    }).append([dateTearSheet, eventDate]);

    // favorite
    var favorite = $('<div>', {
      'class': 'row-item row-item--shrink align--right'
    }).
      append($('<p>', {'class': 'text--caption favorite'}).
        html('Favorite <i class="fa fa-star"></i>'));

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
        text(MeetupApp.spotsLeft(eventRsvpLimit, eventYesRsvp)));

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

    return $('.events').append(eventCard);
  },

  renderEvents: function(zipcode) {
    $('.events').empty();
    // key provided in coding challenge doc
    var API_KEY = '6752511f3291b2b182ee4d2ef312';
    var zip = zipcode || 98109;

    $.ajax({
      url: 'https://api.meetup.com/2/open_events',
      method: 'GET',
      dataType: 'jsonp',
      data: {
        'key': API_KEY,
        'page': 10,
        'zip': zip,
        'text': 'javascript',
        'radius': 15,
        'order': 'trending',
        'desc': true
      },
    }).done(function(data) {
      $.each(data.results, function(index, event) {
        MeetupApp.renderEventTemplate(index, event);
      });
    }).fail(function(jqXHR) {
      alert(jqXHR.status + ': ' + 'Check your request url and try again.');
    });
  },

  spotsLeft: function(rsvpLimit, yesRsvp) {
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
  },

  day: function(dayIndex) {
    return [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
    ][dayIndex];
  },

  month: function(monthIndex) {
    return [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ][monthIndex];
  },

  /**
   * Formats datetime into the following format:
   * Monday Jan 13, 6:30 pm
   * @param {object} a date object
   */
  eventDateTime: function(dateObject) {
    var day = MeetupApp.day(dateObject.getDay());
    var month = MeetupApp.month(dateObject.getMonth());
    var date = dateObject.getDate() + ',';
    var time = dateObject.toLocaleTimeString().substr(0, 4);
    var amPm = dateObject.toLocaleTimeString().substr(8).toLowerCase();

    return [day, month, date, time, amPm].join(' ');
  }
}

$(document).ready(function($) {
  MeetupApp.renderSearchTemplate();
  MeetupApp.renderEvents();
  MeetupApp.handleSearch();
  MeetupApp.handleFavorite();
});

