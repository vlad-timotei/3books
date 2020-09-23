/* Game created by Vlad Timotei $ver.6.0 @23.09.2020 #ro_en100 */
var game = "3books";
var oldgame = "3carti_03062020F";
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

var modal = document.getElementById("modal_area");
var modalGame = document.getElementById("game");

var stats = {};
var ranking;
/*onHomeLoad functions*/
function check_old_data() {
    if(getval(game) == 0 && getval(oldgame)!=0) {
		
			setval(game,getval(oldgame)); delval(oldgame);
			setval(game+"_mode",getval(oldgame+"_mode")); delval(oldgame+"_mode");
			setval(game+"_acceptedterms",getval(oldgame+"_acceptedterms")); delval(oldgame+"_acceptedterms");
			setval(game+"_name",getval(oldgame+"_nume")); delval(oldgame+"_nume");
			setval(game+"_score",getval(oldgame+"_score")); delval(oldgame+"_score");
	}
}

function getval(cname) {
    var loc = localStorage.getItem(cname);
    if(loc) return loc;
    else return 0;
}

function setval(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function delval(cname){
	localStorage.removeItem(cname);
}

function load_game() {
    player.language = getval(game + "_language");
    if(player.language == 0) {
        player.language = "ro";
        setval(game + "_language", "ro");
    }
    load_language(player.language);
}

function load_language(lang) {
    var langRo = $('.lang-ro');
    var langEn = $('.lang-en');
    if(lang == "ro") {
        player.language = 0;
        langEn.hide();
        langRo.show();
    }
    if(lang == "en") {
        player.language = 1;
        langEn.show();
        langRo.hide();
    }
    check_player();
}

function check_player(first_check = 1) {
    player.name = getval(game + "_name");
    player.level = getval(game);
    player.sound = getval(game + "_sound");
    player.totalscore = getval(game + "_score");
    player.ID = getval(game + "_ID");
    if(player.sound == 0) player.sound = "on";
    set_sound();
    check_mode();
    check_level();
    if(first_check) get_ranking("short");
    player.olduser = 0;
    preload_current_images();
    preload_next_images();
    if(player.name != 0) {
        $("#noname").hide();
        $("#salut").html(", " + player.name);
    } else {
        if(player.level != 0) player.olduser = 1;
        $("#noname").show();
        $("#salut").html("");
    }
}

function set_sound() {
    if(player.sound == "on") $("#switch_sound").html("volume_up");
    else $("#switch_sound").html("volume_off");
}

function check_mode() {
    player.mode = getval(game + "_mode");
    if(player.mode == 0) player.mode = "easy";
    if(player.mode == "hard") {
        $("#mode").prop('checked', true);
        mode_hard_design();
    } else {
        $("#mode").prop('checked', false);
        mode_easy_design();
    }
    setval(game + "_mode", player.mode);
}

function mode_hard_design() {
    $(".hard").addClass("modactiv");
    $(".easy").removeClass("modactiv");
}

function mode_easy_design() {
    $(".easy").addClass("modactiv");
    $(".hard").removeClass("modactiv");
}

function check_level() {
    var startlevel = parseInt(player.level) + 1;
    if(player.level >= levels[player.language].length) {
        show_final_score();
        clearTimeout(level.timeforaudiohint);
        $("#startgame").hide();
        $("#endgame").show(1000);
        return 0;
    } else if(startlevel == 1) $("#startlevel").html("START");
    else $("#startlevel").html(textdb[player.language]['startlevel'] + " " + startlevel);
    $("#startgame").show();
}

function show_final_score() {
    $("#scor_total").html(player.totalscore);
    get_ranking("final");
    $("#finalcongrats-name").html(player.name + "!");
}

function get_ranking(whattype) {
    var param = {
        "type": whattype,
        "name": player.name
    };
    var req = "https://vladtimotei.ro/scripts/3books/4img_ranking.php";
    $.get(req, param, function(data) {
        ranking = data;
        put_ranking(whattype);
    });
}

function put_ranking(whattype) {
    var rank = {};
    var output = "";
    var x;
    ranking = ranking.split("||", 3);
    rank = JSON.parse(ranking[2]);
    for(x in rank) output += '<div class="row s12"><div class="col s8 offset-s1 clasn">' + rank[x]['id'] + '. ' + rank[x]['nume'] +
        '</div><div class="col s2 clasp">' + rank[x]['punctaj'] + '</div></div>';
    if(whattype == "short") {
        output += '<span onclick="javascript:ranking_page();" class="link-clasament" ><i>' + textdb[player.language]['and'] + ' <b>' + ranking[0] + '</b> ' +
            textdb[player.language]['otherplayers'] + ' | ' + textdb[player.language]['fullranking'] + '  </i></span>';
        $("#clasament").html(output);
    }
    if(whattype == "full") {
        output += "<div class='cent center'>" + textdb[player.language]['and'] + " <b>" + ranking[0] + "</b> " + textdb[player.language]['otherplayers'] +
            "</div>";
        $("#clasament-complet").html(output);
    }
    if(whattype == "final") {
        output += "<div class='cent center'>" + textdb[player.language]['and'] + " <b>" + ranking[0] + "</b> " + textdb[player.language]['otherplayers'] +
            "</div>";
        $("#clasament-final").html(output);
    }
    if(ranking[1] < 10) {
        $("#firstofthem").removeClass("invisible");
        $("#lastofthem").addClass("invisible");
    } else {
        $("#firstofthem").addClass("invisible");
        $("#lastofthem").removeClass("invisible");
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

function load_game_events() {
    $("#mode").change(change_mode);
}
/*onHomeClick functions*/
function change_mode() {
    if($("#mode").is(":checked")) {
        player.mode = "hard";
        mode_hard_design();
    } else {
        player.mode = "easy";
        mode_easy_design();
    }
    eplay(music.switch_btn);
    setval(game + "_mode", player.mode);
}

function eplay(effect) {
    if(player.sound == "on") {
        effect.currentTime = 0;
        effect.play();
    }
}

function ranking_page(x) {
    setTimeout(eplay, 10, music.ninja);
    if(x) {
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

function change_language(lang) {
    player.language = lang;
    setval(game + "_language", lang);
    $("#startgame").hide(500);
    eplay(music.ninja);
    $("#startgame").show(500);
    setTimeout(load_language, 500, lang);
}

function home() {
    if(level.completed == 0) {
        get_ranking("short");
        clearTimeout(level.timeforaudiohint);
        setTimeout(eplay, 10, music.ninja);
        check_level();
        $("#game").hide(250);
        $("#startgame").show(500);
    }
}

function info(x) {
    if(level.completed == 0) {
        setTimeout(eplay, 10, music.ninja);
        if(x) {
            $("#info").hide(500);
            $("#game").show(500);
        } else {
            clearTimeout(level.timeforaudiohint);
            $("#game").hide(500);
            $("#info").show(500);
        }
    }
}

function switch_sound() {
    if(player.sound == "off") player.sound = "on";
    else player.sound = "off";
    setval(game + "_sound", player.sound);
    set_sound();
}
/*onLevelLoad functions*/
function start(fromhome) {
    if(fromhome == 1) {
        if(get_player_name()) {
            eplay(music.ninja);
            $("#startgame").hide(1000);
            $("#game").show(500);
            playthegame();
        }
    }
    if(fromhome == 0) {
        if(player.level >= levels[player.language].length) {
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

function get_player_name() {
    if(player.name == 0) {
        var availablename;
        var playernameinput = document.getElementById("nume-participant").value.replace(/\s+/g, '');
        if(playernameinput.length > 10) {
            $("#alertme").html(textdb[player.language]['namelengthalert'] + "!<br/>");
            return 0;
        }
        playernameinput = sanitizename(playernameinput);
        if(playernameinput == "") {
            $("#alertme").html(textdb[player.language]['namealert'] + "!<br/>");
            return 0;
        }
        if(!document.getElementById("termsandconditions").checked) {
            $("#alertme").html(textdb[player.language]['policyalert'] + "!</i><br/>");
            return 0;
        } else setval(game + "_acceptedterms", "yes");
        if(player.olduser) var param = {
            "name": playernameinput,
            "olduser": true,
            "nivel": player.level,
            "punctaj": player.totalscore
        };
        else var param = {
            "name": playernameinput
        };
        player.ID = get_player_id(param, false);
        if(player.ID.indexOf("#") != 0) {
            setval(game + "_name", playernameinput);
            player.name = playernameinput;
            player.olduser = 0;
            $("#salut").html(", " + player.name);
            setval(game + "_ID", player.ID);
        } else {
            $("#alertme").html(textdb[player.language]['pickothername'] + "! " + playernameinput + "  " + textdb[player.language]['exists'] + " ! <br/>");
            return 0;
        }
    }
    if(player.ID == 0) {
        var param = {
            "name": player.name,
            "olduser": true,
            "nivel": player.level,
            "punctaj": player.totalscore
        };
        get_player_id(param, true);
    }
    $("#noname").hide();
    return 1;
}

function sanitizename(s) {
    var diacritics = ["ă", "â", "ș", "ț", "î", "Ă", "Â", "Ș", "Ț", "Î", "#", "$", "'", '"', "update", "UPDATE", "DELETE", "delete"];
    var chars = ["a", "a", "s", "t", "i", "A", "A", "S", "T", "I", "", "", "", "", "", "", "", ""];
    for(var i = 0; i < diacritics.length; i++) {
        s = s.split(diacritics[i]).join(chars[i]);
    }
    return s;
}

function get_player_id(param, nonsync) {
    var playerID;
    var req = "https://vladtimotei.ro/scripts/3books/3books_get_name.php";
    $.ajax({
        type: "GET",
        url: req,
        async: nonsync,
        data: param,
        success: function(data) {
            if(nonsync) {
                player.ID = data.replace("#", "");
                setval(game + "_ID", player.ID);
            } else playerID = data;
        }
    });
    if(!nonsync) return playerID;
}

function playthegame() {
    gametime(1);
    init();
    fill_try();
    fill_level(1);
    fill_img();
    fill_definition(0);
}

function gametime(moment) {
    if(moment == 1) player.startofgame = new Date().getTime();
    else player.endofgame = new Date().getTime();
}

function init() {
    var date = levels[player.language][key_game_arr[player.level]].split('|', 4);
  
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
    do_btns(decide_mode());
}

function decide_mode() {
    if(level.solution_lenght > 12) {
        return "hard";
    } else {
        return player.mode;
    }
}

function do_btns(mode) {
	set_btns_mode(mode);
    init_btns(mode);
    fill_btns(mode);
}

function set_btns_mode(mode) {
    if(mode == "hard") {
        $("#he1").addClass("offset-m2");
        $("#he1").removeClass("offset-m3");
        $("#e2").removeClass("offset-m3");
        $("#h2").addClass("offset-m2");
        $(".hard-letter").removeClass("invisible");
    } else {
        $("#he1").removeClass("offset-m2");
        $("#he1").addClass("offset-m3");
        $("#e2").addClass("offset-m3");
        $("#h2").removeClass("offset-m2");
        $(".hard-letter").addClass("invisible");
    }
}

function init_btns(mode) {
    var b, limit;
    if(mode == "hard") limit = 16;
    else limit = 12;
    for(var i = 1; i <= limit; i++) {
        btns[i] = 0;
        b = "#" + i;
        $(b).attr('style', "");
    }
}

function fill_btns(mode) {
    var i, level_key;
    level_key = getval(game + "_key_"+player.language);
    if(level_key) {
        level_key = level_key.split("#");
        if(level_key[0] == player.level) {
            if(mode == "easy") {
                btns_txt = level_key[1].split('');
                for(i = 1; i <= 12; i++) document.getElementById(i).innerHTML = btns_txt[i - 1];
            } else {
				btns_txt = level_key[2].split('');
				if(player.mode=="easy") btns_txt.sort(function(a, b) {return a.localeCompare(b); });
                for(i = 1; i <= 16; i++) document.getElementById(i).innerHTML = btns_txt[i - 1];
            }
            return true;
        }
    }
    var encrypted_solution_easy = level.solution + add_letters(12 - level.solution_lenght);
    var encrypted_solution_hard = encrypted_solution_easy + add_letters(16-encrypted_solution_easy.length);
	
    var btns_txt_easy = encrypted_solution_easy.split('');
    btns_txt_easy.sort(function(a, b) {
        return a.localeCompare(b);
    });
	
    var btns_txt_hard = shuffle(encrypted_solution_hard.split(''));
	
    encrypted_solution_easy = btns_txt_easy.join('');
    encrypted_solution_hard = btns_txt_hard.join('');
	
    if(mode == "easy") {
        btns_txt = btns_txt_easy.slice();
        for(i = 1; i <= 12; i++) document.getElementById(i).innerHTML = btns_txt[i - 1];
    } else {
		btns_txt = btns_txt_hard.slice();
		if(player.mode=="easy") btns_txt.sort(function(a, b) {return a.localeCompare(b); });
        for(i = 1; i <= 16; i++) document.getElementById(i).innerHTML = btns_txt[i - 1];
    }
    setval(game + "_key_"+player.language, player.level + "#" + encrypted_solution_easy + "#" + encrypted_solution_hard);
}

function add_letters(n) {
    var text = "";
    if(player.language) var possible = "ABCDEFGHILMNOPRSTUVXZ";
    else var possible = "AĂÂBCDEFGHIÎLMNOPRSȘTȚUVXZ";
    for(var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while(0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function fill_try() {
    var usertry = "";
    for(var i = 1; i <= level.solution_lenght; i++) usertry = usertry + "_ ";
    $("#usertry").html(usertry);
    var usertrysize = 1.8 + 0.15 * (14 - level.solution_lenght);
    $("#usertry").css("font-size", usertrysize + "em");
}

function fill_level(whatmode, txt, t) {
    if(whatmode == 1) {
        var niveltxt = parseInt(player.level) + 1;
        $("#level").html(textdb[player.language]['level'] + " <b>" + niveltxt + "</b>").fadeIn(500);
    } else $('#level').html(txt).fadeIn(t);
}

function fill_img(){
	var i;
    if(player.mode=="easy") fill_img_ok();
    else if(Math.random() >= 0.5) fill_img_ok(); else fill_img_nok();               
    }
  
function fill_img_ok(){document.getElementById("clue1").src="images/"+clues[0]+".jpg"; document.getElementById("clue2").src="images/"+clues[1]+".jpg";}

function fill_img_nok(){ document.getElementById("clue1").src="images/"+clues[1]+".jpg"; document.getElementById("clue2").src="images/"+clues[0]+".jpg";}
  

function fill_definition(t) {
    $('#definition').html(textdb[player.language]['iama'] + " " + level.definition + "! " + textdb[player.language]['findme']).fadeIn(t);
}
/*onLevelClick functions --- touch();*/
function touch(l) {
    if(level.completed == 0) {
        if(btns[l] == 1) getOutLetter(l);
        else if(level.try_lenght < level.solution_lenght) putInLetter(l);
    }
}

function getOutLetter(letter) {
    if(level.try_lenght == 1) $(".reset").removeClass("resetactiv");
    eplay(music.pull_letter);
    level.try_lenght--;
    btns[letter] = 0;
    var usertry = document.getElementById('usertry').innerHTML;
    var pos = usertry.lastIndexOf(btns_txt[letter - 1]);
    $('#usertry').html(usertry.substring(0, pos) + '_' + usertry.substring(pos + 1));
    letter = "#" + letter;
    $(letter).attr('style', "");
}

function putInLetter(letter) {
    if(level.try_lenght == 0) $(".reset").addClass("resetactiv");
    eplay(music.push_letter);
    level.try_lenght++;
    btns[letter] = 1;
    document.getElementById("usertry").innerHTML = document.getElementById("usertry").innerHTML.replace('_', btns_txt[letter - 1]);
    letter = "#" + letter;
    $(letter).attr('style', "background-color: #CCC !important;");
    if(level.try_lenght == level.solution_lenght) check_player_try();
}

function check_player_try() {
    var sol = document.getElementById('usertry').innerHTML.replace(/\s/g, '');
    if(sol == level.solution) {
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
        if(player.tries == 1 && player.mode == "easy") {
            level.timeforhint = setTimeout(get_clue, 5000);
            level.timeforaudiohint = setTimeout(eplay, 4900, music.hint);
        } else if(player.tries == 2 && player.mode == "hard") {
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

function hide_definition(t) {
    $('#definition').fadeOut(t);
}

function display_message(t, type) {
    if(type == 1) $('#definition').html("<b class='succes'>" + textdb[player.language]['congrats'] + ", <span id='player-name'>" + player.name +
        "</span>!</b> " + textdb[player.language]['yourscore'] + ": <b>" + player.totalscore + "</b>").fadeIn(t);
    else $("#definition").html("<b class='error'>" + textdb[player.language]['tryagain'] + "!</b>").fadeIn(t);
}

function get_clue() {
    hide_nivel(250);
    setTimeout(fill_level, 245, 2, "<b class='mesajindiciu' onClick='show_clue();'>" + textdb[player.language]['clue'] + "!</b>", 500);
}

function hide_nivel(t) {
    $('#level').fadeOut(t);
}

function show_clue() {
    player.clue_coef = 1 - (1 / level.solution_lenght);
    player.usedclue = 1;
    eplay(music.push_letter);
    var y = level.solution.split("");
    var usertry = y[0] + " ";
    level.try_lenght = 1;
    init_btns(decide_mode());
    for(var i = 2; i <= level.solution_lenght; i++) usertry = usertry + "_ ";
    $("#usertry").html(usertry);
    $('#level').fadeOut(250);
    $(".reset").addClass("resetactiv");
    setTimeout(fill_level, 240, 1);
}

function scor() {
    var difficulty_coeficient = {
        easy: 1,
        hard: 1.75
    };
    player.timepergame = player.endofgame - player.startofgame;
    if(player.timepergame > 300000) player.timepergame = 300000;
    var evaluare = (300000 - player.timepergame + (level.solution_lenght * 10000)) / 1000;
    player.scorepergame = parseInt(evaluare * difficulty_coeficient[player.mode] * player.clue_coef);
    player.totalscore = parseInt(player.totalscore) + player.scorepergame;
}

function next() {
    stats = {
        "nivel": parseInt(parseInt(player.level) + 1),
        "time": parseInt(player.timepergame / 1000),
        "indiciu": player.usedclue,
        "mod": player.mode,
        "cuv": level.solution,
        "nume": player.name,
        "scor": player.totalscore,
        "lang": player.language,
        "ID": player.ID
    };
    send_stats();
    clearTimeout(level.timeforaudiohint);
    clearTimeout(level.timeforhint);
    player.level++;
    setTimeout(preload_next_images, 1000);
    setval(game, player.level);
    setval(game + "_score", player.totalscore);
    setval(game + "_key_"+player.language, 0);
    start(0);
}

function send_stats() {
    var req = "https://vladtimotei.ro/scripts/3books/3books_send_stats.php";
    $.get(req, stats);
}
/*onLevelClick functions --- others*/
function reset_game() {
    if(level.try_lenght != 0) {
        level.try_lenght = 0;
        fill_try();
        init_btns(decide_mode());
        setTimeout(eplay, 10, music.pull_letter);
        $(".reset").removeClass("resetactiv");
    }
}

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

function newGame() {
    clearTimeout(level.timeforaudiohint);
    clearTimeout(level.timeforhint);
    setval(game + "_name", 0);
    setval(game, 0);
	setval(game+"_ID",0);
    setval(game + "_score", 0);
    player.totalscore = 0;
    player.level = 0;
    check_level();
    check_player();
	eplay(music.ninja);
    $("#endgame").hide(500);
    $("#startgame").show(500);
}
/*DB*/
textdb = [
{'level':'Nivel',
 'iama':'Sunt un',
 'findme':'Cine sunt?',
 'congrats':'Felicitări',
 'yourscore':'Scorul tău',
 'tryagain':'Încearcă din nou',
 'clue':'Indiciu',
 'namealert':'Introdu numele mai întâi',
 'namelengthalert':'Introdu un nume mai scurt de 10 caractere!',
 'policyalert':'Acceptă Politica de confidențialitate',
 'pickothername':'Alege alt nume',
 'exists':'există deja',
 'startlevel':'Începe nivelul',
 'and':"și",
 'otherplayers':'alți jucători',
 'fullranking':'Vezi clasament',
 'game':'4 Imagini',
 'placeholder':'Scrie numele tău aici'
 
},
{'level':'Level',
 'iama':'I am a',
 'findme':'Who am I?',
 'congrats':'Congrats',
 'yourscore':'Your score',
 'tryagain':'Try again',
 'clue':'Clue',
 'namealert':'Enter your name first',
 'namelengthalert':'Choose a name shorter than 10 characters!',
 'policyalert':'Accept Privacy Policy',
 'pickothername':'Pick anoter name',
 'exists':'already exists',
 'startlevel':'Start level',
 'and':"and",
 'otherplayers':'other players',
 'fullranking':'Full ranking',
 'game': '4 Images',
 'placeholder':'Put your name here'
}
]

var levels = [
    ["MARCU|matei|luca|NT",
    "MATEI|maleahi|marcu|NT",
    "LUCA|marcu|ioan|NT",
    "IOAN|luca|fapte|NT",
    "FAPTE|ioan|romani|NT",
    "ROMANI|fapte|1corinteni|NT",
    "1CORINTENI|romani|2corinteni|NT",
    "2CORINTENI|1corinteni|galateni|NT",
    "GALATENI|2corinteni|efeseni|NT",
    "EFESENI|galateni|filipeni|NT",
    "FILIPENI|efeseni|coloseni|NT",
    "COLOSENI|filipeni|1tesaloniceni|NT",
    "TESALONICENI|coloseni|1timotei|NT",
    "1TIMOTEI|2tesaloniceni|2timotei|NT",
    "2TIMOTEI|1timotei|tit|NT",
    "TIT|2timotei|filimon|NT",
    "FILIMON|tit|evrei|NT",
    "EVREI|filimon|iacov|NT",
    "IACOV|evrei|1petru|NT",
    "1PETRU|iacov|2petru|NT",
    "2PETRU|1petru|1ioan|NT",
    "1IOAN|2petru|2ioan|NT",
    "2IOAN|1ioan|3ioan|NT",
    "3IOAN|2ioan|iuda|NT",
    "IUDA|3ioan|apocalipsa|NT",
    "EXOD|geneza|levitic|VT",
    "LEVITIC|exod|numeri|VT",
    "NUMERI|levitic|deuteronom|VT",
    "DEUTERONOM|numeri|iosua|VT",
    "IOSUA|deuteronom|judecatori|VT",
    "JUDECĂTORI|iosua|rut|VT",
    "RUT|judecatori|1samuel|VT",
    "1SAMUEL|rut|2samuel|VT",
    "2SAMUEL|1samuel|1regi|VT",
    "1REGI|2samuel|2regi|VT",
    "2REGI|1regi|1cronici|VT",
    "1CRONICI|2regi|2cronici|VT",
    "2CRONICI|1cronici|ezra|VT",
    "EZRA|2cronici|neemia|VT",
    "NEEMIA|ezra|estera|VT",
    "ESTERA|neemia|iov|VT",
    "IOV|estera|psalmi|VT",
    "PSALMI|iov|proverbe|VT",
    "PROVERBE|psalmi|eclesiastul|VT",
    "ECLESIASTUL|proverbe|cantarea-cantarilor|VT",
    "ISAIA|cantarea-cantarilor|ieremia|VT",
    "IEREMIA|isaia|plangerile-lui-ieremia|VT",
    "EZECHIEL|plangerile-lui-ieremia|daniel|VT",
    "DANIEL|ezechel|osea|VT",
    "OSEA|daniel|ioel|VT",
    "IOEL|osea|amos|VT",
    "AMOS|ioel|obadia|VT",
    "OBADIA|amos|iona|VT",
    "IONA|obadia|mica|VT",
    "MICA|iona|naum|VT",
    "NAUM|mica|habacuc|VT",
    "HABACUC|naum|tefania|VT",
    "ȚEFANIA|habacuc|hagai|VT",
    "HAGAI|tefania|zaharia|VT",
    "ZAHARIA|hagai|maleahi|VT",
    "MALEAHI|zaharia|matei|VT"
],["MARK|Matthew|Luke|NT",
    "MATTHEW|Malachi|Mark|NT",
    "LUKE|Mark|John|NT",
    "JOHN|Luke|Acts|NT",
    "ACTS|John|Romans|NT",
    "ROMANS|Acts|1Corinthians|NT",
    "1CORINTHIANS|Romans|2Corinthians|NT",
    "2CORINTHIANS|1Corinthians|Galatians|NT",
    "GALATIANS|2Corinthians|Ephesians|NT",
    "EPHESIANS|Galatians|Philippians|NT",
    "PHILIPPIANS|Ephesians|Colossians|NT",
    "COLOSSIANS|Philippians|1Thessalonians|NT",
    "THESSALONIANS|Colossians|1Timothy|NT",
    "1TIMOTHY|2Thessalonians|2Timothy|NT",
    "2TIMOTHY|1Timothy|Titus|NT",
    "TITUS|2Timothy|Philemon|NT",
    "PHILEMON|Titus|Hebrews|NT",
    "HEBREWS|Philemon|James|NT",
    "JAMES|Hebrews|1Peter|NT",
    "1PETER|James|2Peter|NT",
    "2PETER|1Peter|1John|NT",
    "1JOHN|2Peter|2John|NT",
    "2JOHN|1John|3John|NT",
    "3JOHN|2John|Jude|NT",
    "JUDE|3John|Revelation|NT",
    "EXODUS|Genesis|Leviticus|OT",
    "LEVITICUS|Exodus|Numbers|OT",
    "NUMBERS|Leviticus|Deuteronomy|OT",
    "DEUTERONOMY|Numbers|Joshua|OT",
    "JOSHUA|Deuteronomy|Judges|OT",
    "JUDGES|Joshua|Ruth|OT",
    "RUTH|Judges|1samuel|OT",
    "1SAMUEL|Ruth|2samuel|OT",
    "2SAMUEL|1samuel|1Kings|OT",
    "1KINGS|2samuel|2Kings|OT",
    "2KINGS|1Kings|1Chronicles|OT",
    "1CHRONICLES|2Kings|2Chronicles|OT",
    "2CHRONICLES|1Chronicles|ezra|OT",
    "EZRA|2Chronicles|Nehemiah|OT",
    "NEHEMIAH|ezra|Esther|OT",
    "ESTHER|Nehemiah|Job|OT",
    "JOB|Esther|Psalms|OT",
    "PSALMS|Job|Proverbs|OT",
    "PROVERBS|Psalms|Ecclesiastes|OT",
    "ECCLESIASTES|Proverbs|Song|OT",
    "ISAIAH|Song|Jeremiah|OT",
    "JEREMIAH|Isaiah|Lamentations|OT",
    "EZEKIEL|Lamentations|daniel|OT",
    "DANIEL|Ezekiel|Hosea|OT",
    "HOSEA|daniel|Joel|OT",
    "JOEL|Hosea|amos|OT",
    "AMOS|Joel|Obadiah|OT",
    "OBADIAH|amos|Jonah|OT",
    "JONAH|Obadiah|Micah|OT",
    "MICAH|Jonah|Nahum|OT",
    "NAHUM|Micah|Habakkuk|OT",
    "HABAKKUK|Nahum|Zephaniah|OT",
    "ZEPHANIAH|Habakkuk|Haggai|OT",
    "HAGGAI|Zephaniah|Zechariah|OT",
    "ZECHARIAH|Haggai|Malachi|OT",
    "MALACHI|Zechariah|Matthew|OT"
]
];

$(document).ready(function() {
    check_old_data();
    load_game();
    load_game_events();
});