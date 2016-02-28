// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var init = true;
var tag_editing = -1;
var comment_editing = -1;
var promo_editing = -1;

function is_tag_editing() {
	return tag_editing;
}

function is_comment_editing() {
	return comment_editing;
}

function is_promo_editing() {
	return promo_editing;
}

console.log("Starting Service...");

function set_timer() {
	//Setup the next poll recursively
	setTimeout(function(){
		poll();
	},  30 * 1000);
}

function poll(){
	var request = $.ajax({
	  	url: `/service/update`,
	      	type: 'GET',
	      	dataType: "json"
	});

	request.done(function(data) {
    	console.log("Polled");
    	console.log(data);

    	if(init == true || data.status == "new") {
	    	init = false;

			// Card Panel
			fill_card_panel(data);

			// Tweets Panel
			// $("#tweets").empty();

			data.tweets.forEach(function(t) {
				$.when($("#tweets").prepend(
					                    `<div class="card card-avatar">
					                      <div class="card-content">
					                          <span class="card-title activator grey-text text-darken-4" id="${t.id_str}">
					                          </span>
					                      </div>
					                    </div>`
				                  	)).then( function() {
										twttr.widgets.createTweet(
											t.id_str,
											document.getElementById(t.id_str),
											{
												theme: 'blue'
											}
										);
									});
			});
		}
		
		set_timer();
  	});

	request.fail(function(data) {
		set_timer();
	});

	// $.ajax({ url: "/service/update", success: function(data) {
 //    	console.log("Polled");

 //    	if(init == true || data.new == "true") {
	//     	init = false;

	// 		// Card Panel
	// 		fill_card_panel(data.update);

	// 		// Tweets Panel
	// 		$("#tweets").empty();

	// 		data.update.tweets.forEach(function(t) {
	// 			$.when($("#tweets").append(
	// 				                    `<div class="card card-avatar">
	// 				                      <div class="card-content">
	// 				                          <span class="card-title activator grey-text text-darken-4" id="${t.id}">
	// 				                          </span>
	// 				                      </div>
	// 				                    </div>`
	// 			                  	)).then( function() {
	// 									twttr.widgets.createTweet(
	// 										t.id_str,
	// 										document.getElementById(`${t.id}`),
	// 										{
	// 											theme: 'blue'
	// 										}
	// 									);
	// 								});
	// 		});
	// 	}
		
		
 



 //    	//Setup the next poll recursively
 //    	setTimeout(function(){
 //    		poll();
 //    	},  60 * 1000);
 //  	}, dataType: "json"});
}

function fill_card_panel(data) {
	var followers_sign, followers_color;
	var friends_sign, friends_color;
	var listed_sign, listed_color;
	var favourites_sign, favourites_color;

	var followers_count_inc = data.user.followers_count - data.user.initial_followers_count;
	var friends_count_inc = data.user.friends_count - data.user.initial_friends_count;
	var listed_count_inc = data.user.listed_count - data.user.initial_listed_count;
	var favourites_count_inc = data.user.favourites_count - data.user.initial_favourites_count;

	if (followers_count_inc >= 0) {
		followers_sign = "+";
		
		if (followers_count_inc == 0) {
			followers_color = "black-text";
		} else {
			followers_color = "blue-text text-darken-3";
		}
	} else {
		followers_sign = "";
		followers_color = "red-text";		
	}

	if (friends_count_inc >= 0) {
		friends_sign = "+";

		if(friends_count_inc == 0) {
			friends_color = "black-text";
		} else {
			friends_color = "blue-text text-darken-3";
		}
	} else {
		friends_sign = "";
		friends_color = "red-text";		
	}

	if (listed_count_inc >= 0) {
		listed_sign = "+";

		if(listed_count_inc == 0) {
			listed_color = "black-text";
		} else {
			listed_color = "blue-text text-darken-3";
		}
	} else {
		listed_sign = "";
		listed_color = "red-text";		
	}

	if (favourites_count_inc >= 0) {
		favourites_sign = "+";

		if (favourites_count_inc == 0) {
			favourites_color = "black-text";
		} else {
			favourites_color = "blue-text text-darken-3";
		}
	} else {
		favourites_sign = "";
		favourites_color = "red-text";		
	}

	$(".card-followers").empty();
	$(".card-followers").append(`<span class="white-text">${data.user.initial_followers_count}</span> <span class="${followers_color}">${followers_sign}${followers_count_inc}</span>`);

	$(".card-friends").empty();
	$(".card-friends").append(`<span class="white-text">${data.user.initial_friends_count}</span> <span class="${friends_color}">${friends_sign}${friends_count_inc}</span>`);

	$(".card-listed").empty();
	$(".card-listed").append(`<span class="white-text">${data.user.initial_listed_count}</span> <span class="${listed_color}">${listed_sign}${listed_count_inc}</span>`);

	$(".card-favourites").empty();
	$(".card-favourites").append(`<span class="white-text">${data.user.initial_favourites_count}</span> <span class="${favourites_color}">${favourites_sign}${favourites_count_inc}</span>`);
}

