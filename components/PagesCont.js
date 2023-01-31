import { makeElement, Component } from "./utils.js";

export class PagesCont extends Component {
	constructor({globals=null, append_to=null}={}) {

		super({globals:globals, append_to:append_to});

		this.cont = makeElement({
			type:'div', 
			style:[
				['width', '100%'], 
				['height', '100%'], 
				['position', 'relative'],
				['overflow', 'hidden']
			]
		});
	}

	getCenterCoords = () => {
		let size = this.cont.getBoundingClientRect();
		let top = size.height/2;
		let left = size.width/2;

		return {
			top:top,
			left:left
		}
	}
}