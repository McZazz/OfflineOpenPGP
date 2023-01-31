import { makeElement, Component } from "./utils.js";
import { TextInput } from './TextInput.js'; 
import { TooltipLabel } from './TooltipLabel.js'; 

export class HorizontalTextInputWithTopLabel extends Component {
	constructor({globals=null, append_to=null, label_text=null, label_is_copy_btn=false, label_width=null}={}) {
		super({globals:globals, append_to:append_to});

		this.label_text = label_text;

		this.cont = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['marginTop', `${this.global_styles['panel_margins']}px`],
				['flexDirection', 'column'],
			]
		});

		if (!label_is_copy_btn) {
			this.label = makeElement({
				type:'div',
				attrs:[
					['innerText', this.label_text],
					['classList', 'top_labels']
				]
			});
			this.cont.appendChild(this.label);
		} else {
			this.label = new TooltipLabel({
				globals:this.globals, 
				append_to:this.cont, 
				label_text:this.label_text, 
				tooltip_text:'Copy',
				label_width:label_width,
				parent_obj:this
			});
			this.label.append();
		}

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
	}

	getText = () => {
		return this.text_input.getText();
	}
}