function Update_tags() {
	var request = $.ajax({
	  	url: `/api/tags`,
	      	type: 'GET'
	});

	request.done(function(response) {
		response.forEach(function(t) {
			var tr = `
				<tr id=${t.id}> 
					<td>
						<input type="text" id="txtTag" value="${t.name}" readonly>
					</td>`;
			if (t.for_retweet) {
				tr += `
					<td><input type="checkbox" id="" checked="checked"><label for="${t.id}-retweet-box"></label></td>`;
			} else {
				tr += `
					<td><input type="checkbox" id=""><label for="${t.id}-retweet-box"></label></td>`;
			}

			if (t.for_comment) {
				tr += `
					<td><input type="checkbox" id="" checked="checked"><label for="${t.id}-comment-box"></label></td>`;
			} else {
				tr += `
					<td><input type="checkbox" id=""><label for="${t.id}-comment-box"></label></td>`;
			}

			if (t.for_promo) {
				tr += `
					<td>
						<input type="checkbox" id="" checked="checked"><label for="${t.id}-promo-box"></label>
					</td>`;
			} else {
				tr += `
					<td>
						<input type="checkbox" id=""><label for="${t.id}-promo-box"></label>
					</td>`;				
			}

			tr += `
						<td>
							<button class="blue btn-floating waves-effect waves-light ${t.id}-btnEdit-tag" name="action">
								<i class="mdi-editor-mode-edit"></i>
							</button>
							<button class="blue btn-floating waves-effect waves-light ${t.id}-btnDelete-tag" name="action">
								<i class="material-icons">delete</i>
							</button>
						</td>
					</tr>`;

			$(".tblData-search tbody").append(tr);
			$(`.${t.id}-btnEdit-tag`).bind("click", Edit_tag);	
			$(`.${t.id}-btnDelete-tag`).bind("click", Delete_tag);
		});
	});	
}

function Update_comments() {
	var request = $.ajax({
	  	url: `/api/comments`,
	      	type: 'GET'
	});

	request.done(function(response) {
		response.forEach(function(c) {
			var tr = `
				<tr id=${c.id}> 
					<td>
						<input type="text" id="txtComment" value="${c.template}" readonly>
					</td>`;
			tr += `
						<td>
							<button class="blue btn-floating waves-effect waves-light ${c.id}-btnEdit-comment" name="action">
								<i class="mdi-editor-mode-edit"></i>
							</button>
							<button class="blue btn-floating waves-effect waves-light ${c.id}-btnDelete-comment" name="action">
								<i class="material-icons">delete</i>
							</button>
						</td>
					</tr>`;

			$(".tblData-comment tbody").append(tr);
			$(`.${c.id}-btnEdit-comment`).bind("click", Edit_comment);	
			$(`.${c.id}-btnDelete-comment`).bind("click", Delete_comment);
		});
	});	
}

