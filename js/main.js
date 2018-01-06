function colorChoices() {
	for(var i=0;i<choices.length;i++) {
		var alloff = true;
		for(var s=0;s<subchoices[i].length;s++) {
			if(subchoices[i][s] == 1) {
				$("#tc"+i+"_"+s).css("background-color", "#EFE");
				$("#tc"+i+"_"+s).css("border-color", "#575");
				alloff = false
			} else {
				//$("#tc"+i+"_"+s).css("background-color", "#FFF");
				//$("#tc"+i+"_"+s).css("border-color", "#FFF");
				$("#tc"+i+"_"+s).css("background-color", topics_background);
				$("#tc"+i+"_"+s).css("border-color", topics_background);
			}
		}
		if(choices[i] == 1) {
			$("#tc"+i).css("background-color", "#EFE");
			$("#tc"+i).css("border-color", "#575");

			//if(alloff) {
			//	$(".tc"+i).css("background-color", "#EFE");
			//	$(".tc"+i).css("border-color", "#575");
			//}
		} else {
			//$("#tc"+i).css("background-color", "#FFF");
			//$("#tc"+i).css("border-color", "#FFF");
			$("#tc"+i).css("background-color", topics_background);
			$("#tc"+i).css("border-color", topics_background);

			//if(alloff) {
			//	$(".tc"+i).css("background-color", "#FFF");
			//	$(".tc"+i).css("border-color", "#FFF");
			//}
		}
	}
}

function filter_clusters(search_txt)
{
	// Filter the papers by cluster number and search parameters
	var paperdivs_new = []
	// Check if all toggles are off
	var all_off = true
	for (var i=0; i<n_groups; i++)
	{
		if (choices[i] == 1) all_off = false;
		for (var s=0; s<subchoices[i].length; s++)
			if (subchoices[i][s] == 1) all_off[i] = false;
	}

	search_txt = search_txt.split("|");
	var docs = 0;

	// Only display papers in clusters that are 'on'
	paperdivs_raw.each( function(a) {
		var ixa = parseInt(paperdivs_raw[a]['id'].substring(3));

		for (var p = 0; p < search_txt.length; p++) {
			// Filter by clusters
			var g = paper_groups[ixa]
			var s = paper_subgroups[ixa]
			if (((choices[g] == 1 && subchoices[g][s] == 1) || all_off)) {
			//if (((choices[g] == 1) || all_off)) {
				//Filter by search
				if ((search_txt=="") ||
					(search_txt!="" && paperdivs_raw[a].innerText.toLowerCase().indexOf(search_txt[p]) > -1)) {
					paperdivs_new.push(paperdivs_raw[a]);
					docs++;
				}
			}
		}

		/*for (var p = 0; p < search_txt.length; p++) {
			// Filter by clusters
			for (var i=0; i<n_groups; i++)
			{
				if ((choices[i] == 1 || all_off) && loaddists[ixa][i]>0 ) {
					//Filter by search
					if ((search_txt=="") ||
						(search_txt!="" && paperdivs_raw[a].innerText.toLowerCase().indexOf(search_txt[p]) > -1)) {
						paperdivs_new.push(paperdivs_raw[a]);
						break;
					}
				}
			}
		}*/
	})

	document.getElementById("counter").innerHTML = docs;

	return paperdivs_new;
};

// this permutes the divs (that contain 1 paper each) based on a custom sorting function
// in our case, this sort is done as dot product based on the choices[] array
// here we are guaranteed ldadist[] already sums to 1 for every paper
function update_papers() {
	if (paperdivs_raw == undefined) {
		paperdivs_raw = $("#rtable").children(".apaper").clone();
	}
	var paperdivs = paperdivs_raw;
	$("#rtable").children(".apaper").detach();

	// normalize choices to sum to 1
	var nn = choices.slice(0); // copy the array
	var ss = 0.0;
	for(var j=0;j<choices.length;j++) { ss += choices[j]; }
	for(var j=0;j<choices.length;j++) { nn[j] = nn[j]/ss; }

// Sort data using either cluster scores or pairwise TFIDF score
	paperdivs.sort(function(a,b) {
		var vala = parseInt($(a)[0]['id'].substring(3));
		var valb = parseInt($(b)[0]['id'].substring(3));

		// sort according to title
		if(sort_according === 1) {
			vala = $(a).find(".title").html()
			valb = $(b).find(".title").html()
		}
		// sort according to author
		if(sort_according === 2) {
			vala = $(a).find(".key").html()
			valb = $(b).find(".key").html()
		}
		// sort according to conference
		if(sort_according === 3) {
			vala = $(a).find(".conference").html()
			valb = $(b).find(".conference").html()
		}
		// sort according to year
		if(sort_according === 4) {
			vala = parseInt($(a).find(".year").html())
			valb = parseInt($(b).find(".year").html())
		}

    return (vala < valb) ? -1 : (vala > valb) ? 1 : 0;
	});

	// Filter the clusters based on which topics are toggled
	var search_txt = document.getElementById("searchText").value.toLowerCase();
	// console.log("Search: "+search_txt);
	paperdivs = filter_clusters(search_txt);


	$("#rtable").append(paperdivs);
}


function toggleGroup(tcid) {
	setGroup(tcid, 1 - choices[tcid]); // toggle!
}

function toggleSubGroup(tcid, scid) {
	setSubGroup(tcid, scid, 1 - subchoices[tcid][scid]); // toggle!
}

function setGroup(tcid, val) {
	choices[tcid] = val; // set!

	for (var s=0; s<subchoices[tcid].length; s++)
		subchoices[tcid][s] = choices[tcid];

	colorChoices();
	update_papers();
}

