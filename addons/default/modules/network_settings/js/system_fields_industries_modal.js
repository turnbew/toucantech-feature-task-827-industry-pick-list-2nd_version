
	$(function(){
		
		
		
		/*******************************************************************************
		********************************************************************************
		*	CONTROLLING INDUSTRY TYPES ON PAGE admin-portal/members/custom-questions   *
		**********************  created by Lajos Deli ToucanTech   *********************
		*******************************************************************************/



		//display industry types modal
		if ($("#edit-industry-types")) {
			$("#edit-industry-types").on("click", function() {
				$('#industry-types-modal').modal({
					remote: SITE_URL + 'network_settings/system_fields/ajax_industry_types_dialog'
				});
				$('.popover-dismiss').popover({trigger: 'hover'});
			})	
		}




		//CONTROLLER "APP" OF THE INDUSTRY TYPE MODAL
		if ($(".modal-dialog.industry-types")) {
			var industry_type_timer;
			$(".modal-dialog.industry-types")
				.find("button, input[type='text'], select#industries_primary")
				.live("click keyup change", function(e) 
				{	
					//to avoid firing events multiple times
					e.stopPropagation();
					e.preventDefault();
					
					//set variables
					var modal = $(".modal-dialog.industry-types");
					var el_messages = $('#industry_types_messages');
					var el_select = $('#industries_primary');
					var parent_id = parseInt(el_select.val());
					var ajax_base_url = 'network_settings/system_fields/ajax_industry_types_';
					var types = parseInt($('#added_industry_types').val());
					var time_animate = 700;
					var time_delay = 5000;

					
					
					//defining some closure functions (these functions are used min 2 times on this controll part)
					var _SetInputFieldsCount = function(count) {
							$('#added_industry_types').val(types + count);
						};
					var _SetDisplay_NoAddedTr = function(display) {
							$('.table-theres-no-added-type').css('display', display);	
						};
					var _AnimateAddedTypesContainer = function(speed) {
							$("#added-types-container").animate({ scrollTop: 0 }, speed);
						};
					var _SetMessage = function(message, alert_type, set_timeout) {
							if (set_timeout != undefined) {} else set_timeout = true;
							clearTimeout(industry_type_timer);
							el_messages
								.css('display', 'none')
								.removeClass('alert-warning')
								.removeClass('alert-success')
								.removeClass('alert-danger')
								.addClass('alert-' + alert_type)
								.html(message)
								.show(time_animate, function(){
										if (set_timeout) industry_type_timer = setTimeout(_HideMessage, time_delay);
										_SetButtonsAndInputs(false);
									});
						};
					var _HideMessage = function() {
							clearTimeout(industry_type_timer);
							el_messages
								.html('')
								.hide(time_animate);
						};
					var _SetButtonsAndInputs = function(disable) {
							var el_inputs = modal.find('input[class="form-control industry_type"]'); 
							var el_buttons = modal.find("button");
							if (disable) { 
								el_buttons.addClass('disabled');
								el_inputs.css('background-color', '#eee');
								$('#industries_primary').attr("disabled", "disabled");
								el_inputs.blur();
							} 
							else {
								el_buttons.removeClass('disabled');
								el_inputs.css('background-color', '#fff');
								$('#industries_primary').removeAttr("disabled");
							}
							el_inputs.prop("disabled", disable);
							$('#add_new_secondary_type').prop("disabled", ((parent_id > 0) ? false : true));
						};
					var _CountUnsaved = function () {
							unsaved = 0;
							modal.find('input[class="form-control industry_type"]').each(function(){
								var el_input = $(this);
								if (el_input.prop('name').length > 11 && $.trim(el_input.val()) != '') unsaved++;
							});
							return unsaved;
						}
					var _GetSecondaryTypes = function() {
							AJAX.call(ajax_base_url + 'get_secondary_types', {'parent_id' : parent_id}, function (response) {			
								if (response !== false) {
									modal.find(".table-condensed.added-types").html(response);
									msg = $('#msg_success_change_default').val();
									msg_type = 'success';
								}
								else {
									msg = $('#msg_error_action').val();
									msg_type = 'danger';
								}
								_SetMessage(msg, msg_type);
								_SetButtonsAndInputs(false);
							});							
						};
					var _CollectData = function() {
							var data = "";
							modal.find('input[class="form-control industry_type"]').each(function(){
								var el_input = $(this);
								data += ((data == "") ? "" : "&") +  el_input.prop('name') + "=" + el_input.val();
							});
							return data;
						};
					var _GetSpecKeycodes = function () {
							//32 - space, 13 - enter, 9 - tab, 27 - esc, 
							//16 - shift, 17 - control, 18 - alt, 20 - capslock, 144 - numlock
							//45 - insert, 36 - home, 25 - end, 33 - pageup, 
							//34 - pagedwown, 37 - 40 - arrows, 
							return [32, 13, 9, 27, 16, 17, 18, 20, 144, 45, 36, 25, 33, 34, 37, 38, 39, 40];
						}
					var _RefreshNumberOfChildren = function() {
							secondary_types = modal.find('input[class="form-control industry_type"]').length;
							var el_option = $('#industries_primary').find('option[value="' + parent_id + '"]');
							var new_text = el_option.text().replace(/\((.+?)\)/, '(' + secondary_types + ')');
							el_option.text(new_text);
						}

						
						
						
					//defining some functions to make readable the code, mainly the last, controller part. (these are not necessary)
					var _Action_CheckValueExist = function(el_input) {
							AJAX.call(ajax_base_url + 'value_exists', {'option' : el_input.val(), 'option_id' : el_input.prop('name'), 'parent_id' : parent_id}, function (response) 
							{				
								if (response != false) {
									_SetMessage(response, 'warning', false);
									el_input.css('background-color', '#fcf8e3');
								}
								else {
									el_input.css('background-color', '#fff');
									_HideMessage();
								}
							});
						};
					var _Action_ThereAreNotSaved = function(el_input) {
							$.confirm({
								text: $('#msg_are_you_sure_in_change').val(),
								confirm: function() {
											if (parent_id > 0) _GetSecondaryTypes();
											else  {
												_SetDisplay_NoAddedTr("display");
												_SetButtonsAndInputs(false);
											}
										},
								cancel: function() {
											_SetButtonsAndInputs(false);
										}
							})
						};
					var _Action_AddSecondaryType = function() {
							AJAX.call(ajax_base_url + 'add', {}, function (response) 
							{	
								modal.find(".table-condensed.added-types").prepend(response);
								_SetDisplay_NoAddedTr('none');
								_SetInputFieldsCount(1);
								_SetMessage($('#msg_success_add').val(), 'success');
								_AnimateAddedTypesContainer("slow");
							});
						};
					var _Action_SaveSecondaryType = function() {
							if (parent_id > 0)
							{
								//save data
								AJAX.call(ajax_base_url + 'save', {'parent_id' : parent_id, 'data' : _CollectData()}, function (response) 
								{
									if (response != false)  {
										//set ids at the newly created input field
										new_ids = JSON.parse(response);
										$.each(new_ids, function(old_id, new_id){
											modal.find('input[name="' + old_id + '"]').prop('name', new_id);
										});
										
										//Refresh number of children in select list
										_RefreshNumberOfChildren();
										
										//Set message
										msg = $('#msg_success_save').val();
										msg_type = 'success';
									}
									else {
										msg = $('#msg_error_action').val();
										msg_type = 'danger';
									}		
									_SetMessage(msg, msg_type);
								});
							}
							else {
								_SetMessage($('#msg_select_first').val(), 'danger');
							}
						};
					var _Action_DeleteSecondaryType = function(el_button, el_input) {
							if  ($.trim(el_input.val()) != '')
							{
								$.confirm({
									text: $('#msg_confirm_delete').val(),
									confirm: function() {
												AJAX.call(ajax_base_url + 'delete', {'option_id' : el_input.prop('name')}, function (response) 
												{	
													if (response != false) {
														if (types == 1) { 
															_SetDisplay_NoAddedTr('table-row');
														}
														_SetInputFieldsCount(-1);															
														msg_type = 'success';
														msg = response;
														el_button.parent().parent().remove();
													}
													else {
														msg = $('#msg_error_action').val();
														msg_type = 'danger';
													}
													_RefreshNumberOfChildren();
													_SetMessage(msg, msg_type);
												});
											},
									cancel: function() {
												_SetButtonsAndInputs(false);
											}
								});
							}
							else 
							{
								el_button.parent().parent().remove();
								_SetButtonsAndInputs(false);
							}
						};

						
					//HERE COMES THE CONTROLLER PART OF EVENTS	
					//routing actions depend on event type and element target
					//if a keyup  event happened on an input field
					if (e.type == 'keyup' && e.target.localName == 'input') {
						if (jQuery.inArray(e.keyCode, _GetSpecKeycodes()) == -1 && parent_id > 0) _Action_CheckValueExist($(this));
					}
					
					
					//if a change event happened on industries_primary select field
					else if (e.type == 'change' && e.target.name == 'industries_primary')  {
						_SetButtonsAndInputs(true);							
						(_CountUnsaved() > 0) 
								? _Action_ThereAreNotSaved() 
								: _GetSecondaryTypes();
					}
					
					
					//if a click event happened on a button
					else if (e.type == 'click' && e.target.localName == 'button') {
						var btn_action = $(this).prop('name');
						_HideMessage();
						_SetButtonsAndInputs(true);
						switch (btn_action) {
							case "add" : _Action_AddSecondaryType(); 	break;																		
							case "save" : _Action_SaveSecondaryType(); break;
							case "delete" : _Action_DeleteSecondaryType($(this), $(this).parent().parent().find('input')); break;			
						}							
					}//END controll part

				}); //END $(".modal-dialog.industry-types").find("button, input[type='text']")
		}//END if ($(".modal-dialog.industry-types"))


		/**********************************
		*	     END INDUSTRY TYPES       *
		***********************************/	
		
	});