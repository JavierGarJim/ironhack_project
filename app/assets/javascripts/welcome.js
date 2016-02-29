// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal-trigger').leanModal();

	$('.sign-up-button').bind("click", function(){
		if($('.sign-up-input').val() == "") {
			return;
		} else {
			console.log("Here");
		}
	});

});