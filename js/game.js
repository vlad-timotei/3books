// Un joc creat de Vlad Timotei 2020
 // ver. 02062020
  var nivel, solutie, lungime_solutie, lungime_incercare, corect, definitie, mode, nr_butoane, workaroundshint, timeforhint, stats;
  var startofgame, endofgame, timepergame, scorepergame, totalscore; 
  var coeficient_dificultate = {easy:1, hard:1.75};
  var coeficient_indiciu=1;
  var indiciu_folosit=0;
  var joc="3carti_02062020";
  var btns = []; //incepe cu 1
  var sound=1;
  var nrincercari;
  var btns_txt = []; //incepe cu 0!
  var indicii = [];  
  var scorect = document.getElementById("s_corect"); 
  var sincorect = document.getElementById("s_incorect"); 
  var sialitera = document.getElementById("s_ia_litera"); 
  var spunelitera = document.getElementById("s_pune_litera"); 
  var sninja = document.getElementById("s_ninja"); 
  var sswitch = document.getElementById("s_switch"); 
  var shint = document.getElementById("s_hint"); 
  var key_game, key_NT, key_VT, key_game_arr, key_NT_arr, key_VT_arr;

  key_NT="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24";
  key_VT="25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60";
 

  
  var niveluri = [
         "MARCU|matei|luca|NT", // prima mereu 0
         "MATEI|maleahi|marcu|NT", // NT 1-24  ( 1&2 Tesaloniceni = Tesaloniceni )( Apocalipsa nu e )
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
		 "EVREI|filimon|iacob|NT",
         "IACOV|evrei|1petru|NT",
		 "1PETRU|iacob|2petru|NT",
		 "2PETRU|1petru|1ioan|NT",
         "1IOAN|2petru|2ioan|NT",
		 "2IOAN|1ioan|3ioan|NT",
		 "3IOAN|2ioan|iuda|NT",
		 "IUDA|3ioan|apocalipsa|NT",
        "EXOD|geneza|levitic|VT", // VT 25-60 ( Geneza & Cantarea cantarilor & Plangerile lui Ieremia lipsesc)
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
		"EZECHEL|plangerile-lui-ieremia|daniel|VT",
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
		 
		
		
		];
 

 

  function start(fromhome)
  { 
   
  
  if(fromhome==1) { eplay(sninja); $("#startgame").hide(1000);  $("#game").show(500); joaca();}
  if(fromhome==0) { if(nivel>=niveluri.length) {clearTimeout(workaroundshint); show_final_score(); $("#game").hide(500); $("#endgame").show(500);}
             else {  $("#game").hide(600);  setTimeout(joaca,400); $("#game").show(500);}
                  }   
  if(fromhome==-1){$("#endgame").hide(500);  setTimeout(joaca,400); $("#game").show(500);}
  }
 
  function joaca(){
  gametime(1);
  init(); 
  fill_incercare();
  fill_nivel(1);
  fill_img();
  fill_btns(mode);
  pune_definitie(0);  }
  
  function init()
  { 
  init_btns();
  var date = niveluri[key_game_arr[nivel]].split('|',4);
  solutie=date[0];
  indicii[0]=date[1];
  indicii[1]=date[2];   
  definitie=date[3]; 
  if(definitie=="NT") definitie="Noul Testament"; else definitie="Vechiul Testament";
  corect=0;
  lungime_solutie=solutie.length; 
  lungime_incercare=0;
  nrincercari=0;
  coeficient_indiciu=1;
  indiciu_folosit=0;
  incercare="";
  }
  
  function init_btns() {  var b;  for (var i = 1; i <= nr_butoane; i++) { btns[i] =0; b="#"+i;  $(b).attr( 'style',"" ); } }
  
  function fill_nivel(mode,txt,t){if(mode==1) {var niveltxt=parseInt(nivel)+1;   $("#nivel").html("Nivel <b>"+niveltxt+"</b>").fadeIn(500);} else $('#nivel').html(txt).fadeIn(t);}
  
  function hide_nivel(t){ $('#nivel').fadeOut(t);}
  
  function fill_incercare() {for(var i=1; i<=lungime_solutie; i++)  incercare=incercare+"_ ";   $("#incercare").html(incercare); }
  
  function fill_img(){var i;
    if(mode=="easy") fill_img_ok();
    else if(Math.random() >= 0.5) fill_img_ok(); else fill_img_nok();               
            
  }
  
  function fill_img_ok(){document.getElementById("clue1").src="images/"+indicii[0]+".jpg"; document.getElementById("clue2").src="images/"+indicii[1]+".jpg";}

  function fill_img_nok(){ document.getElementById("clue1").src="images/"+indicii[1]+".jpg"; document.getElementById("clue2").src="images/"+indicii[0]+".jpg";}
  function ascunde_definitie(t){ $('#definitie').fadeOut(t); }
  
  function pune_definitie(t) { $('#definitie').html("Sunt o carte din "+definitie+" și am lângă mine pe:").fadeIn(t); }
  
  function fill_btns(mode)
  {
  var i;
  var solutie_encriptata=solutie+adaugalitere(nr_butoane-lungime_solutie);
  btns_txt=solutie_encriptata.split('');
  if(mode=="easy")
  btns_txt.sort(function (a, b) {return a.localeCompare(b);});
  else
  btns_txt=shuffle(btns_txt);
  for(i=1; i<=nr_butoane; i++)
  document.getElementById(i).innerHTML=btns_txt[i-1];
  }
  
  function adaugalitere(n)
  { 
  var text = "";
  var possible = "AĂÂBCDEFGHIÎLMNOPRSȘTȚUVXZ";
  for( var i=0; i <n; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
  }


  function shuffle(array) 
  {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
  }return array;
  }
  
  function touch(l){if(corect==0){ if(btns[l]==1) getOutLetter(l); else if(lungime_incercare<lungime_solutie) putInLetter(l); }}
  
  function putInLetter(litera)
  {
  if(lungime_incercare==0) $(".reset").addClass("resetactiv"); 
  eplay(spunelitera);
  lungime_incercare++; 
  btns[litera]=1;
  document.getElementById("incercare").innerHTML=document.getElementById("incercare").innerHTML.replace('_', btns_txt[litera-1]);
  litera="#"+litera;   $(litera).attr( 'style',"background-color: #CCC !important;" );
  if(lungime_incercare==lungime_solutie) verificare();
  }
  
  function getOutLetter(litera)
  {
  if(lungime_incercare==1) $(".reset").removeClass("resetactiv"); 
  eplay(sialitera);
  lungime_incercare--;  btns[litera]=0;
  incercare=document.getElementById('incercare').innerHTML;
  var pos = incercare.lastIndexOf(btns_txt[litera-1]); 
  document.getElementById('incercare').innerHTML=incercare.substring(0,pos) + '_' + incercare.substring(pos+1);
  litera="#"+litera;  $(litera).attr( 'style',"" );
  }
  
  function verificare()
  {
    var sol = document.getElementById('incercare').innerHTML.replace(/\s/g,''); 
	if(sol==solutie)
	{
	corect=1;
	eplay(scorect);
	lungime_incercare=0; 
	$(".reset").removeClass("resetactiv");
	ascunde_definitie(100);
	gametime(2); scor(); 
	setTimeout(pune_mesaj,75,250,1);
	setTimeout(next,1500);
	}
	else
	{
	 nrincercari++;
     if(nrincercari==1&&mode=="easy") {timeforhint=setTimeout(get_clue,5000); workaroundshint=setTimeout(eplay,4900,shint);  }
	 else if(nrincercari==2&&mode=="hard") { timeforhint=setTimeout(get_clue,5000);	 workaroundshint=setTimeout(eplay,4900,shint); }
	 eplay(sincorect);
	 ascunde_definitie(250);
	 setTimeout(pune_mesaj,225,500,0);
	 setTimeout(ascunde_definitie,2250,500);
	 setTimeout(pune_definitie,2725,500);
	}
  }
  
  function pune_mesaj(t,tip)
  {
  if(tip==1)
  $('#definitie').html("<b class='succes'>Felicitări!</b> Scorul tău: <b>"+totalscore+"</b>").fadeIn(t);
  else
  $("#definitie").html("<b class='error'>Mai încearcă!</b>").fadeIn(t);
  
  }

  function reset_game() { if(lungime_incercare!=0){ lungime_incercare=0; incercare=""; fill_incercare(); init_btns(); setTimeout(eplay,10,sialitera); $(".reset").removeClass("resetactiv");}}
  function newGame(){clearTimeout(workaroundshint); clearTimeout(timeforhint); setC(joc,0); setC(joc+"_score",0); totalscore=0; nivel=0; start(-1); }
  function next(){ stats="?nivel="+parseInt(parseInt(key_game_arr[nivel])+1)+"&time="+parseInt(timepergame/1000)+"&indiciu="+indiciu_folosit+"&mod="+mode+"&cuv="+solutie; clearTimeout(workaroundshint); clearTimeout(timeforhint); nivel++;  setC(joc,nivel); setC(joc+"_score", totalscore); start(0); send_stats(); }
  
  /*function setC(cname, cvalue) {var d = new Date(); d.setTime(d.getTime() + (90*24*60*60*1000));  var expires = "expires="+ d.toUTCString();  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; }


  function getC(cname) { var name = cname + "=";  var decodedCookie = decodeURIComponent(document.cookie);   var ca = decodedCookie.split(';');   for(var i = 0; i <ca.length; i++) { var c = ca[i];  while (c.charAt(0) == ' ') { c = c.substring(1); }if (c.indexOf(name) == 0) { return c.substring(name.length, c.length);}}return 0;}
  */

  function getC(cname) { var loc = localStorage.getItem(cname); if(loc) return loc; else return 0; }
  function setC(cname, cvalue) { localStorage.setItem(cname,cvalue);}
 
  function mode_highlight(){if(mode=="hard") { $("#hard").addClass("modactiv"); $("#easy").removeClass("modactiv");}  else { $("#easy").addClass("modactiv"); $("#hard").removeClass("modactiv");}}
  function mode_show(){if(mode=="hard") $( "#mode").prop('checked', true);  else $( "#mode").prop('checked', false); }
  
  function s_switch_check(){ eplay(sswitch); } 
  
  function mode_check()
  {
  if($("#mode").is(":checked")) {
  mode="hard";
  nr_butoane=16;
  $("#he1").addClass("offset-m2");
  $("#he1").removeClass("offset-m3");
  $("#e2").removeClass("offset-m3");
  $("#h2").addClass("offset-m2");
  $(".hard-letter").removeClass("invisible");
  } else { 
  mode="easy"; 
  nr_butoane=12; 
  $("#he1").removeClass("offset-m2");
  $("#he1").addClass("offset-m3");
  $("#e2").addClass("offset-m3");
  $("#h2").removeClass("offset-m2");
  $(".hard-letter").addClass("invisible");
  } 
  setC(joc+"_mode",mode);
  mode_highlight();
  }
  
  function info(x){
  setTimeout(eplay,10,sninja);
  if(x){$("#info").hide(500); $("#game").show(500);}
  else{ clearTimeout(workaroundshint); $("#game").hide(500); $("#info").show(500);}}
  
  function home(){
  clearTimeout(workaroundshint); setTimeout(eplay,10,sninja); level_check(); $("#game").hide(500); $("#startgame").show(500);
  }
  
  function switch_sound(){
  if(sound==0) 
  {sound=1;  $("#switch_sound").html("volume_up");}
  else {sound=0; $("#switch_sound").html("volume_off");}
  }
  
  function level_check(){
  var startlevel = parseInt(nivel)+1;
  if(nivel>=niveluri.length) { show_final_score(); clearTimeout(workaroundshint);  $("#startgame").hide(); $("#endgame").show(1000);  } 
  else if (startlevel==1) $("#startlevel").html("START"); else $("#startlevel").html("Începe nivelul "+startlevel);
  }
  
  
  function get_clue(){
	 hide_nivel(250);
	 setTimeout(fill_nivel,245,2,"<b class='mesajindiciu' onClick='show_clue();'>Indiciu!</b>",500);
  }
  function show_clue() 
  {
   coeficient_indiciu=1-(1/lungime_solutie);
   indiciu_folosit=1;
   eplay(spunelitera);
   var y = solutie.split("");
   incercare=y[0]+" ";
   lungime_incercare=1;
   init_btns();
   for(var i=2; i<=lungime_solutie; i++)
   incercare=incercare+"_ ";  
   $("#incercare").html(incercare);
   $('#nivel').fadeOut(250);
   $(".reset").addClass("resetactiv");
   setTimeout(fill_nivel,240,1);
   
  }
  
  function eplay(efect) {if(sound) efect.play(); }
  
  function gametime(moment){if(moment==1) startofgame=new Date().getTime(); else  endofgame=new Date().getTime(); }
  
  function scor()
  {
	 timepergame=endofgame-startofgame;
	 if(timepergame>300000) timepergame=300000;
	 var evaluare = (300000-timepergame+(lungime_solutie*10000))/1000;
	 scorepergame=parseInt(evaluare*coeficient_dificultate[mode]*coeficient_indiciu);
	 totalscore=parseInt(totalscore)+scorepergame;
  }
  
  function show_final_score() {$("#scor_total").html(totalscore);}
  
  function send_stats(){
  var xhttp = new XMLHttpRequest(); 
  xhttp.open("GET", "https://vladtimotei.ro/scripts/3books_stats.php"+stats, true);
  xhttp.send();
  }
  

 function generate_key(){
     key_NT_arr=shuffle(key_NT.split(","));
     key_NT=key_NT_arr.join();
     
     key_VT_arr=shuffle(key_VT.split(","));
     key_VT=key_VT_arr.join();
     
     key_game="0,"+key_NT+","+key_VT;
     key_game_arr=key_game.split(",");
     
     setC(joc+"_key",key_game);
    
   }
     

   var modal = document.getElementById("modal_area");
  var modalGame = document.getElementById("game");
  function open_modal(image){
    var modalImg = document.getElementById("maximg");
	modalGame.style.opacity="0.5";
    modal.style.display = "block";
    modalImg.src = image;
  }

  function close_modal() {modal.style.display = "none"; modalGame.style.opacity="1";}
  
 
  $(document).ready( function(){
  nivel=getC(joc);
  totalscore=getC(joc+"_score");  
  mode=getC(joc+"_mode");  
  if(mode==0) mode="easy"; 
  key_game=getC(joc+"_key");
  if(key_game==0) generate_key();
  else key_game_arr=key_game.split(",");
  mode_show();  
  mode_highlight();
  mode_check();
  level_check();   
  $("#mode").change(mode_check);
  }); 