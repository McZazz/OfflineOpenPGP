import { makeElement, appendAnimStyles, Component } from "./utils.js";
import { TextInput } from './TextInput.js'; 
import { TextButton } from './TextButton.js'; 
import { TooltipLabel } from './TooltipLabel.js'; 
import { ImageButton } from './ImageButton.js'; 

export class InputWithFind extends Component {
	constructor({globals=null, append_to=null, find_cb=null, arrow_left_cb=null, arrow_right_cb=null, label_text=null, label_width=null, hide_find=false}={}) {
		super({globals:globals, append_to:append_to});

		this.find_cb = find_cb;
		this.arrow_left_cb = arrow_left_cb;
		this.arrow_right_cb = arrow_right_cb;
		this.label_text = label_text;
		this.label_width = label_width;

		this.cont = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['marginTop', `${this.global_styles['panel_margins']}px`],
				['flexDirection', 'column'],
			]
		});

		this.label = new TooltipLabel({
			globals:this.globals, 
			append_to:this.cont, 
			label_text:this.label_text, 
			tooltip_text:'Copy',
			label_width:this.label_width,
			parent_obj:this 
		});
		this.label.append();

		///////////////////////////////////////
		this.bottom_row = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
			]
		});
		this.cont.appendChild(this.bottom_row);

		this.input_border_cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			],
			style:[
				['flexGrow', '1']
			]
		});
		this.bottom_row.appendChild(this.input_border_cont);

		this.text_input = new TextInput({globals:globals, append_to:this.input_border_cont});
		this.text_input.cont.style.flexGrow = '1';
		this.text_input.append();

		//////////////////////////////////////////////
		
		if (!hide_find) {
			this.find_btn = new TextButton({globals:this.globals, append_to:this.input_border_cont, text:'Find', width:'42px', btn_click_cb:this.find_cb});
			this.find_btn.cont.style.marginLeft = `${this.global_styles['panel_margins']/2}px`;
			this.find_btn.append();
		}

		//////////////////////////////////////////////

		this.arrows_border_cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			],
			style:[
				['marginLeft', `${this.global_styles['panel_margins']/2}px`],
				['width', null],
			]
		});
		this.bottom_row.appendChild(this.arrows_border_cont);

		this.arrow_left = new ImageButton({globals:this.globals, append_to:this.arrows_border_cont, img_src:'img/arrowleft.svg', width:'35px', btn_click_cb:this.arrow_left_cb});
		this.arrow_left.append();

		this.arrow_right = new ImageButton({globals:this.globals, append_to:this.arrows_border_cont, img_src:'img/arrowright.svg', width:'35px', btn_click_cb:this.arrow_right_cb});
		this.arrow_right.cont.style.marginLeft = `${this.global_styles['panel_margins']/2}px`;
		this.arrow_right.append();

		//////////////////////////////////////////
	}

	setText = (text) => {
		this.text_input.setText(text);
	}

	getText = () => {
		return this.text_input.getText();
	}
}
