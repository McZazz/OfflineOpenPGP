import { makeElement, appendAnimStyles, Component } from "./utils.js";

export class Page extends Component {
	constructor({globals=null, append_to=null}={}) {
		super({globals:globals, append_to:append_to});

		this.page_minheight = '653px';
		this.leftcol_minwidth = '400px';

		this.cont = makeElement({
			type:'div',
			style:[
				['position', 'absolute'],
				['display', 'flex'],
				['padding', `${this.global_styles['panel_margins']}px`],
				['height', '100%'],
				['width', '100%'],
				['background', this.global_styles['colors']['body_bg']],
			]
		});

		///////////////////////////////////////////////////////////////

		this.left_col = makeElement({
			type:'div',
			style:[
				['display', 'flex'],
				['marginRight', `${this.global_styles['panel_margins']}px`],
				['flexDirection', 'column'],
				['minWidth', this.leftcol_minwidth],
				['width', '530px'],
				['minHeight', this.page_minheight],
				['height', '100%'],
			]
		});

		this.left_top = makeElement({
			type:'div',
			style:[
				// ['height', '70px'], //////////// delete
				['width', '100%'],
				['padding', `${this.global_styles['panel_margins']}px`],
				['marginBottom', `${this.global_styles['panel_margins']}px`],
				['background', `${this.global_styles['colors']['panel_bg']}`],
			]			
		});
		this.left_col.appendChild(this.left_top);

		this.mode_cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			]
		});
		this.left_top.appendChild(this.mode_cont);

		this.left_bot = makeElement({
			type:'div',
			style:[
				['height', '80px'],
				['width', '100%'],
				['display', 'flex'],
				['flexDirection', 'column'],
				['padding', `${this.global_styles['panel_margins']}px`],
				['flexGrow', '1'],
				['background', `${this.global_styles['colors']['panel_bg']}`],
			]			
		});
		this.left_col.appendChild(this.left_bot);

		///////////////////////////////////////////////////////////////////

		this.right_col = makeElement({
			type:'div',
			style:[
				['display', 'flex'],
				['padding', `0 ${this.global_styles['panel_margins']}px ${this.global_styles['panel_margins']}px ${this.global_styles['panel_margins']}px`],
				['flexDirection', 'column'],
				['height', '100%'],
				['minHeight', this.page_minheight],
				['minWidth', '450px'],
				['flexGrow', '1'],
				['background', `${this.global_styles['colors']['panel_bg']}`],
			]
		});

		this.cont.appendChild(this.left_col);
		this.cont.appendChild(this.right_col);
	}
}