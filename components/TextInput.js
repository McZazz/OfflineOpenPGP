import { makeElement, Component, createClassStyle } from "./utils.js";

export class TextInput extends Component {
	constructor({globals=null, append_to=null}={}) {
		super({globals:globals, append_to:append_to});

		this.cont = makeElement({
			type:'input',
			attrs:[
				['classList', 'inputs']
			]
		});
	}

	static setClassStyle = (globals) => {

		let style = `
.inputs {
	color: ${globals['global_styles']['colors']['font_1']};
	background: ${globals['global_styles']['colors']['btn1_normal']};
	height: ${globals['global_styles']['btn_height']}px;
	display: flex;
	align-items: center;
	padding: 2px 0 0 5px;
	overflow: hidden;
  border: none;
}

.inputs:focus {
  outline: none;
}`;

		createClassStyle({globals:globals, id:'inputs_class_style', style:style})
	}

	setText = (text) => {
		this.cont.value = text;
	}

	getText = () => {
		return this.cont.value;
	}
}