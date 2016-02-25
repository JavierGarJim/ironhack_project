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

function Add_tag(){
	$(".tblData-search tbody").append( 
		`<tr> 
		<td>
			<input class="validate" type="text">
		</td>
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
	$(".btnSave-tag").bind("click", Save_tag);	
	$(".btnDelete-tag").bind("click", Delete_tag); 
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
	var tdTag = par.children("td:nth-child(1)"); 
	var tdComment = par.children("td:nth-child(2)"); 
	var tdPromo = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");

	console.log(tdTag.children("input[type=text]"));

	if(tdTag.children("input[type=text]").val() == "")
		return

	tdTag.html(tdTag.children("input[type=text]").val()); 
	tdComment.children("input").attr('id',"");
	tdPromo.children("input").attr('id',"");
	tdButtons.html(
		`<button class="btn-floating waves-effect waves-light btnEdit-tag" name="action">
			<i class="mdi-editor-mode-edit"></i>
		</button>
		<button class="btn-floating waves-effect waves-light btnDelete-tag" name="action">
			<i class="material-icons">delete</i>
		</button>`
		); 
	$(".btnEdit-tag").bind("click", Edit_tag); 
	$(".btnDelete-tag").bind("click", Delete_tag); 
};

function Save_comment(){ 
	var par = $(this).parent().parent(); 
	var tdComment = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	console.log(tdComment.children("input[type=text]"));

	if(tdComment.children("input[type=text]").val() == "")
		return

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
};

function Save_promo(){ 
	var par = $(this).parent().parent(); 
	var tdPromo = par.children("td:nth-child(1)");
	var tdButtons = par.children("td:nth-child(2)");

	console.log(tdPromo.children("input[type=text]"));

	if(tdPromo.children("input[type=text]").val() == "")
		return

	tdPromo.html(tdPromo.children("input[type=text]").val());
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
};

function Edit_tag(){ 
	var par = $(this).parent().parent(); 
	var tdTag = par.children("td:nth-child(1)"); 
	var tdComment = par.children("td:nth-child(2)"); 
	var tdPromo = par.children("td:nth-child(3)");
	var tdButtons = par.children("td:nth-child(4)");
	tdTag.html("<input type='text' id='txtTag' value='"+tdTag.html()+"'>");
	tdComment.children("input").attr('id',"comment-box");
	tdPromo.children("input").attr('id',"promo-box");
	tdButtons.html(
		`<button class="btn-floating waves-effect waves-light btnSave-tag" name="action">
			<i class="material-icons">done_all</i>
		</button>
		<button class="btn-floating waves-effect waves-light btnDelete-tag" name="action">
			<i class="material-icons">delete</i>
		</button>
		`
		); 
	$(".btnSave-tag").bind("click", Save_tag);
	$(".btnEdit-tag").bind("click", Edit_tag); 
	$(".btnDelete-tag").bind("click", Delete_tag); 
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
	var par = $(this).parent().parent(); par.remove(); 
};

function Delete_comment(){ 
	var par = $(this).parent().parent(); par.remove(); 
};

function Delete_promo(){ 
	var par = $(this).parent().parent(); par.remove(); 
};

(function(){ //Add, Save, Edit and Delete functions code 
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
