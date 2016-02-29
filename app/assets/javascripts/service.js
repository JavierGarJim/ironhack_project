// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var init = true;
var tag_editing = -1;
var comment_editing = -1;
var promo_editing = -1;
var tweets_count = 0;

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
    	console.log(data);

    	if(init == true) {
    		data.status = data.tweets.length;

    		init = false;
    	}

		// Card Panel
		fill_card_panel(data);

		// Tweets Panel
		console.log(tweets_count)

		if (tweets_count > 100) {
			$("#tweets").empty();

			tweets_count = 0;
		}

		data.tweets.slice(data.tweets.length - data.status, data.tweets.length).forEach(function(t) {
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

									tweets_count++;
								});
		});
		
		set_timer();
  	});

	request.fail(function(data) {
		set_timer();
	});
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
				<tr id="${t.id}"> 
					<td><input type="text" value="${t.name}" readonly></td>`;

			if (t.for_retweet) {
				tr += `<td><input type="checkbox" id="${t.id}-retweet-box" checked disabled><label for="${t.id}-retweet-box"></label></td>`;
			} else {
				tr += `<td><input type="checkbox" id="${t.id}-retweet-box" disabled><label for="${t.id}-retweet-box"></label></td>`;
			}

			if (t.comment) {
				tr += `<td><select class="${t.comment.id}-comment-select"><option value="${t.comment.id}">${t.comment.id}</option></select></td>`;
			} else {
				tr += `<td><select class="none-comment-select"><option value="none">none</option></select></td>`;
			}

			if (t.promotion) {
				tr += `<td><select class="${t.promotion.id}-promo-select"><option value="${t.promotion.id}">${t.promotion.id}</option></select></td>`;
			} else {
				tr += `<td><select class="none-promo-select"><option value="none">none</option></select></td>`;
			}

			if (t.actived) {
				tr += `
					<td>
						<div class="switch"><label><input type="checkbox" checked disabled><span class="lever"></span></label></div>
					</td>`;
			} else {
				tr += `
					<td>
						<div class="switch"><label><input type="checkbox" disabled><span class="lever"></span></label></div>
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
			
			$('.tblData-search tbody').prepend(tr);
			var par = $(`#${t.id}`);
			var tdComment = par.children("td:nth-child(3)");
			var tdPromo = par.children("td:nth-child(4)");
			var tdStatus = par.children("td:nth-child(5)");
			tdComment.children("select").material_select();
			tdComment.children("div").children("input[type=text]").prop('disabled', true);
			tdPromo.children("select").material_select();
			tdPromo.children("div").children("input[type=text]").prop('disabled', true);
			var tdButtons = par.children("td:nth-child(6)");
			tdButtons.children(`.${t.id}-btnEdit-tag`).bind("click", Edit_tag);	
			tdButtons.children(`.${t.id}-btnDelete-tag`).bind("click", Delete_tag);
		});
	});	
}

