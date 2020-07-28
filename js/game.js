// Un joc creat de Vlad Timotei ver.2.5@28.07.2020
var game = "3carti_03062020F";
var level = {}; // solution, solution_lenght, try_lenght, completed, definition, buttons_nr, timeforaudiohint, timeoforhint
var player = {}; // name, level, mode, startofgame, endofgame, timpepergame, scorpergame, totalscore, usedclue, tries, clue_coef, sound, olduser

var btns = []; //starts with 1
var btns_txt = []; //starts with 0
var clues = [];
var preloaded_imgs = new Array();

var music = {}
music.correct = document.getElementById("s_correct");
music.incorrect = document.getElementById("s_incorrect");
music.pull_letter = document.getElementById("s_pull_letter");
music.push_letter = document.getElementById("s_push_letter");
music.ninja = document.getElementById("s_ninja");
music.switch_btn = document.getElementById("s_switch");
music.hint = document.getElementById("s_hint");

var key_game, key_NT, key_VT, key_game_arr, key_NT_arr, key_VT_arr;
key_NT="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24";
key_VT="25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60";


var levels=["MARCU|matei|luca|NT","MATEI|maleahi|marcu|NT","LUCA|marcu|ioan|NT","IOAN|luca|fapte|NT","FAPTE|ioan|romani|NT","ROMANI|fapte|1corinteni|NT","1CORINTENI|romani|2corinteni|NT","2CORINTENI|1corinteni|galateni|NT","GALATENI|2corinteni|efeseni|NT","EFESENI|galateni|filipeni|NT","FILIPENI|efeseni|coloseni|NT","COLOSENI|filipeni|1tesaloniceni|NT","TESALONICENI|coloseni|1timotei|NT","1TIMOTEI|2tesaloniceni|2timotei|NT","2TIMOTEI|1timotei|tit|NT","TIT|2timotei|filimon|NT","FILIMON|tit|evrei|NT","EVREI|filimon|iacov|NT","IACOV|evrei|1petru|NT","1PETRU|iacov|2petru|NT","2PETRU|1petru|1ioan|NT","1IOAN|2petru|2ioan|NT","2IOAN|1ioan|3ioan|NT","3IOAN|2ioan|iuda|NT","IUDA|3ioan|apocalipsa|NT","EXOD|geneza|levitic|VT","LEVITIC|exod|numeri|VT","NUMERI|levitic|deuteronom|VT","DEUTERONOM|numeri|iosua|VT","IOSUA|deuteronom|judecatori|VT","JUDECĂTORI|iosua|rut|VT","RUT|judecatori|1samuel|VT","1SAMUEL|rut|2samuel|VT","2SAMUEL|1samuel|1regi|VT","1REGI|2samuel|2regi|VT","2REGI|1regi|1cronici|VT","1CRONICI|2regi|2cronici|VT","2CRONICI|1cronici|ezra|VT","EZRA|2cronici|neemia|VT","NEEMIA|ezra|estera|VT","ESTERA|neemia|iov|VT","IOV|estera|psalmi|VT","PSALMI|iov|proverbe|VT","PROVERBE|psalmi|eclesiastul|VT","ECLESIASTUL|proverbe|cantarea-cantarilor|VT","ISAIA|cantarea-cantarilor|ieremia|VT","IEREMIA|isaia|plangerile-lui-ieremia|VT","EZECHIEL|plangerile-lui-ieremia|daniel|VT","DANIEL|ezechel|osea|VT","OSEA|daniel|ioel|VT","IOEL|osea|amos|VT","AMOS|ioel|obadia|VT","OBADIA|amos|iona|VT","IONA|obadia|mica|VT","MICA|iona|naum|VT","NAUM|mica|habacuc|VT","HABACUC|naum|tefania|VT","ȚEFANIA|habacuc|hagai|VT","HAGAI|tefania|zaharia|VT","ZAHARIA|hagai|maleahi|VT","MALEAHI|zaharia|matei|VT"];

var stats = {};
var ranking;

function start(fromhome) {
    if (fromhome == 1) {
        if (get_player_name()) {
            eplay(music.ninja);
            $("#startgame").hide(1000);
            $("#game").show(500);
            playthegame();
        }
    }
    if (fromhome == 0) {
        if (player.level >= levels.length) {
            clearTimeout(level.timeforaudiohint);
            show_final_score();
            $("#game").hide(500);
            $("#endgame").show(500);
        } else {
            $("#game").hide(600);
            setTimeout(playthegame, 400);
            $("#game").show(500);
        }
    }
}

