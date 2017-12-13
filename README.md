TASK DATE: 07.12.2017 - 13.12.2017  

TASK LEVEL: ADVANCED - HARD

NOTE: I made some extra things with this task

		- calling controller into another controller without multiple inharitance and extends
		- new AJAX call system
		- new function in CodeIgniter Query builder - value_exists
		- Cutting the language files, and create an undependent controller
		- Creating new fiel-type - multi-categories select list
		- similar to AngularJS "APP" jquery controller part

TASK SHORT DESCRIPTION: 827 Careers & mentoring P1 (insustry pick list and content tags) 2nd version

GITHUB REPOSITORY CODE: feature/task-827-industry-pick-list-2nd_version

ORIGINAL WORK: https://github.com/BusinessBecause/network-site/tree/feature/task-827-industry-pick-list-2nd_version

CHANGES

	IN FILES: 
	
		\network-site\addons\default\modules\bbusers\controllers\profile.php
		
			ADDED CODE: 
			
				//Inside function view
				
					....
					$this->load->controller('system_fields', 'network_settings');
					....
					//experiences value converting to HTML snippet
					$profile['experiences_hierarchial'] = $this->system_fields->industries_hierarchical_list($profile['experience']);
					....
					->append_css('module::/../../network_settings/css/system_fields_industries_multilevel_list.css')
					->append_js('module::/../../network_settings/js/system_fields_industries_multilevel_list.js')
		
		
			ADDED NEW FUNCTIONS: 
			
				public function edit_experience($uid)
				{
					if( ! $this->input->is_ajax_request())  
					{
						show_404();
					}
					else 
					{	
						$this->users->may_edit($uid) or show_404();
						$this->load->controller('system_fields', 'network_settings');
						 
						$experience = $this->profile_m->get_profile_field_value($uid, 'experience');
						
						$data = array(
							'submit_to' => array('save_experience', $uid),
							'industries' => $this->system_fields_m->get_industry_types_for_list(),
							'industries_selected' => $this->system_fields_m->get_industry_ids_from_value($experience),
						);		
						
						$this->template
							->enable_parser(false)
							->set_layout('')
							->build('profile/edit/experience.php', $data);
					}
						
				}//END function edit_experience

				
				
				
				public function save_experience($uid)
				{
					if( ! $this->input->is_ajax_request())  
					{
						show_404();
					}
					else 
					{	
						$this->users->may_edit($uid) or show_404();
						$this->load->controller('system_fields', 'network_settings');
						
						$experiences = $this->system_fields_m->get_industry_db_value_from_ids($this->input->post('industries'));		
						$db_result = $this->profile_m->update($uid, array('experience' => $experiences));

						if($db_result) {
							$profile = (array)$this->ion_auth->get_user($uid) or show_404(); 
							$profile['experiences_hierarchial'] = $this->system_fields->industries_hierarchical_list($profile['experience']);
							
							return $this->view($uid, 'experience');
						} 
						else {
							$response = array(
									'status' => 'error',
									'messages' => $this->form_validation->error_array(),
							);
							$this->template->build_json($response);
						}			
					}
				}//END function save_experience					
	
	
		\network-site\addons\default\modules\bbusers\models\profile_m.php
	
			ADDED NEW FUNCTION: 
			
				/*
				 * get field value from profiles table
				 * @input
				 *		- $id: int - id of user
				 *		- $field: string - name of table coloumn/field
				 *		- $additional_where: string - can be empty, extra where part
				 * @return
				 *		- value: mix - value of field or empty string
				 */
				public function get_profile_field_value($id, $field, $additional_where = '') 
				{
					$hit = ($additional_where != '')
								? $this->db->select($field)
										->where('id', $id)
										->where($additional_where)
										->get($this->_table)
										->result_array()
								: $this->db->select($field)
										->where('id', $id)
										->get($this->_table)
										->result_array();
					
					return ( ! empty($hit)) ? $hit[0][$field] : '';
				}//End function get_profile_field_value
	
	
		\network-site\addons\default\modules\bbusers\js\profile.js
	
			ADDED CODE: 
			
				//inside function enableProfileEdits
				
				part == 'experience'
	
	
		\network-site\addons\default\modules\bbusers\config\routes.php
			
			ADDED CODE: 
			
				//inside $profile_actions = array(
				
					'edit_experience' .... 'save_experience'
	
	
		\network-site\addons\default\modules\bbusers\views\profile\view.php
		
			CHANGED CODE: 
			
				FROM: 
				
					<ul>
						<? if ($profile['experience']):?>
							<? foreach(explode("\n", $profile['experience']) as $i): ?>
								<li><?=$i ?></li>
							<? endforeach; ?>
						<? else: ?>
							<li>What experience do you have?</li>
						<? endif; ?>
					</ul> 
				
				TO: 
				
					<?=$profile['experiences_hierarchial']?>
				
	
	
		ADDED THIRD PARTY FILES: 
	
			- bootstrap.multiselect.css, bootstrap.multiselect.js ... network-site\assets\bootstrap-multiselect\ folder
				
			
	
		\network-site\system\cms\config\asset.php
		
			ADDED CODE: 
			
				.....
				'bootstrap.multiselect' => array(
					'files' => array(
						'bootstrap-multiselect/bootstrap.multiselect.js',
					),
					'min' => false,
					'enabled' => false,
				),
				.....
				'bootstrap.multiselect' => array(
					'files' => array(
						'bootstrap-multiselect/bootstrap.multiselect.css',
					),
					'min' => false,
					'enabled' => false,
				),
				
				
	
		\network-site\system\cms\core\Public_Controller.php
		
			ADDED CODE: 
			
				...
				static $already_extended; //declaration
				....
				//inside __construct function
				if (self::$already_extended !== true) //Important when you call controller in another controller to prevent multiple call
				{
				....
					self::$already_extended = true;
				}
	

		\network-site\addons\default\modules\network_settings\views\members\custom_questions.php
		
			CHANGED CODE:
			
				FROM: Add Question TO: <?=lang('system_fields:button:add_field')?>
				
	
		\network-site\addons\default\modules\network_settings\views\members\tables\custom-questions-table.php
		
			CHANGED CODE:
			
				FROM: Your Questions TO: <?=lang('system_fields:label:your_fields')?>
				
				
		
		\network-site\addons\default\modules\network_settings\controllers\members.php
		
			ADDED CODE: //Inside function custom_questions
			
				....
				$this->load->controller('system_fields');
				....
				$this->data['system_fields'] = $this->system_fields_m->get_questions_by_slugs();
				....
				->append_js('module::system_fields_industries_modal.js')
				....
				->append_css('module::system_fields_industries_modal.css')
	
			ADDED CODE: //Inside function edit
			
				....
				$this->load->controller('system_fields');
				....
				$profile_data['experience'] = $this->system_fields_m->get_industry_db_value_from_ids($this->input->post('industries'));
				$profile_data['experience_offline'] = $this->system_fields_m->get_industry_db_value_from_ids($this->input->post('industries_offline'));
				....
				$industry_types = $this->system_fields_m->get_industry_types_for_list();
				$industries_selected = $this->system_fields_m->get_industry_ids_from_value($values['experience']);
				$industries_offline_selected = $this->system_fields_m->get_industry_ids_from_value($values['experience_offline']);
				....
				->set('industry_types', $industry_types)
				->set('industries_selected', $industries_selected)
				->set('industries_offline_selected', $industries_offline_selected)
				 
		
		\network-site\addons\default\modules\network_settings\views\members\custom_questions.php
				
			CHANGED CODE: 
			
				FROM:	Customisable Questions TO: <?=lang('system_fields:label:customisable_fields')?>
				FROM: 	Click on the cog to edit the question options. TO:
				
			ADDED CODE: 
			
				<!-- Industry types Modal -->
				<div class="modal fade" id="industry-types-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>
		
	
		\network-site\system\codeigniter\core\Loader.php 
		
			ADDED CODE: //part of loading controller into another controller
			
				protected $_ci_controllers =	array();
				/**
				 * List of loaded controllers
				 *
				 * @var array
				 */
				 
				 
		\network-site\system\cms\libraries\MX\Loader.php		 
		
			ADDED CODE: //a new function to load controller into another controller
			
						/*
						 * Load controller (from addons/default/modules or addons/shared_addons/modules) into another controller
						 *
						 * @input 
						 *		- $controller: string : name of the controller without extension_loaded / or array with  class_names without extensions
						 *		- $module: string : default = '', name of the addons or shared addons module 
						 *
						 * @output
						 *		VOID
						*/
						public function controller($controller, $module = '', $sub_folder = '')
						{
							if (in_array($controller, $this->_ci_controllers, true)) return CI::$APP->$controller;
							
							if ($module == '') $module = $this->_module;
							
							//Check controller exists in module
							foreach (array(ADDON_FOLDER . 'default/modules/', SHARED_ADDONPATH . 'modules/') as $path)
							{
								$path = $path . $module . '/controllers/';

								if (file_exists($path . $controller . '.php'))
								{
									if (class_exists($controller) === FALSE)
									{
										Modules::load_file($controller, $path);
										
										$uf_controller = ucfirst($controller);
										
										CI::$APP->$controller = new $uf_controller();
										
										$this->_ci_controllers[] = $controller;
									
										return CI::$APP->$controller;
									}
								}
							}

							return false;
						}//END function &controller
						
	
		\network-site\addons\default\modules\network_settings\views\members\tables\questions.php
		
			CHANGED some static text to lang constant
			
				FROM: System Questions TO: <?=lang('system_fields:label:system_fields')?>
				....
				FROM: Postal label types TO: <?=$system_fields['postal_label_types']?>
				....
			
			ADDED CODE: 
			
				<tr>
					<td class="pull-right">
						<a id="industry-types-edit" class="edit_icon"></a>
					</td>
					<td class="question-label"><?=$system_fields['industry_types']?></td>
				</tr>				
				
	
		\network-site\addons\default\modules\network_settings\views\members\partials\menu.php
		\network-site\addons\default\modules\network_settings\views\members\partials\query_builder.php
	
			CHANGED CODE
				
				FROM: Custom Questions TO: <?=lang('system_fields:label:custom_fields')?>
				
		
		\network-site\addons\default\modules\network_settings\views\content\events_form.php
		
			CHANGED CODE	//some static text
			
				TO:	
					....
					<?=lang('system_fields:label:custom_fields')?>
					....
					<?=lang('system_fields:title:create_custom_field')?>
					....
					<?=lang('system_fields:label:create_custom_field')?>
					....
					
			ADDED CODE: 
			
				<li>
					<label for="industries">Experience</label>
					<div class="input">
						<?=form_dropdown_list('industries_offline', $industry_types, $industries_offline_selected)?>
					</div>
				</li>
				
				
				
		
		\network-site\system\codeigniter\helpers\form_helper.php
		
			ADDED NEW FUNCTION IN IT: 
			
				// --------------------------------------------------------------------

				if ( ! function_exists('form_dropdown_list'))
				{
					/**
					 * Create an ul/ol multiselect/"multilevel" list
					 *
					 * @input
					 *		- $element: string : HTML DOM element's jqeury selector/id/name
					 *		- $list: mixed array : can be empty, otherwise must be a multidimensional array - its structure is:
					 *				array(
					 *					array('value' => :string, 'level' => :int, 'id' => :int, 'class' => :string - css class name, 'extra' => :string - any kind of other settings, can be empty),
					 * 					...
					 *				)
					 *		- $list_selected: mixed array : id's of selected values 
					 *		- $settings: mixed array : can be an empty array, next settings are available
					 *				array(
					 *					multiselect_group_class		: string, default - multilevel-multiselect-group
					 *					multiselect_button_class	: string, default - multilevel btn btn-default
					 *					multiselect_span_class 		: string, default - multilevel-selected-text
					 * 					multiselect_list_class		: string, default - multilevel-container dropdown-menu	
					 *					list_type:					: string, default - ul - can be ol or ul
					 *					max_display_selected		: int, default - 3
					 *					default_button_text			: string, default - 'Select all that apply'
					 *				)			
					 *
					 */
					function form_dropdown_list($element, $list = array(), $list_selected = array(), $settings = array())
					{
						//Init
						$line_break = "\n";
						$multiselect_group_class = isset($settings['multiselect_group_class']) ? $settings['multiselect_group_class'] : 'multilevel-multiselect-group';
						$multiselect_button_class = isset($settings['multiselect_button_class']) ? $settings['multiselect_button_class'] : 'multilevel btn btn-default';
						$multiselect_span_class = isset($settings['multiselect_span_class']) ? $settings['multiselect_span_class'] : 'multilevel-selected-text';
						$multiselect_list_class = isset($settings['multiselect_list_class']) ? $settings['multiselect_list_class'] : 'multilevel-container dropdown-menu';
						$list_type = isset($settings['list_type']) ? $settings['list_type'] : 'ul';
						$max_display_selected = isset($settings['max_display_selected']) ? $settings['max_display_selected'] : 3;
						$default_button_text = isset($settings['default_button_text']) ? $settings['default_button_text'] : 'Select all that apply';
						$theme_colour = Settings::get('theme_colour');
						$icon_ok = '<span class="glyphicon glyphicon-ok"></span>';
						$icon_menu_up = '<span class="glyphicon glyphicon-menu-up"></span>';
						$icon_menu_down = '<span class="glyphicon glyphicon-menu-down"></span>';
						
						//create a ul/ol list container
						$list_pre = '<div name="' . $element . '_list" id="' . $element . '_list" class="' . $multiselect_group_class . '">' . $line_break . 
									'	<button type="button" class="' . $multiselect_button_class . '" title="%selected_values_text">' . $line_break . 
									'		<span class="glyphicon glyphicon-triangle-bottom"></span> ' . $line_break . 
									'		<span class="glyphicon glyphicon-triangle-top"></span> ' . $line_break . 
									'		<span class="selected_values">%selected_values_text</span>' . $line_break . 
									'	</button>' . $line_break . 
									'	<' . $list_type . ' class="' . $multiselect_list_class . '">' . $line_break;    
									
						//create the list
						$list_content = '';
						$selected_values = array();
						$selected_ids = array();
						$selected_counter = 0;
						$orig_list = $list;
						$length = count($list);
						foreach ($list as $key => $params)
						{			
							//set main-menu arrow
							$arrows = ($params['children'] > 0) ? $icon_menu_up . $icon_menu_down : '';
							
							//if the list item is selected
							$sub_selected_text = '';
							if (in_array($params['id'], $list_selected)) {
								$selected_class = 'selected ' . (($params['parent_id'] == 0) ? 'seperatly-selected ' : '');
								$selected_values[] = $params['value'];
								$selected_ids[] = $params['id']; 
								$selected_counter++;
								if ($params['level'] == 1) {
									$sub_selected = 0;
									for ($i = 0; $i < $length; $i++) {
										if ($orig_list[$i]['parent_id'] == $params['id'] and in_array($orig_list[$i]['id'], $list_selected)) $sub_selected++;	
									}
									if ($sub_selected > 0) $sub_selected_text = '(' . $sub_selected . ')';
								}
							}
							else {
								$selected_class = '';
							}
							
							//create an list-item
							$list_content .= '<li class="' . 
														$selected_class . 
														$params['class'] . '" ' . 
												  'data-value="' . $params['value'] . '" ' . 
												  'data-id="' . $params['id'] . '" ' . 
												  'data-parent_id="' . $params['parent_id'] . '" ' . 
												  $params['extra'] . '>' . 
												$arrows . 
												'<span>' . $params['value'] . '</span>' . 
												$icon_ok . 
												'<span class="sub_selected">' . $sub_selected_text . '</span>' . 
											 '</li>' . $line_break;
						}

						//create last part of the generated html
						$list_last = '	</' . $list_type . '>' . $line_break .
									 '	<input type="hidden" class="selected_ids" name="' . $element . '" id="' . $element . '" value="' . implode(',', $selected_ids) . '">' . $line_break . 
									 '	<input type="hidden" class="max_display_selected" id="' . $element . '_max_display_selected" value="' . $max_display_selected . '">' . $line_break . 
									 '	<input type="hidden" class="default_button_text" id="' . $element . '_default_button_text" value="' . $default_button_text . '">' . $line_break . 
									 '</div>' . $line_break;
				 
						//making some corrections on generated html
						$selected_values_text = ($selected_counter > 0) 
														? (($selected_counter > $max_display_selected) ? $selected_counter . ' selected' : implode(', ', $selected_values))
														: $default_button_text;
						$list_pre = str_replace('%selected_values_text', $selected_values_text, $list_pre);
						
						return $list_pre . $list_content . $list_last;
					} //END function form_dropdown_list
				}				
		
				
				
					
	
		\network-site\system\codeigniter\database\DB_query_builder.php
		
			ADDED CODE //a new function
			
				// --------------------------------------------------------------------
			
				/**
				 * Determine if a value exist in table and coloumn
				 *
				 *	Created by Lajos Deli 17.11.2017
				 *	
				 *	@input
				 * 	- $value : string, required, this value will be checked
				 * 	- $field_name: string, rquired, coloumn's name
				 *	- $table_name: string, rquired, db table's name
				 *	- $additional_where: extra sql where part, not required, default: ''
				 *
				 * @return	bool
				 */
				public function value_exists($value, $field_name, $table_name, $additional_where = '')
				{
					if ($value === '' or $table_name === '' or $field_name === '')
					{
						return ($this->db_debug) ? $this->display_error('db_value_field_table_exist') : FALSE;
					}
					
					if ($additional_where == '') {
						$query = $this->select('count(*) as counted')
											->from($table_name)
											->where($field_name, $value)
											->get();
					} 
					else {
						$query = $this->select('count(*) as counted')
											->from($table_name)
											->where($field_name, $value)
											->where($additional_where)
											->get();
					}
					
					$result = $query->row_array();
					
					return ($result['counted'] > 0) ? true : false;
				}
	
	
	
		\network-site\assets\_commons\common_ajax.js
		
			CHANGED CODE //inside function __construct 
				
				FROM:	AJAX.default_base_url = SITE_URL;	

				TO: AJAX.default_base_url = BASE_URI;	

				
				
		ADDED NEW FILE: \network-site\addons\default\modules\bbusers\views\profile\edit\experience.php		
				
			CODE IN IT:

				<div class="experience_form" style="padding: 20px;">

					<?=form_open_multipart('/profile/'.implode('/', $submit_to), array('id'=>'popup_form')) ?>
					
					<input type="hidden" name="some_random_var" value="x">
					
					<fieldset>
						<ul>
							<li>
								<legend style="margin-bottom: 20px; text-transform: uppercase;">
									<?=lang('system_fields:label:have_experience')?>
								</legend>
								<?=form_dropdown_list('industries', $industries, $industries_selected)?>
							</li>
						</ul>
					</fieldset>

					<div style="width: 100%; text-align: right;">
						<input type="button"
								name="popup_submit" 
								value="Save" 
								id="popup_submit" 
								style="display: inline-block; 
										font-size: 16px !important; 
										font-weight: 300; 
										border: 0 none; 
										vertical-align: middle;
										line-height: normal !important;						
										color: #fff; 
										padding: 0 1em;
										margin-top: 20px;
										cursor: pointer;
										text-transform: uppercase;
										text-align: center;
										background-color:<?=Settings::get('theme_colour2')?>"
								onclick="profileEditSubmit($('#popup_form'), 'experience', '');">
					</div>
					
					<?=form_close() ?>
				</div>				
				
				
				
				
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\css\system_fields_industries_multilevel_list.css		
				
			CODE IN IT: 
			
				div.multilevel-multiselect-group {
					position: relative;
					display: inline-block;
					vertical-align: middle;
					margin: 0px;
					padding: 0px;
					font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
					font-weight: 300;
				}
				div.multilevel-multiselect-group > ul.multilevel-container {
					display: none;
					max-height: 250px;
					overflow-y: auto;
					min-width: 300px;
					width: auto;
					overflow-x: auto;
					margin: 0px;
					padding: 0px;
					list-style-type: none;
				}
				div.multilevel-multiselect-group > button.multilevel {
					display: block !important;
					letter-spacing: 0px !important;
					background-color: #fff !important;
					background-image: linear-gradient(to bottom, #ffffff 0%, #eeeeee 100%) !important;
					background-repeat: repeat-x !important;
					background-clip: padding-box !important;
					border: 1px solid #cccccc !important;
					max-height: 31px !important;
					min-width: 210px !important;
				}
				div.multilevel-multiselect-group > button.multilevel[style] {
					padding-top: #10px !important;
					color: #555;
				}
				div.multilevel-multiselect-group > ul.multilevel-container.open {
					display: block;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li {
					display: list-item;
					cursor: pointer;
					margin: 0px;
					padding: 5px 6px;
					line-height: 1.428571429;
					color: #555;
					font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
					font-size: 12px;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li:hover:not(.selected) {
					background-color: #e6e6e6;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li > span.glyphicon.glyphicon-ok {
					display: none;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.selected {
					background-color: #337ab7 !important;
					color: #fff;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.selected > span.glyphicon.glyphicon-ok {
					display: inline;
					color: #fff;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.selected > span.glyphicon.glyphicon-menu-down,
				div.multilevel-multiselect-group > ul.multilevel-container > li.selected > span.glyphicon.glyphicon-menu-up {
					color: #fff !important;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main {
					display: block;
					padding-left: 27px;
					white-space: nowrap;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main span.sub_selected{
					padding-left: 5px;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main.with-sub {
					padding-left: 13px;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main.with-sub > span.glyphicon.glyphicon-menu-down {
					display: inline;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main.with-sub > span.glyphicon.glyphicon-menu-up {
					display: none;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main.with-sub.open > span.glyphicon.glyphicon-menu-down {
					display: none;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.main.with-sub.open > span.glyphicon.glyphicon-menu-up {
					display: inline;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.sub {
					padding-left: 50px;
					display: none;
				}
				div.multilevel-multiselect-group > ul.multilevel-container > li.sub.open {
					display: list-item;
				}
				div.multilevel-multiselect-group > button.btn {
					font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;
					font-size: 12px;
					font-weight: 300;
					line-height: 13px;
					text-transform: none;
				}
				span.glyphicon.glyphicon-triangle-top,
				span.glyphicon.glyphicon-triangle-bottom {
					font-size: 8px !important;
					margin-right: 5px !important;
					color: #555;
					width: 3px !important;
				}
				span.glyphicon.glyphicon-triangle-top {
					display: none;
				}
				span.glyphicon.glyphicon-menu-up,
				span.glyphicon.glyphicon-menu-down {
					font-size: 9px !important;
					margin-right: 5px !important;
					color: #555;
				}
				span.glyphicon.glyphicon-ok {
					font-size: 9px !important;
					margin-left: 5px !important;
					font-weight: 200 !important;
					color: #555;
				}
				ul.experience-list li.level-2{
					padding-left: 20px;
				}
								
			
			


		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\js\system_fields_industries_multilevel_list.js

			CODE IN IT: 

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
									var arrow_up = $container.find('span.glyphicon-triangle-top');
									var arrow_down = $container.find('span.glyphicon-triangle-bottom');
														
									if($list_container.is(":visible")) {
										$list_container.removeClass('open');
										arrow_up.css('display', 'none');
										arrow_down.css('display', 'inline');
									}
								}  
							}
						});
					
						$(".multilevel-multiselect-group")
							.find('li, button, span')
							.live('keyup click', function(e)
							{
								//Just if the div.multilevel-multiselect-group is in the DOM (can be loaded into the DOM later)
								if ($(".multilevel-multiselect-group")[0]) 
								{	
									//to avoid firing events multiple times
									e.stopPropagation();
									e.preventDefault();

									//Set some variables
									var $container = $(this).closest('div.multilevel-multiselect-group');
									var $list_container = $container.find('ul.multilevel-container');

									//Set some closure functions
									var _OpenList = function(to_open) {
														var arrow_up = $container.find('span.glyphicon-triangle-top');
														var arrow_down = $container.find('span.glyphicon-triangle-bottom');
														if (to_open) {
															$list_container.addClass('open');
															arrow_up.css('display', 'inline');
															arrow_down.css('display', 'none');
														} 
														else {
															$list_container.removeClass('open');
															arrow_up.css('display', 'none');
															arrow_down.css('display', 'inline');
														}
												   };
									var _OpenSubList = function(el, to_open) {
															var el_parent = el.parent();
															var el_children = $list_container.find('li[data-parent_id="' + el_parent.data('id') + '"]');
															if (to_open) {				
																el_parent.addClass('open');
																el_children.css('display', 'list-item');	
															}
															else {
																el_parent.removeClass('open');
																el_children.css('display', 'none');	
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
															$list_container.find('li.selected').each(function(){
																if (all_selected == 0) {
																	all_selected_ids += $(this).data('id');
																	all_selected_text += $(this).data('value');
																}
																else {
																	all_selected_ids += ', ' + $(this).data('id');
																	all_selected_text += ', ' + $(this).data('value');
																}
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
									//if a keyup event happened and was pressed ESC .... OR ... mouse left the div
									if (e.type == 'keyup' && e.keyCode == 27)  {
										_OpenList(false); 
									}
									
									
									//if a click event happened on a button - this button is that where selected are displayed
									else if (e.currentTarget.className == 'multilevel btn btn-default' || e.currentTarget.parentElement.className == 'multilevel btn btn-default') {
										($list_container.attr('class').indexOf('open') == -1) ? _OpenList(true) : _OpenList(false); 
									}//END controll part
										
									
									//if a click event happened on a glyphicon down/up span element
									else if (e.target.className == 'glyphicon glyphicon-menu-down' || e.target.className == 'glyphicon glyphicon-menu-up') {
										if (e.target.className == 'glyphicon glyphicon-menu-down') {						
											_OpenSubList($(this), true);
										}
										else if (e.target.className == 'glyphicon glyphicon-menu-up') {
											_OpenSubList($(this), false);
										}
									}
									
									
									//if a click event on a li element
									else if (e.target.localName == 'li' || e.currentTarget.parentElement.localName == 'li') {
										_SetSelected($($(this)).closest('li'));
									}
								}//END if ($(".multilevel-multiselect-group")[0]) 
							}//END click function
						)//END .live
					}//END if ($("ul.multiselect-container"))
					

					
					/**********************************
					*	     END INDUSTRY TYPES       *
					***********************************/	
					
				});			
							
				
				
	
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\js\system_fields_industries_modal.js
		
			CODE IN IT: 
			
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
	
	
	
	
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\views\members\partials\industry_types_option.php
		
			<tr class="industry_type_secondary">
				<td>
					<input name="<?=$id?>" type="text" class="form-control industry_type" value="<?=$option?>">
				</td>
				<td class="button">
					<button name="delete" class="btn btn-sm btn-danger"><?=$lng_button_delete?></button>
				</td>
			</tr>	
				
				
				
				
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\views\members\partials\industry_types_dialog.php
		
			CODE IN IT: 
			
				<div class="modal-dialog industry-types">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title"><?=lang('system_fields:label:edit_industry_types')?></h4>
						</div>
						<div class="modal-body" style="padding-bottom: 0px;">
							<?=$this->load->view('members/partials/industry_types_options')?>
						</div>
						<div class="modal-footer industry_types">
							<button name="add" class="btn btn-primary"><?=lang('system_fields:button:add_new_industry')?></button>
							<button name="save" class="btn btn-primary"><?=lang('system_fields:button:save')?></button>
						</div>
					</div><!-- /.modal-content -->
				</div><!-- /.modal-dialog -->			


		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\views\members\partials\industry_types_options.php
		
			CODE IN IT: 
			
				<table class="table table-condensed">
					<tr>
						<th class="question-label" colspan="2">
							<?=lang('system_fields:label:default_industry_types')?>
						</th>
					</tr>	
					<tr>
						<td colspan="2" style="padding-bottom: 10px;">
							<?=form_chosen('industries_primary', $industries_primary, '0', array('width' => '100%')); ?>
						</td>
					</tr>	
					<tr>
						<td colspan="2" style="border: none;">
							<?=lang('system_fields:text:secondary_types')?>
						</td>
					</tr>	
					<tr>
						<th class="question-label">
							<?=lang('system_fields:label:added_industry_types')?>
						</th>
						<th class="question-label">
							<?=lang('system_fields:label:actions')?>
						</th>
					</tr>
				</table>
				<table class="table table-condensed">
					<tr>
						<td colspan="2">
							<div id="added-types-container">
								<table class="table table-condensed added-types">
									<tr class="tr-theres-no-added-type">
										<td colspan="2" style="border: none;">
											<h4 class="modal-title">
												<?=lang('system_fields:text:there_are_still_no_added_industry')?>
											</h4>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="2" id="industry_types_messages_td">
							<div id="industry_types_messages" class="alert"></div>
						</td>
					</tr>		
				</table>
				<input type="hidden" id="added_industry_types" value="0" />
				<input type="hidden" id="msg_confirm_delete" value="<?=lang('system_fields:text:are_you_sure_in_delete')?>" />
				<input type="hidden" id="msg_success_add" value="<?=lang('system_fields:message:success:add')?>" />
				<input type="hidden" id="msg_error_action" value="<?=lang('system_fields:message:error:action')?>" />
				<input type="hidden" id="msg_select_first" value="<?=lang('system_fields:message:error:select_first')?>" />
				<input type="hidden" id="msg_success_save" value="<?=lang('system_fields:message:success:save')?>" />
				<input type="hidden" id="msg_success_change_default" value="<?=lang('system_fields:message:success:change_default')?>" />
				<input type="hidden" id="msg_are_you_sure_in_change" value="<?=lang('system_fields:message:warning:are_you_sure_in_change')?>" />
				
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\css\system_fields.css
		
			ADDED CODE IN IT: 
			
				.table.table-condensed
				{
					width: 100%;
					margin: 0px;
				}

				.table.table-condensed th.question-label {
					border-top: none;
					height: 30px;
				}

				tr.tr-theres-no-added-type > td > h4 {
					margin-top: 100px; 
					text-align: center;
				}

				tr.industry_type_secondary,
				tr.industry_type_secondary  td {
					border: none !important;
				}
				tr.industry_type_secondary  td {
					padding: 0px 15px 15px 0px !important;
				}
				tr.industry_type_secondary  td.button {
					width: 135px !important;
				}

				.modal-footer.industry_types {
					padding: 12px !important;
				}

				#added-types-container {
					padding: 10px 0px 0px 0px !important;
					border: none !important;
					
				}

				#added-types-container
				{
					display: block; 
					border: none; 
					height: 100%; 
					width: 100%; 
					max-height: 200px; 
					min-height: 200px; 
					overflow-y: scroll;
					overflow-x: hidden; 
					padding: 0px; 
					margin: 0px;	
				}

				#industry_types_messages_td{
					padding: 0 !important;
					border: none !important;
					height: 36px !important;
				}
				#industry_types_messages{
					display: none; 
					height: 30px !important;
					margin: 0px !important; 
					padding: 5px 0 0 10px !important; 
					width: 95% !important;
				}
		
		
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\views\members\partials\industry_types_empty.php
		
			<tr class="tr-theres-no-added-type">
				<td colspan="2" style="border: none;">
					<h4 class="modal-title">
						<?=lang('system_fields:text:there_are_still_no_added_industry')?>
					</h4>
				</td>
			</tr>
		
		
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\language\english\system_fields_lang.php
		
			ADDED CODE IN IT: 
			
				<?php

				//System fields
				/* questions */
				$lang['system_fields:question:postal_label_types'] = 'Postal label types';
				$lang['system_fields:question:industry_types'] = 'Industry types';
				/* labels */
				$lang['label:actions'] = 'Actions';
				$lang['system_fields:label:create_custom_field'] = 'Create Custom Field';
				$lang['system_fields:title:create_custom_field'] = 'Create custom questions specific to this event which you can ask people when they sign up e.g. Dietary requirements';
				$lang['system_fields:label:system_fields'] = 'System Fields';
				$lang['system_fields:label:your_fields'] = 'Your Fields';
				$lang['system_fields:label:customisable_fields'] = 'Customisable Fields';
				$lang['system_fields:label:added_industry_types'] = 'Secondary industry types';
				$lang['system_fields:label:default_industry_types'] = 'Default industry types';
				$lang['system_fields:label:edit_industry_types'] = 'Edit industry types';
				$lang['system_fields:label:experience_secondary'] = 'Experience - secondary';
				$lang['system_fields:label:primary_category'] = 'Primary category';
				$lang['system_fields:label:secondary_category'] = 'Secondary category';
				$lang['system_fields:label:have_experience'] = 'I have experience in';
				/* button captions */
				$lang['system_fields:button:delete'] = 'Delete';
				$lang['system_fields:button:add_new_industry'] = 'Add new industry';
				$lang['system_fields:button:save'] = 'Save';
				$lang['system_fields:button:add_field'] = 'Add Field';
				/* texts */
				$lang['system_fields:text:there_are_still_no_added_industry'] = 'There are still no added industry types.';
				$lang['system_fields:text:are_you_sure_in_delete'] = 'Are you sure in you want to delete?';
				$lang['system_fields:text:click_on_the_cog'] = 'Click on the cog to edit the question options.';
				$lang['system_fields:text:secondary_types'] = 'Create your own list of more specific secondary industries related to your sector. (useful if you are a specialist institution.';
				/* messages */
				$lang['system_fields:message:success:add'] = 'Adding new field was successful.';
				$lang['system_fields:message:success:save'] = 'Secondary industry types saved successfully.';
				$lang['system_fields:message:success:delete'] = 'Deleting industry type was successful.';
				$lang['system_fields:message:warning:already_exist'] = 'The added industry type already exists.';
				$lang['system_fields:message:error:action'] = 'Something went wrong! Please, try again!';
				$lang['system_fields:message:error:select_first'] = 'Please, select a default industry type!';
				$lang['system_fields:message:success:change_default'] = 'Default type changed successfully.';
				$lang['system_fields:message:warning:are_you_sure_in_change'] = 'There are some unsaved added types! <br><br> Are you sure you want to change?';
				/* other */
				$lang['system_fields:option:select_an_option'] = '-- Select an option --';
				?>	
				

				
		NEW ADDED FILE: \network-site\addons\default\modules\network_settings\js\sytem_fields.js
		
			ADDED CODE IN IT: 
		
				/*******************************************************************************
				********************************************************************************
				****************  CONTROLLING INDUSTRY TYPES MULTI-SELECT LIST *****************
				**********************  created by Lajos Deli ToucanTech   *********************
				*******************************************************************************/
				
				
							

				
				/**********************************
				*	     END INDUSTRY TYPES       *
				***********************************/	
				
				
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
				
				
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\models\system_fields_m.php	
			
			CODE IN IT: 
			
				<?php 

					if (!defined('BASEPATH')) exit('No direct script access allowed');

					
					/*
					 * This is a sample db queries handle module
					 *
					 * @author 		Lajos Deli <lajos@toucantech.com>
					 * @package 	NetworkBecause
					 * 
					 * @used
					 *		- db/table: pelican -> (prefix)system_fields
					 *		- db/table: pelican -> (prefix)system_field_options	 
					 */
					 

					class System_fields_m extends MY_Model 
					{

						protected $_table;
						protected $_table_options;
						
						
						
						public function __construct()
						{		
							parent::__construct();
							
							$this->_table = $this->db->dbprefix('system_fields');
							$this->_table_options = $this->db->dbprefix('system_field_options');
						}
						
						
						
						
						
						/*
						 *	Check option by value exists or doesn't in system_field_options table. 
						 *
						 * @input
						 *		- $option: string
						 *		- $parent_id: int
						 *		- $question_id: int
						 *		- $deletable: bool, default true
						 *
						 * @return
						 *		- bool
						 *
						*/
						public function insert_option($option, $parent_id, $question_id, $deletable = true)
						{
							$data = array(
								'options' => $option, 
								'parent_id' => $parent_id,
								'question_id' => $question_id,
								'deletable' => $deletable,
								'created_on' => time(),
								'created_by' => $this->session->userdata('id')
							);
							
							$this->db->insert($this->_table_options, $data);
							
							return $this->db->insert_id();
						}//END function insert_option




						
						/*
						 *	Check option by id, exists or doesn't in system_field_options table. 
						 *
						 * @input
						 *		- $option_id: int
						 *
						 * @return
						 *		- bool
						 *
						*/
						public function exists_option_by_id($option_id)
						{
							return $this->db->value_exists($option_id, 'id', $this->_table_options);
						}//END function exists_option_by_id




						
						/*
						 *	Check option by value, exists or doesn't in system_field_options table. 
						 *
						 * @input
						 *		- $option: string
						 *		- $parent_id: int
						 *		- $question_id: int
						 *		- $option_id: int, default = 0
						 *
						 * @return
						 *		- bool
						 *
						*/
						public function exists_option_by_value($option, $parent_id, $question_id, $option_id = 0)
						{
							$additional_where = "parent_id = " . $parent_id . " AND question_id = " . $question_id . " " . ((strlen($option_id) < 12) ? "AND id != " . $option_id : "");
							
							return $this->db->value_exists($option, 'options', $this->_table_options, $additional_where);
						}//END function exists_option_by_value		
						
						
						
						
						
						/*
						 *	Update option's data in system_field_options table. 
						 *
						 * @input
						 *		- $option_id: int
						 *
						 * @return
						 *		- bool
						 *
						*/
						public function update_option($option_id, $update_data = array())
						{
							$update_data['updated_on'] = time();
							
							$this->db->where('id', $option_id);
							return $this->db->update($this->_table_options, $update_data);
						}//END function update_option
						
						
						
						
						
						/*
						 *	Get question's ids from system_fields table.
						 *
						 * @input
						 *		- $slugs: array/string : if array then can be empty all contains the slugs, if string then just name of the slug
						 * @return
						 *		- array: ids / or returns just one id of question if slug is just a string
						 *
						*/
						public function get_question_ids_by_slugs($slugs = array())
						{
							$hits = array();
							
							if (empty($slugs)) 
							{
								$query = $this->db->query("SELECT slug, id FROM " . $this->_table);
								
								foreach ($query->result() as $row) $hits[$row->slug] = $row->id;
							}
							else if (is_array($slugs) and count($slugs) > 0)
							{
								$query = $this->db->query( "SELECT slug, id FROM " . $this->_table . " WHERE slug in (" . implode(",", $slugs) . ")" );
								
								foreach ($query->result() as $row) $hits[$row->slug] = $row->id;
							}
							else 
							{
								$row = $this->db->select('slug, id')
													->where('slug', $slugs)
													->get($this->_table)
													->row();
								return $row->id;
							}
							
							return $hits;
						}//END function get_question_ids_by_slugs
						
						
						
						
						

						
						/*
						 *	Get question field value from system_fields table.
						 *
						 * @input
						 *		- $slugs: array/string : if array then can be empty all contains the slugs, if string then just name of the slug
						 *
						 * @return
						 *		- array: slug => questions
						 *
						 *	NOTE: questions' value are lang variables
						*/
						public function get_questions_by_slugs($slugs = array())
						{
							$hits = array();
							
							if (empty($slugs)) 
							{
								$query = $this->db->query("SELECT slug, question FROM " . $this->_table);
								
								foreach ($query->result() as $row) $hits[$row->slug] = lang($row->question);
							}
							else if (is_array($slugs) and count($slugs) > 0)
							{
								$query = $this->db->query( "SELECT slug, question FROM " . $this->_table . " WHERE slug in (" . implode(",", $slugs) . ")" );
								
								foreach ($query->result() as $row) $hits[$row->slug] = lang($row->question);
							}
							else 
							{
								$row = $this->db->select('slug, question')
													->where('slug', $slugs)
													->get($this->_table)
													->row();
								$hits[$row->slug] = lang($row->question);
							}
							
							return $hits;
						}//END function get_questions_by_slugs
						
					
					
						
						
						
						/* 
						 * Returns option's details by id
						 * 
						 *	@input 
						 *		- $id : string 	: name of the slug, required
						 *	@return
						 *		- array: data of an option
						*/
						public function get_option_by_id($id)
						{
							return $this->db->select('*')
											->where('id', $id)
											->get($this->_table_options)
											->row_array();
						}//END function get_options_by_slug
						
					
					
						
						
						
						/* 
						 * Get options value by slug
						 * 
						 *	@input 
						 *		- $slug : 			string 	: name of the slug, required
						 *		- $parent_id: 		int 	: default 0 - getting child options where parent_id equal this param's value, if 0 then you'll get all option
						 *		- $just_values: 	bool 	: default true - if true then return array will contains just options without id
						 *		- $show_children: 	bool	: default false - if true then next to the parents options' names will be show the numbers of child options in brackets
						 *		- $direction: 		string	: default ASC, can be ASC or DESC
						 *	
						 *	@return
						 *		- array: options
						 *			NOTE: 
						 *				if $just_values = true then array(option's id -> option's value ....)
						 *				if $just_values = false then array(array('id' -> option's id, 'value' -> option's value, 'parent_id' => option's parent id) ...)
						*/
						public function get_options_by_slug($slug, $parent_id = 0, $just_values = true, $show_children = false, $direction = 'ASC')
						{
							$hits = array();
							
							$question_id = $this->get_question_ids_by_slugs($slug);
							
							if ( ! empty($question_id)) 
							{
								$query = $this->db->select('*')
												->where('question_id', $question_id)
												->where('parent_id', $parent_id)
												->order_by('options', $direction)
												->get($this->_table_options);
								
								if ($just_values) 
								{
									if ($show_children and $parent_id == 0) 
									{
										foreach ($query->result() as $row) 
										{
											$hits[$row->id] = $row->options . " (" . $this->get_options_number_of_children($question_id, $row->id) . ")";
										}
									}
									else 
										foreach ($query->result() as $row) $hits[$row->id] = $row->options;
								}
								else 
								{
									if ($show_children and $parent_id == 0) 
									{
										$counter = 0;
										foreach ($query->result() as $row) 
										{
											$hits[$counter]['id'] = $row->id;
											$hits[$counter]['parent_id'] = $row->parent_id;
											$hits[$counter]['options'] = $row->options . "(" . $this->get_options_number_of_children($question_id, $row->id) . ")";
											$counter++;
										}
									}
									else 
									{
										$counter = 0;
										foreach ($query->result() as $row) 
										{
											$hits[$counter]['id'] = $row->id;
											$hits[$counter]['parent_id'] = $row->parent_id;
											$hits[$counter]['options'] = $row->options;
											$counter++;
										}
									}
								}
							}

							return $hits;
						}//END function get_options_by_slug

						
						
						
						
						
						
						
						/* 
						 * Get number of childer of an option
						 * 
						 *	@input
						 *		- option_id : int
						 *	
						 *	@return
						 *		- number of children
						 *
						*/
						public function get_options_number_of_children($question_id, $option_id)
						{
							$row_children = $this->db->select('count(*) as counted')
														->where('question_id', $question_id)
														->where('parent_id', $option_id)
														->get($this->_table_options)
														->row_array();
														
							return $row_children['counted'];
						}//END function get_options_number_of_children		

						
						
						
						
						
						
						
						/* 
						 * Get industry options for list 
						 * 
						 *	@input : VOID
						 *	
						 *	@return
						 *		- multidimensional array: options / params
						 *			array(array('level' =>, 'id' =>, 'value' =>, 'class' =>, 'extra' => ''))
						 *
						*/
						public function get_industry_types_for_list()
						{
							$question_id = $this->get_question_ids_by_slugs('industry_types');
							
							$list = array();
							$options = $this->get_options_by_slug('industry_types', $parent_id = 0, $just_values = false);
							foreach($options as $option) 
							{
								if ($option['parent_id'] == 0) 
								{
									$children = $this->get_options_by_slug('industry_types', $parent_id = $option['id'], $just_values = false);
									$number_of_children = count($children);
									$list[] = $this->get_industry_types_for_list_set_array($question_id, $option, $number_of_children);
									
									foreach ($children as $key => $child) {
										$list[] = $this->get_industry_types_for_list_set_array($question_id, $child);
									} 						
								} 
							}
							
							return $list;
						}//END function get_industry_types_for_list		

						


						
						/*
							helper function of get_industry_types_for_list
						*/
						private function get_industry_types_for_list_set_array($question_id, $option, $number_of_children = 0) 
						{
							if ($option['parent_id'] == 0) {
								$level = 1;
								$class = 'main' . (($this->get_options_number_of_children($question_id, $option['id']) > 0) ? ' with-sub' : '');
							}
							else {
								$level = 2;
								$class = 'sub';
							}
							
							return array(
									'id' => $option['id'],
									'parent_id' => $option['parent_id'],
									'value' => $option['options'],
									'level' => $level,
									'class' => $class,
									'children' => $number_of_children,
									'extra' => ''
								);			
						}//END
						
						
						
						
						
						
						/*
						 *	Returns an array which will contain the id's of industries 
						 *
						 * @input
						 *		- $value: string
						 *
						 * @return
						 *		- array: contains id of industries
						 *
						*/
						public function get_industry_ids_from_value($value)
						{
							$ids = array();
							
							if (trim($value, PHP_EOL) != '') 
							{
								$value_a = explode(PHP_EOL, $value);
								
								if (!empty($value_a))
								{
									foreach($value_a as $key => $option) 
									{
										//option must be look alike: id||option's name
										if (strpos($option, '||') > 0) 
										{
											$tmp = explode('||', $option);
											$ids[] = $tmp[0];
										}
									}
								}
							}

							return $ids;
						}//END function get_selected_industries_from_value
						
						
						
						
						
						
						
						/*
						 *	Returns a string - convert a string id||option ... format from getting ids
						 *
						 * @input
						 *		- $id_string: string
						 *
						 * @return
						 *		- string: id1||option1 id2||option2 ... format
						 *
						*/
						public function get_industry_db_value_from_ids($id_string)
						{
							$hits = array();
							
							$ids = explode(',', trim($id_string, PHP_EOL));
							
							if ( ! empty($ids) > 0) 
							{
								foreach($ids as $key => $id) 
								{
									$row = $this->db->select('options')
														->where('id', $id)
														->get($this->_table_options)
														->row_array();
									
									if ( ! empty($row)) 
									{
										$hits[] = $id . '||' . $row['options']; 
									}						
								}
							}
							
							return ( ! empty($hits)) ? implode(PHP_EOL, $hits) : '';
						}//END function get_industry_db_value_from_ids
						
						
						
						
						
						
						
						
						/*
						 *	Delete option by id
						 *
						 * @input
						 *		- $option_id: int
						 *
						 * @return
						 *		- bool
						*/
						public function delete_option_by_id($option_id)
						{
							$this->db->where('id', $option_id);
							return $this->db->delete($this->_table_options);
						}//END function delete_option_by_id

						
						
						
						
					}//END class			
				
				
		ADDED NEW FILE: \network-site\addons\default\modules\network_settings\controllers\system_fields.php

			CODE IN IT: 
			
				<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

					/**
					 * This is a sample module for PyroCMS
					 *
					 * @author 		Lajos Deli <lajos@toucantech.com>
					 * @package 	NetworkBecause
					 * 
					 * @used 
					 *		- mysql model: network_settings/models/system_fields_m.php
					 *		- lang file: network_settings/languages/{lang}/system_fields.php
					 */
					 
					class System_fields extends Public_Controller
					{

						
						public function __construct()
						{
							parent::__construct();
							
							//Loading some useful files which related to this controller
							$this->load->model('network_settings/system_fields_m');
							$this->lang->load('network_settings/system_fields');
						}
						
						
						
						
						/*
						 * AJAX call - returns a built modal for handling industry types
						 * 
						 * @input: VOID
						 *
						 * @return: VOID
						*/
						public function ajax_industry_types_dialog()
						{
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{	
								$data = array();

								$data['industries_primary'] = array("" => lang('system_fields:option:select_an_option')) + $this->system_fields_m->get_options_by_slug($slug = 'industry_types', $parent_id = 0, $just_values = true, $show_children = true);
								$data['industries_secodary'] = array();

								$this->load->view('members/partials/industry_types_dialog', $data);
							}
						}//END function ajax_industry_types_dialog()	
						
						
						
						
						
						/*
						 * AJAX call - check option already exists or doesn't
						 * 
						 * @input: VOID
						 *		POST DATA
						 *			- value: string
						 *			- parent: id
						 *
						 * @return: VOID
						*/
						public function ajax_industry_types_value_exists()
						{
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{	
								$option = trim($this->input->post('option'), PHP_EOL);
								$hit = false;
								
								if ($option != '') 
								{
									$hit = $this->system_fields_m->exists_option_by_value(
																$option, 
																$this->input->post('parent_id'), 
																$this->system_fields_m->get_question_ids_by_slugs('industry_types'), 
																$this->input->post('option_id')
															);
								}

								echo ($hit)
										? lang('system_fields:message:warning:already_exist')
										: $hit;
							}
						}//END function ajax_industry_value_exists()	
								
						
						
						
						
						
						/*
						 * AJAX call - returns secondary options of parent (primary) option 
						 * 
						 * @input: VOID
						 *	POST-ed fields 
						 *		- parent_id : id of primary option 
						 *
						 * @return: 
						 *		- bult HTML snippet from secondary options
						*/
						public function ajax_industry_types_get_secondary_types() 
						{
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{	
								$parent_id = $this->input->post('parent_id');
								$output = $this->load->view('members/partials/industry_types_empty', '', true);
								
								if ($parent_id > 0) 
								{
									$secondaries = $this->system_fields_m->get_options_by_slug('industry_types', $parent_id);
										
									if (count($secondaries) > 0) 
									{
										$data = array();
										$data['lng_button_delete'] = lang('system_fields:button:delete');
										$output = "";
										foreach($secondaries as $id => $option) 
										{
											$data['id'] = $id;
											$data['option'] = $option;
											
											$output .= $this->load->view('members/partials/industry_types_option', $data, true);
										}
									}
								}
								
								echo $output;
							}
						}//END function ajax_industry_types_get_secondary_types()	
						
						
						
					
					

						/*
						 * AJAX call - adding new secondary industry type empty input field
						 *
						 * @input: VOID
						 *
						 * @return: 
						 *		- a html snippet of industry types option
						*/
						public function ajax_industry_types_add()
						{	
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{
								echo $this->load->view('members/partials/industry_types_option', array( 
															'id' => random_string('alnum', 12),
															'option' => '',
															'lng_button_delete' => lang('system_fields:button:delete')
														));
							}
						}//END function ajax_industry_types_add()	
						
						
						


						/*
						 * AJAX call - saving added (secondary) industry type
						 *
						 * @input: VOID
						 *	POST-ed fields can be
						 *		- parent_id : id of primary option 
						 *		- data : collected data of secondary input fields
						 *
						 * @return: 
						 *		- bool: false or json_encode of newly inserted options' id array
						*/
						public function ajax_industry_types_save()
						{	
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{		
								$OK = true;
								$parent_id = $this->input->post('parent_id');
								parse_str($this->input->post('data'), $industries_secondary);
								$question_id =  $this->system_fields_m->get_question_ids_by_slugs('industry_types');
								
								$new_ids = array();
								foreach($industries_secondary as $option_id => $option) 
								{
									$option = ucfirst(trim($option, PHP_EOL));
									
									if ($option != "") 
									{
										$old_id = $option_id;
										if (strlen($option_id) > 11) {
											$option_id = 0;
										}
										
										if ( ! $this->system_fields_m->exists_option_by_id($option_id)) 
										{
											if ( ! $this->system_fields_m->exists_option_by_value($option, $parent_id, $question_id)) 
											{
												$new_ids[$old_id] = $this->system_fields_m->insert_option($option, $parent_id, $question_id);
											}
										}
										else  
										{
											$OK = $this->system_fields_m->update_option($option_id, array('options' => $option));
										}
									}
								}
						
								echo ( ! $OK) ? false : json_encode($new_ids);
							}
						}//END function ajax_industry_types_save()		
							
							
							
							
							
						/*
						 * AJAX call - deleting added (secondary) industry type
						 *
						 * @input: VOID
						 *	POST-ed fields can be
						 *		- id : id of option
						 *
						 * @return: 
						 *		- bool: false or success msg of delete action
						*/
						public function ajax_industry_types_delete()
						{	
							if( ! $this->input->is_ajax_request())  
							{
								show_404();
							}
							else 
							{					
								$option_id = $this->input->post('option_id');
								
								if (strlen($option_id) > 11) { //this mean, the added type is still not saved - the id a random character and not an Integer
									$OK = true;
								}
								else {
									$OK = $this->system_fields_m->delete_option_by_id($option_id);
								}
								
								echo ( ! $OK) ? false : lang('system_fields:message:success:delete');						
							}	
						}//END function ajax_industry_types_delete()	
						
						
						
						
						
						
						/*
						 * Returns HTML formatted hierarchical list of industries
						 * 
						 * @input: 
						 *		- $industries: array - ids of industries ... OR ... string: experience value from db 
						 *
						 * @return: 
						 *		- return empty string or HTML formatted list
						*/
						public function industries_hierarchical_list($industries)
						{
							if ( ! is_array($industries)) 
							{
								$industries = $this->system_fields_m->get_industry_ids_from_value($industries);
							}
							
							$line_break = "\n";
							$html = '<ul class="experience-list">' . $line_break;
							
							if( ! empty($industries))  
							{
								foreach($industries as $key => $id) 
								{
									$option = $this->system_fields_m->get_option_by_id($id);

									$html .= '<li class="level-' . (($option['parent_id'] == 0) ? '1' : '2') . '">' . $option['options'] . '</li>';
								}
							}
							
							$html .= '</ul>' . $line_break;
							
							return $html;
						}//END function industries_hierarchical_list()	
						
					}//END class System_fields
					
	
	

			\network-site\addons\default\modules\network_settings\details.php	
			
				ADDED CODE IN IT: 
				
					//Inside function upgrade
					
						if (version_compare($old_version, '2.0.69.02', 'lt'))
						{
							if ($this->_system_fields_table_create()) 
									$this->_system_fields_table_insert($this->_system_fields_table_records());
							
							if ($this->_system_field_options_table_create())
									$this->_system_field_options_table_insert($this->_system_field_options_table_records());
							
							$this->_convert_industry_type_values($this->db->dbprefix('profiles'), 'experience');

							$this->_convert_industry_type_values($this->db->dbprefix('profiles'), 'experience_offline');
						}		
					
					//Inside function install
						
						if ($this->_system_fields_table_create()) 
								$this->_system_fields_table_insert($this->_system_fields_table_records());
						if ($this->_system_field_options_table_create())
								$this->_system_field_options_table_insert($this->_system_field_options_table_records());		
						$this->_convert_industry_type_values($this->db->dbprefix('profiles'), 'experience');
						$this->_convert_industry_type_values($this->db->dbprefix('profiles'), 'experience_offline');
				
				ADDED FUNCTIONS 
				
					private function _system_fields_table_create() 
					{
						if ( ! $this->db->table_exists('system_fields')) 
						{
							$query_new_table = "CREATE TABLE `" . $this->db->dbprefix('system_fields') . "` (
									`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
									`slug` VARCHAR(100) NOT NULL,
									`question` VARCHAR(100) NOT NULL,
									`created_on` INT(11) NOT NULL,
									`updated_on` INT(11) NULL,
									`created_by` INT(11) NOT NULL DEFAULT 1,
									PRIMARY KEY (`id`)
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

							return $this->db->query($query_new_table);
						}
						else 
							return true;
					} //END function _system_fields_table_create() 	
					
					

					private function _system_fields_table_insert($records = array()) 
					{
						$table = $this->db->dbprefix('system_fields');	
							
						foreach ($records as $key => $record) 
						{
							if ( ! $this->db->value_exists($record['slug'], 'slug', $table)) 
							{
								if ( ! $this->db->insert($table, $record)) {
									return false;					
								}
							}
						}
					} //END function _system_fields_table_insert() 		
					
					
					
					private function _system_fields_table_records() 
					{
						$time = now();

						return array(
							array(
								'id' => 1,
								'slug' => 'postal_label_types',
								'question' => 'system_fields:question:postal_label_types',
								'created_on' => $time
							),
							array(
								'id' => 2,
								'slug' => 'industry_types',
								'question' => 'system_fields:question:industry_types',
								'created_on' => $time
							),
						);
					} //END function _system_fields_table_records() 	
					
					
					
					private function _system_field_options_table_create() 
					{
						if ( ! $this->db->table_exists('system_field_options')) 
						{
							$query_new_table = "CREATE TABLE `" . $this->db->dbprefix('system_field_options') . "` (
									`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
									`parent_id` INT(11) NOT NULL DEFAULT 0,
									`question_id` INT(11) UNSIGNED NOT NULL,
									`options` VARCHAR(100) NOT NULL,
									`deletable` BOOLEAN NOT NULL DEFAULT 0,
									`created_on` INT(11) NOT NULL,
									`updated_on` INT(11) NULL,
									`created_by` INT(11) NOT NULL DEFAULT 1,
									PRIMARY KEY (`id`),
									FOREIGN KEY (`question_id`) REFERENCES " . $this->db->dbprefix('system_fields') . "(`id`)
									   ON DELETE CASCADE
									   ON UPDATE CASCADE
								) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

							return $this->db->query($query_new_table);
						}
						else 
							return true;
					} //END function _system_field_options_table_create() 	

					
					
					private function _system_field_options_table_insert($records = array()) 
					{
						$table = $this->db->dbprefix('system_field_options');
						
						foreach ($records as $key => $record) 
						{
							if ( ! $this->db->value_exists($record['options'], 'options', $table, 'parent_id = ' . $record['parent_id'])) 
							{
								if ( ! $this->db->insert($table, $record)) return false;
							}
						}
					} //END function _system_field_options_table_insert() 
					
					
					
					private function _system_field_options_table_records() 
					{
						$time = now();

						return array(
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => false, 'created_on' => $time, 'options' => 'Individual'),
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => true, 'created_on' => $time, 'options' => 'Family'),
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => true, 'created_on' => $time, 'options' => 'Parents'),
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => true, 'created_on' => $time, 'options' => 'Siblings'),
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => true, 'created_on' => $time, 'options' => 'Friends'),
							array('parent_id' => 0, 'question_id' => 1, 'deletable' => true, 'created_on' => $time, 'options' => 'Couples'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Academia'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Aerospace and defence'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Arts and media'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Banking, finance and accounting'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Charity and non-profit'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Construction and property'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Consultancy'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Education & teaching'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Energy & utilities'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Environmental & agriculture'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Engineering & manufacturing'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Hospitality, tourism & sport'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Internet and new media'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'IT and telecommunications'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Law'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Logistics, transport and shipping'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Marketing and PR'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Medical, veterinary and pharmaceutical'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Public sector'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Publishing and journalism'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Recruitment & HR'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Retail'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Science and research'),
							array('parent_id' => 0, 'question_id' => 2, 'deletable' => false, 'created_on' => $time, 'options' => 'Uniformed services'),					
						);
					} //END function _system_field_options_table_records() 		
					
					
					
					function _convert_industry_type_values($table, $field)
					{
						$this->load->library('Options');
						
						$old_industries = $this->options->nb_industry_sectors();
						$OK = true;

						$query = $this->db->select('id, ' . $field)->order_by('id', 'ASC')->get($table);
						foreach ($query->result_array() as $row) 
						{
							$value = $row[$field];
							$value_new = '';
							$value_new_a = array();
							if (trim($value, '\r\n') != '') 
							{
								$value_a = explode(PHP_EOL, $value);
								if (!empty($value_a))
								{
									foreach($value_a as $key => $option) 
									{
										$hit = $this->db->select('id')
															->where('options', $option)
															->where('parent_id', 0)
															->get($this->db->dbprefix('system_field_options'))
															->row_array();
															
										if (!empty($hit))
										{
											$value_new_a[] = $hit['id'] . '||' . $option;
										}
									}
									
									if (!empty($value_new_a))
									{
										$value_new = implode(PHP_EOL, $value_new_a);
										$this->db->where('id', $row['id']);
										$OK = $this->db->update($table, array($field => $value_new));
									}
								}
							}	
						}

						return $OK;
					}//END function _convert_industry_type_values() 		




	
