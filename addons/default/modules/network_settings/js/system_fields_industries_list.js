
	$(function(){
		


		/*******************************************************************************
		********************************************************************************
		****************  CONTROLLING INDUSTRY TYPES MULTI-SELECT LIST *****************
		**********************  created by Lajos Deli ToucanTech   *********************
		*******************************************************************************/
		
		
		if ($(".multilevel-multiselect-group")) {

			$(document).click(function(event) 
			{ 
				//Just if the div.multilevel-multiselect-group is in the DOM (can be loaded into the DOM later)
				if ($(".multilevel-multiselect-group")[0]) 
				{	
					//to avoid firing events multiple times
					event.stopPropagation();
					
					//close industries_list div if click event happened outside of the div
					if( ! $(event.target).closest('.multilevel-multiselect-group').length) {
						var $container = $('div.multilevel-multiselect-group');
						var $list_container =  $container.find('ul.multilevel-container');							
						if($list_container.is(":visible")) {
							($container.attr('class').indexOf('open') == -1) ? $container.addClass('open') : $container.removeClass('open');
						}
					}  
				}
			});
		
			$(".multilevel-multiselect-group")
				.find('li, button, span')
				.live('keyup click', function(event)
				{
					//Just if the div.multilevel-multiselect-group is in the DOM (can be loaded into the DOM later)
					if ($(".multilevel-multiselect-group")[0]) 
					{	
						//to avoid firing events multiple times
						event.stopPropagation();
						event.preventDefault();

						//Set some variables
						var $this = $(this);
						var $container =  $this.closest('div.multilevel-multiselect-group');
						var $list_container = $container.find('ul.multilevel-container');

						//Set some closure functions
						var _OpenMainList = function(to_open) {
											(to_open) ? $container.addClass('open') : $container.removeClass('open');
									   };
						var _OpenSubList = function(el, to_open) {
												var children = $list_container.find('li[data-parent_id="' + el.data('id') + '"]');
												if (to_open) {				
													el.addClass('open');
													children.css('display', 'list-item');	
												}
												else {
													el.removeClass('open');
													children.css('display', 'none');	
												}
										   };
						var _SetSelected = function(el) {
												//Set li element css class
												(el.attr('class').indexOf('selected') == -1) 
														? el.addClass('selected')
														: el.removeClass('selected');
												
												//Set number of selected secondary class
												var id = el.data('id');
												var parent_id = el.data('parent_id');
												var el_parent = $list_container.find('[data-id="' + parent_id + '"]');
												if (parent_id == 0) {
													(el.attr('class').indexOf('seperatly-selected') == -1) 
														? el.addClass('seperatly-selected') 
														: el.removeClass('seperatly-selected');
												}
												else {
													var selected_count = $list_container.find('.selected[data-parent_id="' + parent_id + '"]').length;
													if (selected_count > 0) {
														selected_text = '(' + selected_count + ')';
														if (el_parent.attr('class').indexOf('selected') == -1) el_parent.addClass('selected');			
													}
													else {
														selected_text = '';
														if (el_parent.attr('class').indexOf('selected') > -1 && el_parent.attr('class').indexOf('seperatly-selected') == -1) el_parent.removeClass('selected');
													}
													el_parent.find('span.sub_selected').html(selected_text);
												}
												
												//Set list hidden field value - value will be the selected li elements' ids - That only field will be just posted
												var all_selected_ids = '';
												var all_selected_text = '';
												var all_selected = 0;
												var separator = ''; 
												$list_container.find('li.selected').each(function() {
													all_selected_ids += separator + $(this).data('id');
													all_selected_text += separator + $(this).data('value');
													separator = ', '; 
													all_selected++;
												});
												$container.find('input.selected_ids').val(all_selected_ids);
												
												//Set selected values text
												var html = (all_selected > parseInt($container.find('input.max_display_selected').val())) 
																? all_selected + " selected"
																: ((all_selected == 0) ? $container.find('input.default_button_text').val() : all_selected_text);
												$container.find('span.selected_values').html(html);
										   };
	

						//Here comes the "controller" part					
						//if a keyup event happened and was pressed ESC
						if (event.type == 'keyup' && event.keyCode == 27) _OpenMainList(false); 
						
						//if a click event happened on a button - this button is that where selected are displayed
						else if ($this[0].type == "button" || $this.parent()[0].type == "button" || $this.parent().parent()[0].type == "button") _OpenMainList(($container.attr('class').indexOf('open') == -1) ? true : false);
						
						//if a click event happened on a menu arrow				
						else if ($this.is("span") && $this.parent().is("div") || ($this.is("span") && $this.parent().parent().is("li"))) {
							if ($this.attr('class') == 'glyphicon glyphicon-triangle-bottom menu') _OpenSubList( $this.parent().parent(), true);
							else if ($this.attr('class') == 'glyphicon glyphicon-triangle-top menu') _OpenSubList( $this.parent().parent(), false);
						}		
						
						//if a click event on a li element
						else if ($this.is("li") || $this.parent().is("li")) _SetSelected($( $this).closest('li'));


					}//END if ($(".multilevel-multiselect-group")[0]) 
				}//END click function
			)//END .live
		}//END if ($("ul.multiselect-container"))
		

		
		/**********************************
		*	     END INDUSTRY TYPES       *
		***********************************/	
		
	});