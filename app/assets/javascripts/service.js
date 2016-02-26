// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

console.log("Starting Service...");

(function poll(){
	$.ajax({ url: "/service/update", success: function(data){
    	console.log("Poll");
    	

    	//Setup the next poll recursively
    	setTimeout(function(){
    		poll();
    	}, 60000);
  	}, dataType: "json"});
})();

function Update_tags() {
	var request = $.ajax({
	  	url: `/api/tags`,
	      	type: 'GET'
	});

	request.done(function(response) {
		response.forEach(function(t) {
			var tr = `
				<tr id=${t.id}> 
					<td>${t.name}</td>`;
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
							<button class="btn-floating waves-effect waves-light ${t.id}-btnEdit-tag" name="action">
								<i class="mdi-editor-mode-edit"></i>
							</button>
							<button class="btn-floating waves-effect waves-light ${t.id}-btnDelete-tag" name="action">
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

function Add_tag(){
	$(".btnAdd-tag").off();

	$(".tblData-search tbody").append( 
		`<tr> 
		<td><input class="validate" type="text"></td>
		<td>
			<input type="checkbox" id="comment-box"><label for="comment-box"></label>
		</td>
		<td>
			<input type="checkbox" id="promo-box"><label for="promo-box"></label>
		</td>
		<td>
			<button class="btn-floating waves-effect waves-light btnSave-tag" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="btn-floating waves-effect waves-light btnDelete-tag" name="action">
				<i class="material-icons">delete</i>
			</button>
		</td>
		</tr>`
		); 
	$(`.btnSave-tag`).bind("click", Save_tag);	
	$(`.btnDelete-tag`).bind("click", Delete_tag); 
};

function Add_comment(){
	$(".tblData-comment tbody").append( 
		`<tr> 
		<td>
			<input class="validate" type="text">
		</td>
		<td>
			<button class="btn-floating waves-effect waves-light btnSave-comment" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="btn-floating waves-effect waves-light btnDelete-comment" name="action">
				<i class="material-icons">delete</i>
			</button>
		</td>
		</tr>`
		); 
	$(".btnSave-comment").bind("click", Save_comment);	
	$(".btnDelete-comment").bind("click", Delete_comment); 
};

function Add_promo(){
	$(".tblData-promo tbody").append( 
		`<tr> 
		<td>
			<input class="validate" type="text">
		</td>
		<td>
			<button class="btn-floating waves-effect waves-light btnSave-promo" name="action">
				<i class="material-icons">done_all</i>
			</button>
			<button class="btn-floating waves-effect waves-light btnDelete-promo" name="action">
				<i class="material-icons">delete</i>
			</button>
		</td>
		</tr>`
		); 
	$(".btnSave-promo").bind("click", Save_promo);	
	$(".btnDelete-promo").bind("click", Delete_promo); 
};

function Save_tag(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTag = par.children("td:nth-child(1)"); 
	var tdComment = par.children("td:nth-child(2)"); 
	var tdPromo = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");

	if(tdTag.children("input[type=text]").val() == "") {
		return
	} else {
		var request;

		if(par.prop('id') == "") {
			request = $.ajax({
			  	url: `/api/tags`,
			      	type: 'POST',
			      	data: {
			      		name: tdTag.children("input[type=text]").val(),
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
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTag.html(tdTag.children("input[type=text]").val());
			tdComment.children("input").attr('id',"");
			tdComment.children("label").attr('for',`${response.id}-comment-box`);
			tdPromo.children("input").attr('id',"");
			tdPromo.children("label").attr('for',`${response.id}-promo-box`);
			tdButtons.html(
				`<button class="btn-floating waves-effect waves-light ${id}-btnEdit-tag" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="btn-floating waves-effect waves-light ${id}-btnDelete-tag" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(`.${id}-btnEdit-tag`).bind("click", Edit_tag); 
			$(`.${id}-btnDelete-tag`).bind("click", Delete_tag);
			$(`.btnAdd-tag`).bind("click", Add_tag);
		});
	}
};

function Save_comment(){ 
	var par = $(this).parent().parent(); 
	var tdComment = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	if(tdComment.children("input[type=text]").val() == "") {
		return
	} else {
		var request;

		if(par.prop('id') == "") {
			request = $.ajax({
			  	url: `/api/comments`,
			      	type: 'POST',
			      	data: {
			      		name: tdCommen.children("input[type=text]").val(),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/comments/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		name: tdComment.children("input[type=text]").val(),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdComment.html(tdComment.children("input[type=text]").val());
			tdButtons.html(
				`<button class="btn-floating waves-effect waves-light btnEdit-comment" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="btn-floating waves-effect waves-light btnDelete-comment" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(".btnEdit-comment").bind("click", Edit_comment); 
			$(".btnDelete-comment").bind("click", Delete_comment);
		});
	}
};

function Save_promo(){ 
	var par = $(this).parent().parent(); 
	var tdPromo = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	if(tdPromo.children("input[type=text]").val() == "") {
		return
	} else {
		var request;

		if(par.prop('id') == "") {
			request = $.ajax({
			  	url: `/api/promotions`,
			      	type: 'POST',
			      	data: {
			      		name: tdPromo.children("input[type=text]").val(),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});
		} else {
			request = $.ajax({
			  	url: `/api/promotions/${par.prop('id')}`,
			      	type: 'PUT',
			      	data: {
			      		name: tdPromo.children("input[type=text]").val(),
			      		for_comment: tdComment.children("input[type=checkbox]").is(':checked'),
			      		for_promo: tdPromo.children("input[type=checkbox]").is(':checked')
			      	}
			});			
		}

		request.done(function(response) {
			par.attr('id', response.id);
			tdTag.html(tdPromo.children("input[type=text]").val());
			tdButtons.html(
				`<button class="btn-floating waves-effect waves-light btnEdit-promo" name="action">
					<i class="mdi-editor-mode-edit"></i>
				</button>
				<button class="btn-floating waves-effect waves-light btnDelete-promo" name="action">
					<i class="material-icons">delete</i>
				</button>`
				); 
			$(".btnEdit-promo").bind("click", Edit_promo); 
			$(".btnDelete-promo").bind("click", Delete_promo);
		});
	}
};

function Edit_tag(){ 
	var par = $(this).parent().parent();
	var id = par.prop('id');
	var tdTag = par.children("td:nth-child(1)"); 
	var tdComment = par.children("td:nth-child(2)"); 
	var tdPromo = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");
	tdTag.html("<input type='text' id='txtTag' value='"+tdTag.html()+"'>");
	tdComment.children("input").attr('id',`${par.prop('id')}-comment-box`);
	tdPromo.children("input").attr('id',`${par.prop('id')}-promo-box`);
	tdButtons.html(
		`<button class="btn-floating waves-effect waves-light ${id}-btnSave-tag" name="action">
			<i class="material-icons">done_all</i>
		</button>
		<button class="btn-floating waves-effect waves-light ${id}-btnDelete-tag" name="action">
			<i class="material-icons">delete</i>
		</button>
		`
		); 
	$(`.${id}-btnSave-tag`).bind("click", Save_tag);
	$(`.${id}-btnDelete-tag`).bind("click", Delete_tag); 
};

function Edit_comment(){ 
	var par = $(this).parent().parent(); 
	var tdComment = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");
	tdComment.html("<input type='text' id='txtComment' value='"+tdComment.html()+"'>");
	tdButtons.html(
		`<button class="btn-floating waves-effect waves-light btnSave-comment" name="action">
			<i class="material-icons">done_all</i>
		</button>
		<button class="btn-floating waves-effect waves-light btnDelete-comment" name="action">
			<i class="material-icons">delete</i>
		</button>
		`
		); 
	$(".btnSave-comment").bind("click", Save_comment);
	$(".btnEdit-comment").bind("click", Edit_comment); 
	$(".btnDelete-comment").bind("click", Delete_comment); 
};

function Edit_promo(){ 
	var par = $(this).parent().parent(); 
	var tdPromo = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");
	tdPromo.html("<input type='text' id='txtPromo' value='"+tdPromo.html()+"'>");
	tdButtons.html(
		`<button class="btn-floating waves-effect waves-light btnSave-promo" name="action">
			<i class="material-icons">done_all</i>
		</button>
		<button class="btn-floating waves-effect waves-light btnDelete-promo" name="action">
			<i class="material-icons">delete</i>
		</button>
		`
		); 
	$(".btnSave-promo").bind("click", Save_promo);
	$(".btnEdit-promo").bind("click", Edit_promo); 
	$(".btnDelete-promo").bind("click", Delete_promo); 
};

function Delete_tag(){ 
	var par = $(this).parent().parent(); 

	if(par.prop('id') != "") {
		var request = $.ajax({
		  	url: `/api/tags/${par.prop('id')}`,
		      	type: 'DELETE'
		});

		request.done(function(response) {
			par.remove();
			$(`.btnAdd-tag`).off();
			$(`.btnAdd-tag`).bind("click", Add_tag);
		});		
	} else {
		par.remove();
		$(`.btnAdd-tag`).off();
		$(`.btnAdd-tag`).bind("click", Add_tag);
	}
};

function Delete_comment(){ 
	var par = $(this).parent().parent(); 

	if(par.prop('id') != "") {
		var request = $.ajax({
		  	url: `/api/comments/${par.prop('id')}`,
		      	type: 'DELETE'
		});

		request.done(function(response) {
			par.remove();
		});		
	} else {
		par.remove(); 
	}
};

function Delete_promo(){ 
	var par = $(this).parent().parent(); 

	if(par.prop('id') != "") {
		var request = $.ajax({
		  	url: `/api/promotions/${par.prop('id')}`,
		      	type: 'DELETE'
		});

		request.done(function(response) {
			par.remove();
		});		
	} else {
		par.remove(); 
	}
};

(function(){ //Add, Save, Edit and Delete functions code
	Update_tags();
	// Update_comments();
	// Update_promos();

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



