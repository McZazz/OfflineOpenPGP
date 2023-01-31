import { makeElement, Component, createClassStyle } from "./utils.js";

export class ImageButton extends Component {
	constructor({globals=null, append_to=null, img_src=null, width=null, btn_click_cb=null}={}) {
		super({globals:globals, append_to:append_to});

		this.img_src = `url("${img_src}")`;
		// 'url("img/minimize_01.png")'
		this.width = width;
		this.btn_click_cb = btn_click_cb;

		this.cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'img_btn'],
			],
			style:[
				['width', this.width],
				['backgroundImage', this.img_src],
			]
		});

		this.cont.addEventListener('click', (event) => {
			this.btn_click_cb(event);
		});

	}

	static setClassStyle = (globals) => {

		let style = 
`.img_btn {
	background: ${globals['global_styles']['colors']['btn1_normal']};
	height: ${globals['global_styles']['btn_height']}px;
	user-select: none;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}

.img_btn:hover {
	background: ${globals['global_styles']['colors']['btn1_hover']};
	height: ${globals['global_styles']['btn_height']}px;
	user-select: none;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}

.img_btn:active {
	background: ${globals['global_styles']['colors']['btn1_active']};
		height: ${globals['global_styles']['btn_height']}px;
	user-select: none;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}`;

		createClassStyle({globals:globals, id:'text_btn_class_style', style:style})
	}
}