function Update_comments() {
	var request = $.ajax({
	  	url: `/api/comments`,
	      	type: 'GET'
	});

	request.done(function(comments) {
		comments.forEach(function(c) {
			var tr = `
				<tr id="${c.id}"> 
					<td><input type="text" value="${c.template}" readonly></td>
					<td>${c.id}</td>
					`;
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

	request.done(function(promotions) {
		promotions.forEach(function(p) {
			var tr = `
					<tr id="${p.id}"> 
					<td><input type="text" value="${p.template}" readonly></td>
					<td>${p.id}</td>
					`;
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

		var comments_request = $.ajax({
		  	url: `/api/comments`,
		      	type: 'GET'
		});

		comments_request.done(function(comments) {
			var promotions_request = $.ajax({
			  	url: `/api/promotions`,
			      	type: 'GET'
			});

			promotions_request.done(function(promotions) {
				$(".tblData-search tbody").prepend( 
													`<tr id="0"> 
													<td><input class="validate" type="text"></td>
													<td>
														<input type="checkbox" id="retweet-box"><label for="retweet-box"></label>
													</td>
													<td>
														<select class="comment-select"><option value="none">none</option></select>
													</td>
													<td>
														<select class="promo-select"><option value="none">none</option></select>
													</td>
													<td>
														<div class="switch"><label><input type="checkbox" checked><span class="lever"></span></label></div>
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

				comments.forEach(function(c) {
					$('.comment-select').append(`<option value="${c.id}">${c.id}</option>`);
				});
				promotions.forEach(function(p) {
					$('.promo-select').append(`<option value="${p.id}">${p.id}</option>`);
				});
				$('.comment-select').material_select();
				$('.promo-select').material_select();
				$(`.btnSave-tag`).bind("click", Save_tag);	
				$(`.btnDelete-tag`).bind("click", Delete_tag);
			});
		});
	}
};

function Add_comment(){
	if(is_comment_editing() >= 0) {
		return
	} else {
		comment_editing = 0;

		$(".tblData-comment tbody").prepend( 
			`<tr id="0"> 
			<td><input class="validate" type="text"></td>
			<td></td>
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

		$(".tblData-promo tbody").prepend( 
			`<tr id="0"> 
			<td><input class="validate" type="text"></td>
			<td></td>
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
	var tdStatus = par.children("td:nth-child(5)");
	var tdButtons = par.children("td:nth-child(6)");

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
			      		for_retweet: tdRetweet.children("input[type=checkbox]").is(":checked"),
			      		comment_id: `${tdComment.children("div").children("input[type=text]").prop("value")}`,
			      		promotion_id: `${tdPromo.children("div").children("input[type=text]").prop("value")}`,
			      		actived: tdStatus.children("div").children("label").children("input[type=checkbox]").is(":checked")
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/tags/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		name: tdTag.children("input[type=text]").val(),
			      		for_retweet: tdRetweet.children("input[type=checkbox]").is(":checked"),
			      		comment_id: tdComment.children("div").children("input[type=text]").prop("value"),
			      		promotion_id: tdPromo.children("div").children("input[type=text]").prop("value"),
			      		actived: tdStatus.children("div").children("label").children("input[type=checkbox]").is(":checked")
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTag.html(`<input type="text" value="${response.name}" readonly>`);
			tdRetweet.children("input").attr('id', `${response.id}-retweet-box`);
			tdRetweet.children("label").attr('for',`${response.id}-retweet-box`);
			tdRetweet.children("input").prop('disabled', true);
			
			tdComment.empty();

			if(response.comment) {
				tdComment.append(`<select class="${response.comment.id}-comment-select"></select>`);
				tdComment.children("select").append(`<option value="${response.comment.id}">${response.comment.id}</option>`);
			} else {
				tdComment.append(`<select class="none-comment-select"></select>`);
				tdComment.children("select").append(`<option value="none">none</option>`);
			}
	
			tdComment.children("select").material_select();

			tdComment.children("div").children("input[type=text]").prop('disabled', true);

			tdPromo.empty();

			if(response.promotion) {
				tdPromo.append(`<select class="${response.promotion.id}-promo-select"></select>`);
				tdPromo.children("select").append(`<option value="${response.promotion.id}">${response.promotion.id}</option>`);
			} else {
				tdPromo.append(`<select class="none-promo-select"></select>`);
				tdPromo.children("select").append(`<option value="none">none</option>`);
			}
	
			tdPromo.children("select").material_select();

			tdPromo.children("div").children("input[type=text]").prop('disabled', true);
		
			tdStatus.children("div").children("label").children("input[type=checkbox]").prop('disabled', true);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${response.id}-btnEdit-tag" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${response.id}-btnDelete-tag" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			tdButtons.children(`.${response.id}-btnEdit-tag`).bind("click", Edit_tag); 
			tdButtons.children(`.${response.id}-btnDelete-tag`).bind("click", Delete_tag);
			tag_editing = -1;
		});
	}
};

function Save_comment(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTemplate = par.children("td:nth-child(1)");
	var tdId = par.children("td:nth-child(2)");
	var tdButtons = par.children("td:nth-child(3)");

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
			tdTemplate.html(`<input type="text" value="${response.template}" readonly>`);
			tdId.html(`${response.id}`);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${id}-btnEdit-comment" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-comment" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			tdButtons.children(`.${id}-btnEdit-comment`).bind("click", Edit_comment); 
			tdButtons.children(`.${id}-btnDelete-comment`).bind("click", Delete_comment);
			comment_editing = -1;
		});
	}
};

function Save_promo(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTemplate = par.children("td:nth-child(1)");
	var tdId = par.children("td:nth-child(2)");
	var tdButtons = par.children("td:nth-child(3)");

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
			tdTemplate.html(`<input type="text" value="${tdTemplate.children("input[type=text]").val()}" readonly>`);
			tdId.html(`${response.id}`);
			tdButtons.html(
				`<button class="blue btn-floating waves-effect waves-light ${id}-btnEdit-promo" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-promo" name="action">
					<i class="material-icons">delete</i>
				</button>`
				);
			tdButtons.children(`.${id}-btnEdit-promo`).bind("click", Edit_promo); 
			tdButtons.children(`.${id}-btnDelete-promo`).bind("click", Delete_promo);
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
		var tdStatus = par.children("td:nth-child(5)");
		var tdButtons = par.children("td:nth-child(6)");

		var comments_request = $.ajax({
		  	url: `/api/comments`,
		      	type: 'GET'
		});

		comments_request.done(function(comments) {
			var promotions_request = $.ajax({
			  	url: `/api/promotions`,
			      	type: 'GET'
			});

			promotions_request.done(function(promotions) {
				tdTag.html(`<input type="text" id="txtTag" value="${tdTag.children("input[type=text]").val()}">`);
				tdRetweet.children("input").prop('disabled', false);

				var current_comment_id = tdComment.children("div").children("select").children("option").prop("value");

				tdComment.empty();

				tdComment.append(`<select class="comment-select"></select>`);

				comments.forEach(function(c) {
					if(c.id != current_comment_id) {
						tdComment.children("select").append(`<option value="${c.id}">${c.id}</option>`);
					} else {
						tdComment.children("select").prepend(`<option value="${c.id}">${c.id}</option>`);
					}
				});

				if(current_comment_id == "none") {
					tdComment.children("select").prepend(`<option value="none">none</option>`);
				} else {
					tdComment.children("select").append(`<option value="none">none</option>`);
				}

				tdComment.children("select").material_select();

				var current_promo_id = tdPromo.children("div").children("select").children("option").prop("value");

				tdPromo.empty();

				tdPromo.append(`<select class="promo-select"></select>`);

				promotions.forEach(function(p) {
					if(p.id != current_promo_id) {
						tdPromo.children("select").append(`<option value="${p.id}">${p.id}</option>`);
					} else {
						tdPromo.children("select").prepend(`<option value="${p.id}">${p.id}</option>`);
					}
				});

				if(current_promo_id == "none") {
					tdPromo.children("select").prepend(`<option value="none">none</option>`);
				} else {
					tdPromo.children("select").append(`<option value="none">none</option>`);
				}

				tdPromo.children("select").material_select();

				tdStatus.children("div").children("label").children("input[type=checkbox]").prop('disabled', false);
				tdButtons.html(
					`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-tag" name="action">
						<i class="material-icons">done_all</i>
					</button>
					<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-tag" name="action">
						<i class="material-icons">delete</i>
					</button>
					`
					); 
				tdButtons.children(`.${id}-btnSave-tag`).bind("click", Save_tag);
				tdButtons.children(`.${id}-btnDelete-tag`).bind("click", Delete_tag);
			});
		});
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
		var tdId = par.children("td:nth-child(2)");
		var tdButtons = par.children("td:nth-child(3)");
		tdTemplate.html(`<input type="text" value="${tdTemplate.children("input[type=text]").val()}">`);
		tdButtons.html(
			`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-comment" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-comment" name="action">
				<i class="material-icons">delete</i>
			</button>
			`
			); 
		tdButtons.children(`.${id}-btnSave-comment`).bind("click", Save_comment);
		tdButtons.children(`.${id}-btnDelete-comment`).bind("click", Delete_comment);
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
		var tdId = par.children("td:nth-child(2)");
		var tdButtons = par.children("td:nth-child(3)");
		tdTemplate.html(`<input type="text" value="${tdTemplate.children("input[type=text]").val()}">`);
		tdButtons.html(
			`<button class="blue btn-floating waves-effect waves-light ${id}-btnSave-promo" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="blue btn-floating waves-effect waves-light ${id}-btnDelete-promo" name="action">
				<i class="material-icons">delete</i>
			</button>
			`
			); 
		tdButtons.children(`.${id}-btnSave-promo`).bind("click", Save_promo);
		tdButtons.children(`.${id}-btnDelete-promo`).bind("click", Delete_promo);
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



