import { makeElement, Component, tonOfText } from "./utils.js";
import { ScrollBar } from './ScrollBar.js';

export class TextScroll extends Component {
	constructor({globals=null, append_to=null, scroll_side=null, start_block_length=null, end_block_length=null, test_contents=false}={}) {
		super({globals:globals});

		this.scroll_side = scroll_side;

		this.scroll_drawer_padding = this.global_styles['panel_margins'];

		this.cont = makeElement({
			type:'div', 
			style:[
				['display', 'flex'], 
				['width', '100%'], 
				['height', '100%']
			]
		});

		this.scroll_cont = makeElement({
			type:'div', 
			style:[
				['display', 'flex'], 
				['position', 'relative'], 
				['height', '100%'], 
				['flexGrow', '1'], 
				['overflow', 'hidden']
			]
		});

		this.scroll_drawer = makeElement({
			type:'div', 
			attrs:[
				['classList', 'inputs_zero scrollbar'],
				['contentEditable', 'true']
			],
			style:[
				['position', 'absolute'], 
				['width', '100%'], 
				['minHeight', '100%'],
				['padding', `${this.scroll_drawer_padding}px`]
			]
		});

		this.cont.appendChild(this.scroll_cont);
		this.scroll_cont.appendChild(this.scroll_drawer);

		this.scroll = new ScrollBar({
			globals: globals,
			scroll_drawer_padding:this.scroll_drawer_padding,
			end_blocks: true,
			start_block_length: `${this.scroll_drawer_padding}px`,
			end_block_length: `${this.scroll_drawer_padding}px`,
			side: this.scroll_side,
			track_thickness: '20px',
			// track_styles: [['background', '#455071']], 
			container: this.cont,
			container_class: this,
			scroll_cont: this.scroll_cont,
			scroll_drawer: this.scroll_drawer,
			test_contents:test_contents,
			anim_styles: {
				bar_normal: `${this.global_styles['colors']['panel_bg']}`,
				bar_hover: `${this.global_styles['colors']['panel_bg']}`,
				bar_active: `${this.global_styles['colors']['panel_bg']}`
			}
		});

		this.scroll.setBarStyles([['width', `${this.global_styles['panel_margins']}px`], ['left', `${this.global_styles['panel_margins']/2}px`]]);


		this.scroll_drawer.addEventListener('keydown', () => {
			this.scroll.screenResizeUpdate();
			// this.correctScrollPos();		
			// this.resetBoundingRects();
		});

		this.scroll_drawer.addEventListener('click', () => {
			// this.resetBoundingRects();
		})

	}

	setBarStyles = (styles_arr) => {
		this.scroll.setBarStyles(styles_arr);
	}

	resetBoundingRects = () => {
		this.cont_size = this.cont.getBoundingClientRect();
		this.scrolldrawer_size = this.scroll_drawer.getBoundingClientRect();
	}

	correctScrollPos = () => {
		let focus = window.getSelection();
		this.scroll.screenResizeUpdate();
		if (focus) {
    	let range = focus.getRangeAt(0);

    	if (range) {
    		let rect = range.getClientRects()[0];

    		if (rect) {
					// this.scroll.resetBoundingRects();
    			// console.log('rect', rect.top, rect.bottom, 'scrollcont', this.scroll.container_size.top, this.scroll.container_size.bottom, 'scroll', this.scroll.scrolldrawer_size.top, this.scroll.scrolldrawer_size.bottom, 'prevbot', this.prev_drawer_bot);
    			// console.log('rect', rect.top, rect.bottom, 'scrollcont', this.cont.getBoundingClientRect().top, this.cont.getBoundingClientRect().bottom, 'scroll', this.scroll_drawer.getBoundingClientRect().top, this.scroll_drawer.getBoundingClientRect().bottom, 'prev top:', this.scrolldrawer_size.top);

    		}
    	}
		}
	}




}




	