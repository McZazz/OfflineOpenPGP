import { makeElement, Component } from "./utils.js";
import { TextButton } from "./TextButton.js";


export class BtnsAndLeftLabel extends Component {
	constructor({globals=null, append_to=null, label_text=null, btns_arr=null, parent_obj=null}={}) {
		// btns_arr === ['Some Name', '100px', callback-fn]
		super({globals:globals, append_to:append_to});

		this.btns_map = new Map();
		this.parent_obj = parent_obj;

		this.cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			],
			style:[
				['display', 'flex'],
				['justifyContent', 'flex-end'],
			]
		});

		this.label = makeElement({
			type:'div',
			attrs:[
				['innerText', label_text]
			],
			style:[
				['flexGrow', '1'],
				['marginLeft', `-${this.global_styles['panel_margins']/2}px`],
				['display', 'flex'],
				['justifyContent', 'center'],
				['alignItems', 'center'],
				['userSelect', 'none'],
			]
		});
		this.cont.appendChild(this.label);

		this.btns_cont = makeElement({
			type:'div',
			style:[
				['height', '100%'],
				['display', 'flex'],
			]
		});
		this.cont.appendChild(this.btns_cont);

		let cntr = 0;
		btns_arr.forEach(item => {

			let label = item[0];
			let width = item[1];
			let cb = item[2];

			let btn = new TextButton({
				globals:this.globals, 
				append_to:this.btns_cont, 
				text:label, 
				width:width, 
				btn_click_cb:cb,
				parent_obj:this
			});
			if (cntr > 0) {
				btn.cont.style.marginLeft = `${this.global_styles['panel_margins']/2}px`;
			}
			btn.append();
			this.btns_map[label] = btn;

			cntr++;
		});
	}

	setContStyle = (style_arr) => {
		style_arr.forEach(prop => {
			this.cont.style[prop[0]] = prop[1];
		});
	}

	setBtnStyle = ({which=null, style_arr=null, attr_arr=null, save_prev_style_name=null}={}) => {

		if (which && (style_arr || attr_arr) && save_prev_style_name) {
			if (which in this.btns_map) {
				let btn = this.btns_map[which];
				// console.log('btn in btnsandleftlavel', btn);
				btn.setStyleAndSavePrev({prev_name:save_prev_style_name, style_arr:style_arr, attr_arr:attr_arr});
			}
		}
	}

	setPrevStyle = ({which=null, prev_name=null}={}) => {
		if (which && which in this.btns_map) {
			let btn = this.btns_map[which];
			btn.setPrevStyle(prev_name);
		}
	}
}