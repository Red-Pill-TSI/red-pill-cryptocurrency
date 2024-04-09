function ChangeCol(){
    var Btn = document.getElementById("ClickIt");
    if (Btn.style.color == "red"){
        Btn.style.color = "black";
    } else {
        Btn.style.color = "red";
    }
}
var ctr = 0;
function NavControl(){
    var Panel = document.getElementById("Panel");
    if (Panel.style.display == "none"){
        window.setTimeout( 
            function(){
                Panel.style.display = "block";
                fadein();
            }, 0
        );
    } else {
        window.setTimeout(
            function(){
                fadeout();
                Panel.style.display = "none";
            }, 0
        );
    }
}

function fadein(){
    Panel.style.opacity = ctr;
    Panel.style.transform = 'scale(' + ctr + ')';
    ctr = ctr + 0.02;
    
    if (ctr < 1)
      requestAnimationFrame(fadein);
}

function fadeout(){
    Panel.style.opacity = 1 - ctr;
    Panel.style.transform = 'scale('+ (1 - ctr) +')';
    ctr + 0.02;
    
    if (ctr <= 1)
      requestAnimationFrame(fadeout);
    else
      ctr = 0;
}