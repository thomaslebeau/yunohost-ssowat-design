/* ----------------------------------------------------------
  Utilities
---------------------------------------------------------- */

/* Console log fix
-------------------------- */
if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}


/* Array utilities
  https://github.com/Darklg/JavaScriptUtilities/blob/master/assets/js/vanilla-js/libs/vanilla-arrays.js
-------------------------- */
Array.contains = function(needle, haystack) {
    var i = 0,
        length = haystack.length;

    for (; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
};
Array.each = function(arrayToParse, callback) {
    var i = 0,
        length = arrayToParse.length;
    for (; i < length; i++) {
        callback(arrayToParse[i]);
    }
};



/* CSS classes utilities
  https://github.com/Darklg/JavaScriptUtilities/blob/master/assets/js/vanilla-js/libs/vanilla-classes.js
-------------------------- */
Element.getClassNames = function(element) {
    var classNames = [],
        elementClassName = element.className;
    if (elementClassName !== '') {
        elementClassName = elementClassName.replace(/\s+/g, ' ');
        classNames = elementClassName.split(' ');
    }
    return classNames;
};
Element.hasClass = function(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    return Array.contains(className, Element.getClassNames(element));
};
Element.addClass = function(element, className) {
    if (element.classList) {
        element.classList.add(className);
        return;
    }
    if (!Element.hasClass(element, className)) {
        var elementClasses = Element.getClassNames(element);
        elementClasses.push(className);
        element.className = elementClasses.join(' ');
    }
};
Element.removeClass = function(element, className) {
    if (element.classList) {
        element.classList.remove(className);
        return;
    }
    var elementClasses = Element.getClassNames(element);
    var newElementClasses = [];
    var i = 0,
        arLength = elementClasses.length;
    for (; i < arLength; i++) {
        if (elementClasses[i] !== className) {
            newElementClasses.push(elementClasses[i]);
        }
    }
    element.className = newElementClasses.join(' ');
};
Element.toggleClass = function(element, className) {
    if (!Element.hasClass(element, className)) {
        Element.addClass(element, className);
    }
    else {
        Element.removeClass(element, className);
    }
};


/* Add Event
  https://github.com/Darklg/JavaScriptUtilities/blob/master/assets/js/vanilla-js/libs/vanilla-events.js
-------------------------- */
window.addEvent = function(el, eventName, callback) {
    if (el.addEventListener) {
        el.addEventListener(eventName, callback, false);
    }
    else if (el.attachEvent) {
        el.attachEvent("on" + eventName, function(e) {
            return callback.call(el, e);
        });
    }
};
window.eventPreventDefault = function(event) {
    return (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
};


/* Smallest DOMReady
  http://dustindiaz.com/smallest-domready-ever
-------------------------- */
function domReady(cb) {
   /in/.test(document.readyState) // in = loadINg
      ? setTimeout('domReady('+cb+')', 9)
      : cb();
}


/* ----------------------------------------------------------
  Main
---------------------------------------------------------- */
domReady(function(){
  // Don't do this in iframe
  if (window.self !== window.top) {return false;}

  // Add portal stylesheet
  var portalStyle = document.createElement("link");
  portalStyle.setAttribute("rel", "stylesheet");
  portalStyle.setAttribute("type", "text/css");
  portalStyle.setAttribute("href", '/ynhpanel.css');
  document.getElementsByTagName("head")[0].insertBefore(portalStyle, null);

  // Create portal link
  var portal = document.createElement('a');
  portal.setAttribute('id', 'ynhportal');
  portal.setAttribute('href', '/ynhsso/');
  document.body.insertBefore(portal, null);

  // Create overlay element
  var overlay = document.createElement("div");
  overlay.setAttribute("id","ynhoverlay");
  overlay.setAttribute("style","display:none");

  document.body.insertBefore(overlay, null);

  //Color Application
  var colors = ['bluebg','purplebg','redbg','orangebg','greenbg','darkbluebg','lightbluebg','yellowbg','lightpinkbg'];

  // Get user's app
  var r = new XMLHttpRequest();
  r.open("GET", "/ynhpanel.json", true);
  r.onreadystatechange = function () {
    // Die if error
    if (r.readyState != 4 || r.status != 200) return;

    // Response is JSON
    document.querySelector('body').classList.add('ynh-panel-active');
    response = JSON.parse(r.responseText);

    // Append close button
    /*var closeBtn = document.createElement("div");
    closeBtn.setAttribute("id","ynhclose");
    closeBtn.innerHTML = "X";
    overlay.insertBefore(closeBtn, null);*/

    // Add overlay header
    overlay.innerHTML += '<div class="wrapper">' +
                          '<ul class="ul-reset user-menu"><li><a class="icon icon-connexion" href="'+ response.portal_url +'?action=logout">Logout</a></li></ul>'+
                          '<div id="yuno-user" class="user-container col colNomarge">'+
                            '<a class="user-img" href="'+ response.portal_url +'edit.html"><img src="'+ response.portal_url +'assets/img/avatar.png"></a>' +
                            '<div class="user-info">' +
                                '<h2><a href="'+ response.portal_url +'edit.html">'+ response.user.uid +'<small>'+ response.user.name  +'</small></</a></h2>'+
                                '<span class="user-mail">'+ response.user.mail +'</span>'+
                            '</div>' +
                          '</div>' +
                        '</div>';

    // Add application links
    var links = [];
    Array.prototype.forEach.call(response.app, function(app, n){
      links.push('<li><a class="'+colors[n]+'" href="//'+app.url+'"><span class="first-letter" data-first-letter="'+ app.name.substr(0,2) +'"></span><span class="sourcePro">'+app.name+'</span></a></li>');
    });
    overlay.innerHTML += '<div id="yuno-apps" class="wrapper apps"><ul class="ul-reset listing-apps col colNomarge sourceProBold">'+ links.join('') +'</ul></div>';

    // Add overlay to DOM
    
    var ynhssoPath = window.location.pathname;

    if(ynhssoPath == '/ynhsso/') {
      //Element.toggleClass(overlay, 'visible');
      Element.toggleClass(portal, 'visible');
    }

    var btn = document.getElementById('logo'),
        yunoverlay = document.getElementById('ynhoverlay'),
        user = document.getElementById('yuno-user'),
        apps = document.getElementById('yuno-apps');
      
      /*var btnApps = document.querySelectorAll('.btnClick');
      var closeBtn = document.querySelectorAll('.close');
      Array.prototype.forEach.call(btnApps, function(el) {
        el.addEventListener('click', function(e){
          e.preventDefault();
          var link = this.getAttribute('data-id');
          
          //overlay.classList.add(link);
        })
      })*/
    
    var pfx = ["webkit", "moz", "MS", "o", ""];
    function PrefixedEvent(element, type, callback) {
      for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        element.addEventListener(pfx[p]+type, callback, false);
      }
    }

    // Bind YNH Button
    window.addEvent(portal, 'click', function(e){
      // Prevent default click
      window.eventPreventDefault(e);
      // Toggle overlay on YNHPortal button
      //Element.toggleClass(overlay, 'visible');
      Element.toggleClass(portal, 'visible');

      if(yunoverlay.classList.contains('yuno-active')) {
          yunoverlay.classList.add('yuno-fadeOut');
          PrefixedEvent(yunoverlay, "AnimationEnd", function(){
            if(yunoverlay.classList.contains('yuno-fadeOut')) {
              yunoverlay.classList.remove('yuno-active');
            }
          });
          apps.classList.remove('yuno-fadeIn', 'yuno-delay');
          apps.classList.remove('yuno-fadeInLeft', 'yuno-delay');
          user.classList.remove('yuno-slideintop');
        }else {
          yunoverlay.classList.remove('yuno-fadeOut');
          yunoverlay.classList.add('yuno-active');
          
          apps.classList.add('yuno-fadeInLeft', 'yuno-delay');
          user.classList.add('yuno-slideintop');
        }
    });

    // Bind close button
    /*window.addEvent(document.getElementById('ynhclose'), 'click', function(e){
      // Prevent default click
      window.eventPreventDefault(e);
      // Hide overlay
      Element.removeClass(overlay, 'visible');
      Element.removeClass(portal, 'visible');
    });*/

  };
  r.send();

});
