<div class="experience_form" style="padding: 20px;">

	<?=form_open_multipart('/profile/'.implode('/', $submit_to), array('id'=>'popup_form')) ?>

	<input type="hidden" name="some_random_var" value="x">

	<fieldset>
		<ul>
			<li>
				<legend style="margin-bottom: 20px; text-transform: uppercase;">
					<?=lang('system_fields:label:have_experience')?>
				</legend>
				<?=form_dropdown_list('industries', $industries, $industries_selected, array('max_display_selected' => '2'))?>
			</li>
		</ul>
	</fieldset>

	<div style="width: 100%; text-align: right;">
		<input type="button" name="popup_submit" value="Save" id="popup_submit" class="experience_button_save" 
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