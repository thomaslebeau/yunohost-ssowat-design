document.addEventListener('DOMContentLoaded', function() {
  var liMenu = document.querySelectorAll('#apps li'),
      colors = ['bluebg','purplebg','redbg','orangebg','greenbg','darkbluebg','lightbluebg','yellowbg','lightpinkbg'];
  [].forEach.call(liMenu, function(el, i) {
    el.classList.add(colors[i]);
  });
});