function playthegame() {
    gametime(1);
    init();
    fill_try();
    fill_level(1);
    fill_img();
    fill_btns(player.mode);
    fill_definition(0);
}

function init() {
    init_btns();
    var date = levels[key_game_arr[player.level]].split('|', 4);
	level.solution=date[0];
	clues[0]=date[1];
	clues[1]=date[2];
	level.definition=date[3];
    if(level.definition=="NT") level.definition="Noul Testament";
	else level.definition="Vechiul Testament"; 
    level.completed = 0;
    level.solution_lenght = level.solution.length;
    level.try_lenght = 0;
    player.tries = 0;
    player.clue_coef = 1;
    player.usedclue = 0;
}

function init_btns() {
    var b;
    for (var i = 1; i <= level.buttons_nr; i++) {
        btns[i] = 0;
        b = "#" + i;
        $(b).attr('style', "");
    }
}

function fill_level(whatmode, txt, t) {
    if (whatmode == 1) {
        var niveltxt = parseInt(player.level) + 1;
        $("#level").html("Nivel <b>" + niveltxt + "</b>").fadeIn(500);
    } else $('#level').html(txt).fadeIn(t);
}

function hide_nivel(t) {
    $('#level').fadeOut(t);
}

function fill_try() {
    var usertry = "";
    for (var i = 1; i <= level.solution_lenght; i++) usertry = usertry + "_ ";
    $("#usertry").html(usertry);
}

 function fill_img(){var i;
    if(player.mode=="easy") fill_img_ok();
    else if(Math.random() >= 0.5) fill_img_ok(); else fill_img_nok();               
            
  }
  
function fill_img_ok(){document.getElementById("clue1").src="images/"+clues[0]+".jpg"; document.getElementById("clue2").src="images/"+clues[1]+".jpg";}

function fill_img_nok(){ document.getElementById("clue1").src="images/"+clues[1]+".jpg"; document.getElementById("clue2").src="images/"+clues[0]+".jpg";}
  

function hide_definition(t) {
    $('#definition').fadeOut(t);
}

function fill_definition(t) {
    $('#definition').html("Sunt o carte din " + level.definition + " <br/>și am lângă mine pe").fadeIn(t);
}

function fill_btns(whatmode) {
    var i;
    var encrypted_solution = level.solution + add_letters(level.buttons_nr - level.solution_lenght);
    btns_txt = encrypted_solution.split('');
    if (whatmode == "easy")
        btns_txt.sort(function(a, b) {
            return a.localeCompare(b);
        });
    else
        btns_txt = shuffle(btns_txt);
    for (i = 1; i <= level.buttons_nr; i++)
        document.getElementById(i).innerHTML = btns_txt[i - 1];
}

