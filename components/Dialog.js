import { makeElement, Component } from './utils.js';
import { BtnsAndLeftLabel } from './BtnsAndLeftLabel.js';
import { TitleBar } from './TitleBar.js';
import { TooltipLabel } from './TooltipLabel.js';
import { TextInput } from './TextInput.js';
import { TextButton } from './TextButton.js';
import { HorizontalTextInputWithTopLabel } from './HorizontalTextInputWithTopLabel.js';

export class Dialog extends Component {
	constructor({globals=null, append_to=null, width=null, height=null, top=null, left=null, close_callback=null, create_keyset_cb=null}={}) {
		super({globals:globals, append_to:append_to});

		this.close_callback = close_callback;
		this.create_keyset_cb = create_keyset_cb;
		this.start_top = top;
		this.start_left = left;

		this.pass_is_hidden = true;

		this.cont = makeElement({
			type:'div',
			style:[
				['minHeight', height],
				['minWidth', width],
				['display', 'flex'],
				['flexDirection', 'column'],
				['position', 'absolute'],
				['top', `${top}px`],
				['left', `${left}px`],
				['background', this.global_styles['colors']['panel_bg']],
				['boxShadow', '0 0 13px 7px #484A6030']
			]
		});

		this.header = makeElement({
			type:'div',
			style:[
				['minHeight', `${this.global_styles['title_bar_height']}px`],
				['width', '100%'],
				['display', 'flex'],
				['justifyContent', 'flex-end'],
				['background', this.global_styles['colors']['titlebar']]
			]
		});
		this.cont.appendChild(this.header);

		this.close = makeElement({
			type:'div', 
			attrs:[
				['classList', 'win_control_btn']
			],
			style:[
				['width', '37px'],
				['height', `${this.global_styles['title_bar_height']}px`],
				['backgroundImage', 'url("img/close_01.png")'],
			]
		});
		this.close.addEventListener('click', () => {
			this.close_callback();
		});
		this.header.appendChild(this.close);

		this.makeDragable(this.header);

		///////////////////////////////////////////////////////////
		this.inputs_cont = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['flexDirection', 'column'],
				['flexGrow', '1'],
				['padding', `${this.global_styles['panel_margins']}px`],
			]
		});
		this.cont.appendChild(this.inputs_cont);

		this.label = new TooltipLabel({
			globals:this.globals, 
			append_to:this.inputs_cont, 
			label_text:'Keyset Passphrase', 
			tooltip_text:'Copy',
			label_width:'145px',
			parent_obj:null
		});
		this.label.append();

		/////

		this.pass_border = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			]
		});
		this.inputs_cont.appendChild(this.pass_border);
		this.pass_input = new TextInput({globals:this.globals, append_to:this.pass_border});
		this.pass_input.cont.style.flexGrow = '1';
		this.pass_input.cont.type = 'password';
		this.pass_input.append();

		this.hide_btn = new TextButton({globals:this.globals, append_to:this.pass_border, text:'Show', width:'50px', btn_click_cb:this.showPass});
		this.hide_btn.cont.style.marginLeft = `${this.global_styles['panel_margins']/2}px`;
		this.hide_btn.append();

		this.label.parent_obj = this.pass_input;

		//////////////////////////////////////////////
		this.row = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				// ['marginTop', `${this.global_styles['panel_margins']}px`]
			]
		});
		this.inputs_cont.appendChild(this.row);

		this.name = new HorizontalTextInputWithTopLabel({
			globals:this.globals, 
			append_to:this.row, 
			label_width:'105px',
			label_text:'Keyset Name',
			label_is_copy_btn:true
		});
		this.name.append();

		this.email = new HorizontalTextInputWithTopLabel({
			globals:this.globals, 
			append_to:this.row, 
			label_width:'105px',
			label_text:'Keyset Email',
			label_is_copy_btn:true
		});
		this.email.cont.style.marginLeft = `${this.global_styles['panel_margins']/2}px`;
		this.email.append();

		////////////////////////////////////////
		this.last_row = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['flexDirection', 'column'],
				['alignItems', 'center'],
				['justifyContent', 'flex-end'],
				['flexGrow', '1'],
			]
		});
		this.inputs_cont.appendChild(this.last_row);

		this.create_btn = new BtnsAndLeftLabel({
			globals:this.globals, 
			append_to:this.last_row, 
			label_text:'Keyset', 
			btns_arr:[['Create', '100px', this.createKeyset]]
		});
		this.create_btn.setContStyle([
			['width', '190px'],
			['marginBottom', `18px`],
		]);
		this.create_btn.append();
	}

	createKeyset = () => {
		let pass = this.pass_input.getText();
		let name = this.name.getText();
		let email = this.email.getText();

		this.create_keyset_cb({
			pass:pass,
			name:name,
			email:email
		});
	}


	showPass = () => {
		// console.log('showing pass');
		if (this.pass_is_hidden) {
			this.pass_input.cont.type = 'text';
			this.hide_btn.setText('Hide');
			this.pass_is_hidden = false;
		} else {
			this.pass_input.cont.type = 'password';
			this.hide_btn.setText('Show');
			this.pass_is_hidden = true;
		}
	}

	startDragEvent = (event) => {
		this.resetBoundingRects();
		this.first_click_top_offset = event.pos.y - this.cont_size.top;
		this.first_click_left_offset = event.pos.x - this.cont_size.left;
	}

	moveDragEvent = (event) => {
		let new_top = event.pos.y - this.global_styles['title_bar_height'] - this.first_click_top_offset;
		let new_left = event.pos.x - this.first_click_left_offset;

		this.cont.style.top = `${new_top}px`;
		this.cont.style.left = `${new_left}px`;
	}

	stopDragEvent = (event) => {
		//////
	}

	resetBoundingRects = () => {
		this.cont_size = this.cont.getBoundingClientRect();
	}

}