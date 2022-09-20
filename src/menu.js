var menu = document.getElementById("menu")
var depth = document.currentScript.getAttribute("depth")
var path = "menu.html"
while(depth-- > 0)
{
  path = "../" + path;
}

// menu.innerHTML = "<object data='" + path + "'>"

// TODO: Ability to import alternate menu is you're not on portfolio site

async function importMenu(path) {
  var res = await fetch(path)
  menu.innerHTML = await res.text()
  var burgerMenu = document.getElementById('burger-menu');
  var overlay = document.getElementById('menu-links');
  burgerMenu.addEventListener('click',function(){
    this.classList.toggle("close");
    overlay.classList.toggle("overlay");
  });
}
importMenu(path)