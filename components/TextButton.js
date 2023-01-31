import { makeElement, Component, createClassStyle } from "./utils.js";

export class TextButton extends Component {
	constructor({globals=null, append_to=null, text=null, width=null, btn_click_cb=null, parent_obj=null}={}) {
		super({globals:globals, append_to:append_to});

		this.text = text;
		this.width = width;
		this.btn_click_cb = btn_click_cb;
		this.parent_obj = parent_obj;
		this.saved_styles = {};

		this.cont = makeElement({
			type:'div',
			attrs:[
				['innerText', this.text],
				['classList', 'btn'],
			],
			style:[
				['width', this.width],
			]
		});

		this.cont.addEventListener('click', (event) => {
			this.btn_click_cb(event);
		});

	}

	setText = (text) => {
		this.cont.innerText = text;
	}

	setStyle = (style_arr) => {
		style_arr.forEach(style => {
			this.cont.style[style[0]] = style[1];
		});
	}

	setStyleAndSavePrev = ({prev_name=null, style_arr=null, attr_arr=null}={}) => {

		let saved_style = [];
		let saved_attr = [];

		if (style_arr) {
			style_arr.forEach(style => {

				let new_save = [style[0], this.cont.style[style[0]]];
				saved_style.push(new_save);

				this.cont.style[style[0]] = style[1];
			});
		}

		if (attr_arr) {
			attr_arr.forEach(attr => {

				let second = this.cont[attr[0]];

				if (second.value) {
					second = second.value;
				}

				let new_save = [attr[0], second];
				saved_attr.push(new_save);

				this.cont[attr[0]] = attr[1];
			});
		}

		let data = {
			attr:saved_attr,
			style:saved_style
		}

		this.saved_styles[prev_name] = data;
		// console.log('inside saving', this.saved_styles[prev_name]);
	}

	setPrevStyle = (name) => {
		let style = this.saved_styles[name];

		let style_arr = style['style'];
		let attr_arr = style['attr'];

		if (style_arr) {
			style_arr.forEach(style => {
				this.cont.style[style[0]] = style[1];
			});
		}

		if (attr_arr) {
			attr_arr.forEach(attr => {
				this.cont[attr[0]] = attr[1];
			});
		}
	}

	static setClassStyle = (globals) => {

		let style = 
`.btn {
	background: ${globals['global_styles']['colors']['btn1_normal']};
	height: ${globals['global_styles']['btn_height']}px;
	user-select: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: Arial;
	font-size: ${globals['global_styles']['font_size_1']}px;
	color: ${globals['global_styles']['colors']['font_1']};
}

.btn:hover {
	background: ${globals['global_styles']['colors']['btn1_hover']};
}

.btn:active {
	background: ${globals['global_styles']['colors']['btn1_active']};
}`;

		createClassStyle({globals:globals, id:'text_btn_class_style', style:style})
	}
}