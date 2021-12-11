function toggleDrop() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
// TOggle/untoggle della barra di ricerca + Highligh del parcheggio
window.onclick = function(event) {

    //dropdown navbar
    if (event.target.matches('.mapboxgl-canvas')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

    //highligh parcheggio
    if (event.target.matches('.mapboxgl-canvas') || event.target.matches('.dropbtn')) {
        var highLight = document.getElementById('parcheggioHighLight');

        if(highLight.className == 'show'){
            highLight.setAttribute('class','');
        }
        else{
            highLight.setAttribute('class','hide');
        }
    }
}


//Update in live del valore sugli input "Range"
function updateTariffa (){
    var tariffa =  document.getElementById('tariffa_value');
    var new_tariffa = document.getElementById('tariffa_range').value;

    tariffa.innerHTML = new_tariffa;
}

function updateRaggio (){
    var raggio =  document.getElementById('raggio_value');
    var new_raggio = document.getElementById('raggio_range').value;

    raggio.innerHTML = new_raggio;
}

function updateTempoSosta (){
    var tempo_sosta_value =  document.getElementById('tempo_sosta_value');
    var tempo_sosta = document.getElementById('tempo_sosta').value;

    tempo_sosta_value.innerHTML = tempo_sosta;
}

function modifyStar(){
    var star = document.getElementById("star");
    var src = star.getAttribute('src');
    if(src == 'IMG/star.svg'){
        star.setAttribute('src', 'IMG/star-no.svg')
    }
    else{
        star.setAttribute('src', 'IMG/star.svg')
    }
}

function modifyStar_filter(){
    var star = document.getElementById("star_filter");
    var src = star.getAttribute('src');
    if(src == 'IMG/star.svg'){
        star.setAttribute('src', 'IMG/star-no.svg')
    }
    else{
        star.setAttribute('src', 'IMG/star.svg')
    }
}