function setSubGroups(tcid, val) {
	for (var s=0; s<subchoices[tcid].length; s++)
			subchoices[tcid][s] = val;	// set

	colorChoices();
	update_papers();
}


function setSubGroup(tcid, scid, val) {
	subchoices[tcid][scid] = val; // set!

	var all_off = true;
	if(subchoices[tcid][scid] == 1) all_off = false;
	for (var s = 0; s < subchoices[tcid].length && all_off; s++)
		if(subchoices[tcid][s] == 1) all_off = false;

	if(!all_off)
		choices[tcid] = 1;
	else
		choices[tcid] = 0;

	colorChoices();
	update_papers();
}


// when page loads...
$(document).ready(function(){

	// Add sorting options above paper list
	s = '<table width=50%><tbody><tr>'
	for (var i=0; i<n_groups; i++) {
		if ((i-1)%6 == 5) s = s + "</tr><tr>";
/*
		s = s + '<td align="center" padding=5px valign="top"><span style="color:'+colors(i) + '" class="topicchoice" id="tc'+i+'"> <u>Topic '+i+':</u></span>';
		s = s + '<br><span style="color:'+colors(i) + '"> ' + keywords[i] + '</span></td>';
*/

		s = s + '<td align="center" padding=5px valign="top"><span style="color:'+colors(i) + '" class="topicchoice" id="tc'+i+'"> ' + keywords[i] + '</span>';

		for (var si=0; si < subkeywords[i].length; si++) {
			if(subkeywords[i][si])
				s = s + '<br><span style="color:'+colors(i) + '" class="topicsubchoice tc'+i+'" id="tc'+i+'_'+si+'"> ' + subkeywords[i][si] + '</span>';
		}

		s = s + '</td>';

	}
	s = s + "</tr></tbody></table>"
	$("#sortoptions").append(s);


	update_papers();
	colorChoices();

	// user clicks on one of the Topic buttons
	$(".topicchoice").click(function() {
		similarityMode = 0; // make sure this is off
		// var tcid = parseInt($(this).attr('id').substring(2));
		var tcid = parseInt($(this)[0]['id'].substring(2));
		choices[tcid] = 1 - choices[tcid]; // toggle!
		for (var s=0; s < subchoices[tcid].length; s++)
			subchoices[tcid][s] = choices[tcid];

		colorChoices();
		update_papers();
	});

	$(".topicsubchoice").click(function() {
		similarityMode = 0; // make sure this is off
		// var tcid = parseInt($(this).attr('id').substring(2));
		var tmp = $(this)[0]['id'].substring(2).split("_");
		var tcid = parseInt(tmp[0]);
		var scid = parseInt(tmp[1]);
	  subchoices[tcid][scid] = 1 - subchoices[tcid][scid]; // toggle!

		var all_off = true;
		if(subchoices[tcid][scid] == 1) all_off = false;
		for (var s = 0; s < subchoices[tcid].length && all_off; s++)
			if(subchoices[tcid][s] == 1) all_off = false;

		if(!all_off)
			choices[tcid] = 1;
 		// Sometimes we have papers only assigned the group
		//else
		//	choices[tcid] = 0;

		colorChoices();
		update_papers();
	});

// user clicks on "rank by tf-idf similarity to this" button for some paper
	$(".sort_literature").click(function() {
		criterion = $(this)[0]['id'];

		var elems = document.getElementsByClassName('sort_literature');

    for (var i = 0; i < elems.length; i++) {
        if (elems[i].getAttribute("id") == criterion) {
            elems[i].style.color = 'red';
        } else {
            elems[i].style.color = 'black';
        }
    }

		sort_according = 0; // original order
		if(criterion == 'title')
			sort_according = 1; // according to title
		if(criterion == 'author')
			sort_according = 2; // according to title
		if(criterion == 'conference')
			sort_according = 3; // according to title
		if(criterion == 'year')
			sort_according = 4; // according to title

		// document.getElementById("searchText").value = ""
		colorChoices();
		update_papers();
	});



	// user clicks on "rank by tf-idf similarity to this" button for some paper
	$(".sim").click(function() {
		similarityMode = 1; // turn on similarity mode
		//for(var i=0;i<choices.length;i++) { choices[i] = 0; } // zero out choices
		// similarTo = parseInt($(this).attr('id').substring(3)); // store id of the paper
		// console.log($(this)[0]['id']);
		similarTo = parseInt($(this)[0]['id'].substring(3)); // store id of the paper clicked

		// document.getElementById("searchText").value = ""
		colorChoices();
		update_papers();

		// also scroll to top
		// $('html, body').animate({ scrollTop: 0 }, 'fast');
	});

	// user clicks on "abstract button for some paper
	$(".abstr").click(function() {
		var pid = parseInt($(this).attr('id').substring(2)); // id of the paper clicked
		var aurl = "abstracts/a" + pid + ".txt";
		var holderdiv = "#abholder" + pid;

		if($(holderdiv).is(':visible')) {

			$(holderdiv).slideUp(); // hide the abstract away

		} else {

			// do ajax request and fill the abstract div with the result
			$.ajax({
	            url : aurl,
	            dataType: "text",
	            success : function (data) {
	                $(holderdiv).html(data);
	                $(holderdiv).slideDown();
	            }
	        });
		}
	});
});

function openTab(evt, tab) {
  var i, x, tablinks;
  x = document.getElementsByClassName("tabs");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
  }
  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " w3-grey";
}