function add_letters(n) {
    var text = "";
    var possible = "AĂÂBCDEFGHIÎLMNOPRSȘTȚUVXZ";
    for (var i = 0; i < n; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function touch(l) {
    if (level.completed == 0) {
        if (btns[l] == 1) getOutLetter(l);
        else if (level.try_lenght < level.solution_lenght) putInLetter(l);
    }
}

function putInLetter(letter) {
    if (level.try_lenght == 0) $(".reset").addClass("resetactiv");
    eplay(music.push_letter);
    level.try_lenght++;
    btns[letter] = 1;
    document.getElementById("usertry").innerHTML = document.getElementById("usertry").innerHTML.replace('_', btns_txt[letter - 1]);
    letter = "#" + letter;
    $(letter).attr('style', "background-color: #CCC !important;");
    if (level.try_lenght == level.solution_lenght) check_player_try();
}

function getOutLetter(letter) {
    if (level.try_lenght == 1) $(".reset").removeClass("resetactiv");
    eplay(music.pull_letter);
    level.try_lenght--;
    btns[letter] = 0;
    var usertry = document.getElementById('usertry').innerHTML;
    var pos = usertry.lastIndexOf(btns_txt[letter - 1]);
    $('#usertry').html(usertry.substring(0, pos) + '_' + usertry.substring(pos + 1));
    letter = "#" + letter;
    $(letter).attr('style', "");
}

function check_player_try() {
    var sol = document.getElementById('usertry').innerHTML.replace(/\s/g, '');
    if (sol == level.solution) {
        level.completed = 1;
        eplay(music.correct);
        level.try_lenght = 0;
        $(".reset").removeClass("resetactiv");
        hide_definition(100);
        gametime(2);
        scor();
        setTimeout(display_message, 75, 250, 1);
        setTimeout(next, 1500);
    } else {
        player.tries++;
        if (player.tries == 1 && player.mode == "easy") {
            level.timeforhint = setTimeout(get_clue, 5000);
            level.timeforaudiohint = setTimeout(eplay, 4900, music.hint);
        } else if (player.tries == 2 && player.mode == "hard") {
            level.timeforhint = setTimeout(get_clue, 5000);
            level.timeforaudiohint = setTimeout(eplay, 4900, music.hint);
        }
        eplay(music.incorrect);
        hide_definition(250);
        setTimeout(display_message, 225, 500, 0);
        setTimeout(hide_definition, 2250, 500);
        setTimeout(fill_definition, 2725, 500);
    }
}

function display_message(t, type) {
    if (type == 1)
        $('#definition').html("<b class='succes'>Felicitări, " + player.name + "!</b><br/> Scorul tău: <b>" + player.totalscore + "</b>").fadeIn(t);
    else
        $("#definition").html("<b class='error'>Mai încearcă!<br/>&nbsp;</b>").fadeIn(t);
}

function reset_game() {
    if (level.try_lenght != 0) {
        level.try_lenght = 0;
        fill_try();
        init_btns();
        setTimeout(eplay, 10, music.pull_letter);
        $(".reset").removeClass("resetactiv");
    }
}

function newGame() {
    clearTimeout(level.timeforaudiohint);
    clearTimeout(level.timeforhint);
    setval(game + "_nume", 0);
    setval(game, 0);
    setval(game + "_score", 0);
    player.totalscore = 0;
    player.level = 0;
    check_level();
    check_player();
    $("#endgame").hide(500);
    $("#startgame").show(500);
}

function next() {
    stats = {
        "nivel": parseInt(parseInt(key_game_arr[player.level]) + 1),
        "time": parseInt(player.timepergame / 1000),
        "indiciu": player.usedclue,
        "mod": player.mode,
        "cuv": level.solution,
        "nume": player.name,
        "scor": player.totalscore
    };
    send_stats();
    clearTimeout(level.timeforaudiohint);
    clearTimeout(level.timeforhint);
    player.level++;
	setTimeout(preload_next_images, 1000);
    setval(game, player.level);
    setval(game + "_score", player.totalscore);
    start(0);
}

function info(x) {
	if (level.completed == 0) {
    setTimeout(eplay, 10, music.ninja);
    if (x) {
        $("#info").hide(500);
        $("#game").show(500);
    } else {
        clearTimeout(level.timeforaudiohint);
        $("#game").hide(500);
        $("#info").show(500);
    }
	}
}

function ranking_page(x) {
    setTimeout(eplay, 10, music.ninja);
    if (x) {
        get_ranking("short");
        $("#rankingpage").hide(500);
        $("#startgame").show(500);
    } else {
        get_ranking("full");
        clearTimeout(level.timeforaudiohint);
        $("#game").hide(500);
        $("#startgame").hide(500);
        $("#endgame").hide(500);
        $("#rankingpage").show(500);
    }
}

function home() {
    if (level.completed == 0) {
        get_ranking("short");
        clearTimeout(level.timeforaudiohint);
        setTimeout(eplay, 10, music.ninja);
        check_level();
        $("#game").hide(500);
        $("#startgame").show(500);
    }
}

function switch_sound() {
    if (player.sound == 0) {
        player.sound = 1;
        $("#switch_sound").html("volume_up");
    } else {
        player.sound = 0;
        $("#switch_sound").html("volume_off");
    }
}

function get_clue() {
    hide_nivel(250);
    setTimeout(fill_level, 245, 2, "<b class='mesajindiciu' onClick='show_clue();'>Indiciu!</b>", 500);
}

function show_clue() {
    player.clue_coef = 1 - (1 / level.solution_lenght);
    player.usedclue = 1;
    eplay(music.push_letter);
    var y = level.solution.split("");
    var usertry = y[0] + " ";
    level.try_lenght = 1;
    init_btns();
    for (var i = 2; i <= level.solution_lenght; i++)
        usertry = usertry + "_ ";
    $("#usertry").html(usertry);
    $('#level').fadeOut(250);
    $(".reset").addClass("resetactiv");
    setTimeout(fill_level, 240, 1);
}

function gametime(moment) {
    if (moment == 1) player.startofgame = new Date().getTime();
    else player.endofgame = new Date().getTime();
}

function scor() {
    var difficulty_coeficient = {
        easy: 1,
        hard: 1.75
    };
    player.timepergame = player.endofgame - player.startofgame;
    if (player.timepergame > 300000) player.timepergame = 300000;
    var evaluare = (300000 - player.timepergame + (level.solution_lenght * 10000)) / 1000;
    player.scorepergame = parseInt(evaluare * difficulty_coeficient[player.mode] * player.clue_coef);
    player.totalscore = parseInt(player.totalscore) + player.scorepergame;
}

function show_final_score() {
    $("#scor_total").html(player.totalscore);
    get_ranking("final");
    $("#finalcongrats").html("Felicitări, " + player.name + "!");
}

function send_stats() {
    var req = "https://vladtimotei.ro/scripts/3books/3books_stats.php";
    $.get(req, stats);
}

var modal = document.getElementById("modal_area");
var modalGame = document.getElementById("game");

function open_modal(image) {
    var modalImg = document.getElementById("maximg");
    modalGame.style.opacity = "0.5";
    modal.style.display = "block";
    modalImg.src = image;
}

function close_modal() {
    modal.style.display = "none";
    modalGame.style.opacity = "1";
}

function get_player_name() {
    var availablename;
    if (player.name == 0) {
        var playernameinput = document.getElementById("nume-participant").value;
        if (playernameinput == "") {
            $("#alertme").html("Introdu numele mai întâi!<br/>");
            return 0;
        }
		if(!document.getElementById("termsandconditions").checked){
			$("#alertme").html("Acceptă Politica de confidențialitate!</i><br/>");
			return 0;
		}
        else setval(game+"_acceptedterms","yes");
        if (player.olduser)
            var param = {
                "name": playernameinput,
                "olduser": true,
                "nivel": player.level,
                "punctaj": player.totalscore
            };
        else
            var param = {
                "name": playernameinput
            };
        var req = "https://vladtimotei.ro/scripts/3books/3books_check_name.php";
        $.ajax({
            type: "GET",
            url: req,
            async: false,
            data: param,
            success: function(data) {
                availablename = data;
            }
        });
        if (availablename == 1) {
            setval(game + "_nume", playernameinput);
            player.name = playernameinput;
            player.olduser = 0;
        } else {
            $("#alertme").html("Alege alt nume! " + playernameinput + " există deja ! <br/>");
            return 0;
        }
    }
    $("#noname").hide();
    return 1;
}

/* On load Functions */

function eplay(effect) {
    if (player.sound) effect.play();
}

function check_mode() {
    player.mode = getval(game + "_mode");
    if (player.mode == 0) player.mode = "easy";
    if (player.mode == "hard") $("#mode").prop('checked', true);
    else $("#mode").prop('checked', false);
    set_mode();
}

function change_mode() {
    if ($("#mode").is(":checked")) player.mode = "hard";
    else player.mode = "easy";
    eplay(music.switch_btn);
    set_mode();
}

function set_mode() {
    if ($("#mode").is(":checked")) {
        player.mode = "hard";
        level.buttons_nr = 16;
        $("#he1").addClass("offset-m2");
        $("#he1").removeClass("offset-m3");
        $("#e2").removeClass("offset-m3");
        $("#h2").addClass("offset-m2");
        $(".hard-letter").removeClass("invisible");
        $("#hard").addClass("modactiv");
        $("#easy").removeClass("modactiv");
    } else {
        player.mode = "easy";
        level.buttons_nr = 12;
        $("#he1").removeClass("offset-m2");
        $("#he1").addClass("offset-m3");
        $("#e2").addClass("offset-m3");
        $("#h2").removeClass("offset-m2");
        $(".hard-letter").addClass("invisible");
        $("#easy").addClass("modactiv");
        $("#hard").removeClass("modactiv");
    }
    setval(game + "_mode", player.mode);

}

function check_level() {
    var startlevel = parseInt(player.level) + 1;
    if (player.level >= levels.length) {
        show_final_score();
        clearTimeout(level.timeforaudiohint);
        $("#startgame").hide();
        $("#endgame").show(1000);
    } else if (startlevel == 1) $("#startlevel").html("START");
    else $("#startlevel").html("Începe nivelul " + startlevel);
}

function put_ranking(whattype) {
    var rank = {};
    var output = "";
    ranking = ranking.split("||", 3);
    rank = JSON.parse(ranking[2]);
    for (x in rank)
        output += '<div class="row s12"><div class="col s8 offset-s1 clasn">' + rank[x]['id'] + '. ' + rank[x]['nume'] + '</div><div class="col s2 clasp">' + rank[x]['punctaj'] + '</div></div>';
    if (whattype == "short") {
        output += '<span onclick="javascript:ranking_page();" class="link-clasament" ><i>și alți <b>' + ranking[0] + '</b> jucători | Vezi clasament </i></span>';
        $("#clasament").html(output);
    }
    if (whattype == "full") {
        output += "<div class='cent center'>și alți <b>" + ranking[0] + "</b> jucători</div>";
        $("#clasament-complet").html(output);
    }
    if (whattype == "final") {
        output += "<div class='cent center'>și alți <b>" + ranking[0] + "</b> jucători</div>";
        $("#clasament-final").html(output);
    }
	if(ranking[1]<4) {$("#firstofthem").removeClass("invisible"); $("#lastofthem").addClass("invisible"); }
	else {$("#firstofthem").addClass("invisible"); $("#lastofthem").removeClass("invisible"); }
}

function get_ranking(whattype) {
    var param = {
        "type": whattype,
        "name": player.name
    };
    var req = "https://vladtimotei.ro/scripts/3books/3books_ranking.php";
    $.get(req, param, function(data) {
        ranking = data;
        put_ranking(whattype);
    });

}

function check_player() {
    player.name = getval(game + "_nume");
    player.level = getval(game);
    player.totalscore = getval(game + "_score");
    check_mode();
    check_level();
    get_ranking("short");
    player.sound = 1;
    player.olduser = 0;
    key_game=getval(game+"_key");
    if(key_game==0) generate_key();
    else key_game_arr=key_game.split(",");
    preload_current_images();
	preload_next_images();
    if (player.name != 0) {
        $("#noname").hide();
        $("#salut").html(", " + player.name);
    } else {
        if (player.level != 0)
            player.olduser = 1;
        $("#noname").show();
        $("#salut").html("");
    }
}

function preload_current_images(){
	var currentlevel = levels[key_game_arr[player.level]].split('|', 4);
	var imgs=currentlevel[1]+","+currentlevel[2];
	var imgs_url = imgs.split(',', 2);
	preload_imgs(imgs_url);
}

function preload_next_images(){
	if(player.level < (levels.length - 1)) {
		var nextlevel = levels[key_game_arr[parseInt(player.level)+1]].split('|', 4);
		var imgs=nextlevel[1]+","+nextlevel[2];
		var imgs_url = imgs.split(',', 2);
		preload_imgs(imgs_url);
	}
}

function preload_imgs(imgs){
	for (var i = 0; i < imgs.length; i++) {
		preloaded_imgs[i] = new Image();
		preloaded_imgs[i].src = "images/"+imgs[i]+".jpg";
	}
}




function setval(cname, cvalue) {
    setLS(cname, cvalue);
}

function getval(cname) {
    return getLS(cname);
}

function setLC(cname, cvalue, del = 1) {
    var d = new Date();
    d.setTime(d.getTime() + (parseFloat(del) * (90 * 24 * 60 * 60 * 1000)));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
}

function getLC(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 0;
}

function getLS(cname) {
    var loc = localStorage.getItem(cname);
    if (loc) return loc;
    else return 0;
}

function setLS(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

 function generate_key(){
     key_NT_arr=shuffle(key_NT.split(","));
     key_NT=key_NT_arr.join();
     
     key_VT_arr=shuffle(key_VT.split(","));
     key_VT=key_VT_arr.join();
     
     key_game="0,"+key_NT+","+key_VT;
     key_game_arr=key_game.split(",");
     
     setval(game+"_key",key_game);
    
   }

$(document).ready(function() {    
    check_player();
    $("#mode").change(change_mode);
});