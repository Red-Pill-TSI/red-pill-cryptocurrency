function ChangeCol(){
    var Btn = document.getElementById("ClickIt");
    if (Btn.style.color == "red"){
        Btn.style.color = "black";
    } else {
        Btn.style.color = "red";
    }
}

function NavControl(){
    var Panel = document.getElementById("Panel");
    if (Panel.style.display == "none"){
        Panel.style.display = "block";
    } else {
        Panel.style.display = "none";
    }
}