function Update_promos() {
	var request = $.ajax({
	  	url: `/api/promotions`,
	      	type: 'GET'
	});

	request.done(function(response) {
		response.forEach(function(p) {
			var tr = `
				<tr id=${p.id}> 
					<td>
						<input type="text" id="txtPromo" value="${p.template}" readonly>
					</td>`;
			tr += `
						<td>
							<button class="blue btn-floating waves-effect waves-light ${p.id}-btnEdit-promo" name="action">
								<i class="mdi-editor-mode-edit"></i>
							</button>
							<button class="blue btn-floating waves-effect waves-light ${p.id}-btnDelete-promo" name="action">
								<i class="material-icons">delete</i>
							</button>
						</td>
					</tr>`;

			$(".tblData-promo tbody").append(tr);
			$(`.${p.id}-btnEdit-promo`).bind("click", Edit_promo);	
			$(`.${p.id}-btnDelete-promo`).bind("click", Delete_promo);
		});
	});	
}

function Add_tag(){
	if(is_tag_editing() >= 0) {
		return
	} else {
		tag_editing = 0;

		$(".tblData-search tbody").append( 
			`<tr id="0"> 
			<td><input class="validate" type="text"></td>
			<td>
				<input type="checkbox" id="retweet-box"><label for="retweet-box"></label>
			</td>
			<td>
				<input type="checkbox" id="comment-box"><label for="comment-box"></label>
			</td>
			<td>
				<input type="checkbox" id="promo-box"><label for="promo-box"></label>
			</td>
			<td>
				<button class="blue btn-floating waves-effect waves-light btnSave-tag" name="action">
					<i class="material-icons">done_all</i>
				</button>
				<button class="blue btn-floating waves-effect waves-light btnDelete-tag" name="action">
					<i class="material-icons">delete</i>
				</button>
			</td>
			</tr>`
			); 
		$(`.btnSave-tag`).bind("click", Save_tag);	
		$(`.btnDelete-tag`).bind("click", Delete_tag);
	}
};

function Add_comment(){
	if(is_comment_editing() >= 0) {
		return
	} else {
		comment_editing = 0;

		$(".tblData-comment tbody").append( 
			`<tr id="0"> 
			<td><input class="validate" type="text"></td>
			<td>
				<button class="blue btn-floating waves-effect waves-light btnSave-comment" name="action">
					<i class="material-icons">done_all</i>
				</button>
				<button class="blue btn-floating waves-effect waves-light btnDelete-comment" name="action">
					<i class="material-icons">delete</i>
				</button>
			</td>
			</tr>`
			); 
		$(`.btnSave-comment`).bind("click", Save_comment);	
		$(`.btnDelete-comment`).bind("click", Delete_comment);
	}
};

function Add_promo(){
	if(is_promo_editing() >= 0) {
		return
	} else {
		promo_editing = 0;

		$(".tblData-promo tbody").append( 
			`<tr id="0"> 
			<td><input class="validate" type="text"></td>
			<td>
				<button class="blue btn-floating waves-effect waves-light btnSave-promo" name="action">
					<i class="material-icons">done_all</i>
				</button>
				<button class="blue btn-floating waves-effect waves-light btnDelete-promo" name="action">
					<i class="material-icons">delete</i>
				</button>
			</td>
			</tr>`
			); 
		$(`.btnSave-promo`).bind("click", Save_promo);	
		$(`.btnDelete-promo`).bind("click", Delete_promo);
	}
};

