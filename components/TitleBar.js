import { makeElement, setPermStyles, appendAnimStyles, Component, createClassStyle } from "./utils.js";

export class TitleBar extends Component {
	constructor({globals=null, append_to=null}={}) {
		super({globals:globals, append_to:append_to});

		this.resize_btn_clicked = false;

		/*
		title_bar
			win_controls_cont
				win_minimize
				win_restore
				win_maximize
				win_close
		*/

		////////////////////////////////////////////////////////////////////
		// TITLE BAR
		this.cont = makeElement({
			type:'div', 
			attrs:[
				['classList', 'title_bar']
			], 
			style:[
				['display', 'flex'], 
				// ['justifyContent', 'flex-end'], 
				['alignItems', 'center'], 
				['background', this.global_styles['colors']['titlebar']], 
				['minHeight', `${this.global_styles['title_bar_height']}px`], 
				['webkitAppRegion', 'drag']
			]
		});

		if (!this.globals['is_mac']) {
			this.cont.style.justifyContent = 'flex-end';
		}


		///////////////////////////////////////////////////////////////////
		// fix for double clicks jacking up icons, both are needed or else the other fails
		nw.Window.get().on('maximize', () => {
			if (this.resize_btn_clicked === false) {
				this.maximizeToRestore();
			}
			this.resize_btn_clicked = false;
		});

		nw.Window.get().on('restore', () => {
			if (this.resize_btn_clicked === false) {
				this.restoreToMaximize();
			}
			this.resize_btn_clicked = false;
		});


		////////////////////////////////////////////////////////////////////
		// WIN CONTROLS CONT
		this.win_controls_cont = makeElement({
			type:'div', 
			style:[
				['display', 'flex'], 
				['flexDirection', 'row'], 
				['justifyContent', 'flex-end'], 
				['alignItems', 'center'], 
				['height', '100%'], 
				['webkitAppRegion', 'no-drag']
			],
			attrs:[
				['classList', 'win_controls_cont']
			]
		});
		this.cont.appendChild(this.win_controls_cont);



		////////////////////////////////////////////////////////////////////
		// MINIMIZE
		if (!this.globals['is_mac']) {

			this.win_minimize_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'win_control_btn']
				], 
				style:[
					['backgroundImage', 'url("img/minimize_01.png")'],
				]
			});
			this.win_minimize_cont.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				nw.Window.get()['minimize']();
			});
			this.win_controls_cont.appendChild(this.win_minimize_cont);

		} else {

			this.win_minimize_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'mac_btns_cont']
				]
			});
			this.win_controls_cont.appendChild(this.win_minimize_cont);

			this.win_minimize_btn = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns mac_minimize'],
					['id', 'mac_minimize']
				]
			});
			this.win_minimize_cont.appendChild(this.win_minimize_btn);

			this.win_minimize_btn_img = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns_images'],
					['id', 'mac_minimize_img']
				]
			});
			this.win_minimize_btn.appendChild(this.win_minimize_btn_img);


			this.win_minimize_btn.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				nw.Window.get()['minimize']();
			});

		}


		////////////////////////////////////////////////////////////////////
		// RESTORE
		if (!this.globals['is_mac']) {

			this.win_restore_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'win_control_btn']
				], 
				style:[
					['backgroundImage', 'url("img/restore_01.png")'],
				]
			});
			this.win_restore_cont.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				this.restoreToMaximize();
			});

		} else {
			this.win_restore_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'mac_btns_cont']
				]
			});


			this.win_restore_btn = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns mac_restore'],
					['id', 'mac_restore']
				]
			});
			this.win_restore_cont.appendChild(this.win_restore_btn);

			this.win_restore_btn_img = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns_images'],
					['id', 'mac_restore_img']
				]
			});
			this.win_restore_btn.appendChild(this.win_restore_btn_img);

			this.win_restore_btn.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				this.restoreToMaximize();
			});

		}
		

		//////////////////////////////////////////////////////////////////////////
		// MAXIMIZE
		if (!this.globals['is_mac']) {

			this.win_maximize_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'win_control_btn'],
				], 
				style:[
					['backgroundImage', 'url("img/maximize_01.png")'],
				]
			});
			this.win_maximize_cont.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				this.maximizeToRestore();
			});
			this.win_controls_cont.appendChild(this.win_maximize_cont);

		} else {

			this.win_maximize_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'mac_btns_cont'],
				]
			});
			this.win_controls_cont.appendChild(this.win_maximize_cont);

			this.win_maximize_btn = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns mac_maximize'],
					['id', 'mac_maximize']
				]
			});
			this.win_maximize_cont.appendChild(this.win_maximize_btn);

			this.win_maximize_btn_img = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns_images'],
					['id', 'mac_maximize_img']
				]
			});
			this.win_maximize_btn.appendChild(this.win_maximize_btn_img);

			this.win_maximize_btn.addEventListener('click', () => {
				this.resize_btn_clicked = true;
				this.maximizeToRestore();
			});

		}
		


		///////////////////////////////////////////////////////////////////////////////
		// CLOSE
		if (!this.globals['is_mac']) {

			this.win_close_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'win_control_btn']
				], 
				style:[
					['backgroundImage', 'url("img/close_01.png")'],
				]
			});
			this.win_close_cont.addEventListener('click', () => {
				nw.Window.get()['close']();
			});
			this.win_controls_cont.appendChild(this.win_close_cont);

		} else {

			this.win_close_cont = makeElement({
				type:'div', 
				attrs:[
					['classList', 'mac_btns_cont']
				]
			});
			this.win_controls_cont.appendChild(this.win_close_cont);

			this.win_close_btn = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns mac_close'],
					['id', 'mac_close']
				]
			});
			this.win_close_cont.appendChild(this.win_close_btn);

			this.win_close_btn_img = makeElement({
				type:'div',
				attrs:[
					['classList', 'mac_btns_images'],
					['id', 'mac_close_img']
				]
			});
			this.win_close_btn.appendChild(this.win_close_btn_img);

			this.win_close_btn.addEventListener('click', () => {
				nw.Window.get()['close']();
			});

			/// mac reorder
			this.win_controls_cont.appendChild(this.win_minimize_cont);
			this.win_controls_cont.appendChild(this.win_maximize_cont);

			// cahnge titlebar color
			this.cont.style.background = this.globals['global_styles']['colors']['panel_bg'];

		}
	}


	static setClassStyle = (globals) => {

		let style = 
`.win_control_btn:hover {
  background: ${globals['global_styles']['colors']['titlebar_btns_hover']};
}

.win_control_btn {
	min-width: 37px;
	height: 100%;
	background-repeat: no-repeat;
	background-position: center;
	image-rendering: pixelated;
}

.mac_btns_cont {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 25px;
	height: 100%;
}

.mac_btns {
  width: 14px;
  height: 14px;
  border-radius: 14px;
  overflow: hidden;
}

.mac_btns_images {
	width: 100%;
	height: 100%;
	background-repeat: no-repeat;
	background-position: center;
	image-rendering: pixelated;
}

.mac_close {
  background: rgb(246,82,84);
}

#mac_close:active {
  background: #F69B7F;
}

#mac_close_img {
	opacity: 0;
	background-image: url("img/mac_close.png");
	transition: opacity 80ms;
}

.win_controls_cont:hover #mac_close_img {
	opacity: 1;
}

.mac_minimize {
  background: rgb(249,188,77);
}

#mac_minimize:active {
  background: #E8EB87;
}

#mac_minimize_img {
	opacity: 0;
	background-image: url("img/mac_minimize.png");
	transition: opacity 80ms;
}

.win_controls_cont:hover #mac_minimize_img {
	opacity: 1;
}

.mac_maximize, .mac_restore {
  background: rgb(53,198,79);
}

#mac_maximize:active, #mac_restore:active {
  background: #6BDD82;
}

#mac_maximize_img {
	opacity: 0;
	background-image: url("img/mac_maximize.png");
	transition: opacity 80ms;
}

.win_controls_cont:hover #mac_maximize_img {
	opacity: 1;
}

#mac_restore_img {
	opacity: 0;
	background-image: url("img/mac_restore.png");
	transition: opacity 80ms;
}

.win_controls_cont:hover #mac_restore_img {
	opacity: 1;
}`;

		createClassStyle({globals:globals, id:'titlebar_class_style', style:style})
	}

	appLoadMaximizedCheck = () => {
		let screen_width = screen.availWidth;
		let screen_height = screen.availHeight;

		let window_width = window.outerWidth;
		let window_height = window.outerHeight;

		if (nw.Window.get().width >= screen_width && nw.Window.get().height >= screen_height) {
			this.maximizeToRestore();
		}
	}

	restoreToMaximize = () => {
		this.win_controls_cont.replaceChild(this.win_maximize_cont, this.win_restore_cont);
		nw.Window.get()['restore']();
	}

	maximizeToRestore = () => {
		this.win_controls_cont.replaceChild(this.win_restore_cont, this.win_maximize_cont);
		nw.Window.get()['maximize']();
	}
}