function Save_tag(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTag = par.children("td:nth-child(1)"); 
	var tdRetweet = par.children("td:nth-child(2)");
	var tdComment = par.children("td:nth-child(3)");
	var tdPromo = par.children("td:nth-child(4)");
	var tdButtons = par.children("td:nth-child(5)");

	if(tdTag.children("input[type=text]").val() == "") {
		return;
	} else {
		var request;

		if(par.prop('id') == 0) {
			request = $.ajax({
			  	url: `/api/tags`,
			      	type: 'POST',
			      	data: {
			      		name: tdTag.children("input[type=text]").val(),
			      		for_retweet: tdRetweet.children("input[type=checkbox]").is(':checked'),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/tags/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		name: tdTag.children("input[type=text]").val(),
			      		for_retweet: tdRetweet.children("input[type=checkbox]").is(':checked'),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTag.html(`<input type="text" id="txtTag" value="${tdTag.children("input[type=text]").val()}" readonly>`);
			tdRetweet.children("input").attr('id',"");
			tdRetweet.children("label").attr('for',`${response.id}-retweet-box`);
			tdComment.children("input").attr('id',"");
			tdComment.children("label").attr('for',`${response.id}-comment-box`);
			tdPromo.children("input").attr('id',"");
			tdPromo.children("label").attr('for',`${response.id}-promo-box`);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${id}-btnEdit-tag" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-tag" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(`.${id}-btnEdit-tag`).bind("click", Edit_tag); 
			$(`.${id}-btnDelete-tag`).bind("click", Delete_tag);
			tag_editing = -1;
		});
	}
};

function Save_comment(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTemplate = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	if(tdTemplate.children("input[type=text]").val() == "") {
		return;
	} else {
		var request;

		if(par.prop('id') == 0) {
			request = $.ajax({
			  	url: `/api/comments`,
			      	type: 'POST',
			      	data: {
			      		template: tdTemplate.children("input[type=text]").val()
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/comments/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		template: tdTemplate.children("input[type=text]").val()
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTemplate.html(`<input type="text" id="txtComment" value="${tdTemplate.children("input[type=text]").val()}" readonly>`);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${id}-btnEdit-comment" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-comment" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(`.${id}-btnEdit-comment`).bind("click", Edit_comment); 
			$(`.${id}-btnDelete-comment`).bind("click", Delete_comment);
			comment_editing = -1;
		});
	}
};

function Save_promo(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTemplate = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	if(tdTemplate.children("input[type=text]").val() == "") {
		return;
	} else {
		var request;

		if(par.prop('id') == 0) {
			request = $.ajax({
			  	url: `/api/promotions`,
			      	type: 'POST',
			      	data: {
			      		template: tdTemplate.children("input[type=text]").val()
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/promotions/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		template: tdTemplate.children("input[type=text]").val()
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTemplate.html(`<input type="text" id="txtPromo" value="${tdTemplate.children("input[type=text]").val()}" readonly>`);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${id}-btnEdit-promo" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-promo" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(`.${id}-btnEdit-promo`).bind("click", Edit_promo); 
			$(`.${id}-btnDelete-promo`).bind("click", Delete_promo);
			promo_editing = -1;
		});
	}
};

function Edit_tag(){
	if(is_tag_editing() >= 0) {
		return;
	} else {
		var par = $(this).parent().parent();
		var id = par.prop('id');

		tag_editing = id;

		var tdTag = par.children("td:nth-child(1)"); 
		var tdRetweet = par.children("td:nth-child(2)"); 
		var tdComment = par.children("td:nth-child(3)"); 
		var tdPromo = par.children("td:nth-child(4)");
		var tdButtons = par.children("td:nth-child(5)");
		tdTag.html(`<input type="text" id="txtTag" value="${tdTag.children("input[type=text]").val()}">`);
		tdRetweet.children("input").attr('id',`${par.prop('id')}-retweet-box`);
		tdComment.children("input").attr('id',`${par.prop('id')}-comment-box`);
		tdPromo.children("input").attr('id',`${par.prop('id')}-promo-box`);
		tdButtons.html(
			`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-tag" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-tag" name="action">
				<i class="material-icons">delete</i>
			</button>
			`
			); 
		$(`.${id}-btnSave-tag`).bind("click", Save_tag);
		$(`.${id}-btnDelete-tag`).bind("click", Delete_tag);
	}
};

function Edit_comment(){
	if(is_comment_editing() >= 0) {
		return;
	} else {
		var par = $(this).parent().parent();
		var id = par.prop('id');

		comment_editing = id;

		var tdTemplate = par.children("td:nth-child(1)");
		var tdButtons = par.children("td:nth-child(2)");
		tdTemplate.html(`<input type="text" id="txtComment" value="${tdTemplate.children("input[type=text]").val()}">`);
		tdButtons.html(
			`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-comment" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-comment" name="action">
				<i class="material-icons">delete</i>
			</button>
			`
			); 
		$(`.${id}-btnSave-comment`).bind("click", Save_comment);
		$(`.${id}-btnDelete-comment`).bind("click", Delete_comment);
	}
};

function Edit_promo(){
	if(is_promo_editing() >= 0) {
		return;
	} else {
		var par = $(this).parent().parent();
		var id = par.prop('id');

		promo_editing = id;

		var tdTemplate = par.children("td:nth-child(1)");
		var tdButtons = par.children("td:nth-child(2)");
		tdTemplate.html(`<input type="text" id="txtPromo" value="${tdTemplate.children("input[type=text]").val()}">`);
		tdButtons.html(
			`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-promo" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-promo" name="action">
				<i class="material-icons">delete</i>
			</button>
			`
			); 
		$(`.${id}-btnSave-promo`).bind("click", Save_promo);
		$(`.${id}-btnDelete-promo`).bind("click", Delete_promo);
	}
};

function Delete_tag(){
	var par = $(this).parent().parent();
	var id = par.prop('id');

	if(is_tag_editing() == id || is_tag_editing() < 0) {
		if(par.prop('id') > 0) {
			var request = $.ajax({
			  	url: `/api/tags/${par.prop('id')}`,
			      	type: 'DELETE'
			});

			request.done(function(response) {
				par.remove();
				tag_editing = -1;
			});		
		} else {
			par.remove();
			tag_editing = -1;	
		}
	} else {
		return
	}
};

function Delete_comment(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');

	if(is_comment_editing() == id || is_comment_editing() < 0) {
		if(par.prop('id') > 0) {
			var request = $.ajax({
			  	url: `/api/comments/${par.prop('id')}`,
			      	type: 'DELETE'
			});

			request.done(function(response) {
				par.remove();
				comment_editing = -1;
			});		
		} else {
			par.remove();
			comment_editing = -1;	
		}
	} else {
		return
	}
};

function Delete_promo(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');

	if(is_promo_editing() == id || is_promo_editing() < 0) {
		if(par.prop('id') > 0) {
			var request = $.ajax({
			  	url: `/api/promotions/${par.prop('id')}`,
			      	type: 'DELETE'
			});

			request.done(function(response) {
				par.remove();
				promo_editing = -1;
			});		
		} else {
			par.remove();
			promo_editing = -1;	
		}
	} else {
		return
	}
};

(function(){ //Add, Save, Edit and Delete functions code
	poll();

	Update_tags();
	Update_comments();
	Update_promos();

	$(".btnEdit-tag").bind("click", Edit_tag); 
	$(".btnDelete-tag").bind("click", Delete_tag);
	$(".btnAdd-tag").bind("click", Add_tag);

	$(".btnEdit-comment").bind("click", Edit_comment); 
	$(".btnDelete-comment").bind("click", Delete_comment); 
	$(".btnAdd-comment").bind("click", Add_comment);

	$(".btnEdit-promo").bind("click", Edit_promo); 
	$(".btnDelete-promo").bind("click", Delete_promo); 
	$(".btnAdd-promo").bind("click", Add_promo); 
})();



