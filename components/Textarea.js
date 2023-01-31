import { TooltipLabel } from "./TooltipLabel.js";
import { makeElement, appendAnimStyles, Component } from "./utils.js";

export class Textarea extends Component {
	constructor({globals=null, append_to=null, label_text=null, height=null, label_width=null, flexgrow=false, font_size=null}={}) {
		super({globals:globals, append_to:append_to});

		this.textarea_is_hovered = false;
		this.label_text = label_text;
		this.height = height;

		this.cont = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['flexDirection', 'column'],
				['marginTop', `${this.global_styles['panel_margins']}px`],
			]
		});

		this.label = new TooltipLabel({
			globals:this.globals, 
			append_to:this.cont, 
			label_text:this.label_text, 
			tooltip_text:'Copy',
			label_width:label_width,
			parent_obj:this
		});
		this.label.append();

		this.border_cont = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			],
			style:[
				// ['marginTop', `${this.global_styles['panel_margins']}px`],
				['width', '100%'],
			]
		});
		this.cont.appendChild(this.border_cont);

		if (flexgrow === false) {
			this.border_cont.style.height = this.height;
		} else {
			this.border_cont.style.height = '1px';
			this.cont.style.flexGrow = flexgrow;
			this.border_cont.style.flexGrow = flexgrow;
		}

		this.textarea = makeElement({
			type:'div', 
			attrs:[
				['classList', 'inputs_zero scrollbar'],
				['contentEditable', 'true']
			],
			style:[
				['width', '100%'], 
				['position', 'relative'], 
				['height', '100%'],
				['overflowY', 'auto'],
				['whiteSpace', 'pre'],
				['overflowX', 'hidden'],
				['padding', `${this.global_styles['panel_margins']}px`],
				['background', `${this.global_styles['colors']['btn1_normal']}`]
			]
		});
		if (font_size) {
			this.textarea.style.fontSize = font_size;
		}
		this.border_cont.appendChild(this.textarea);

		this.textarea.addEventListener('keydown', (event) => {
			
			if (event.key === 'Tab') {
				event.preventDefault();
				// let caret = this.getCaretIndex();

				document.execCommand('insertText', false, '\t');
			}

		});

		this.textarea.addEventListener('mouseover', (event) => {
			let rect = this.textarea.getBoundingClientRect();
			this.textarea_is_hovered = true;
			this.setCursor(event, this.textarea);
		});

		this.textarea.addEventListener('mousemove', (event) => {
			if (this.textarea_is_hovered) {
				this.setCursor(event, this.textarea);
			}
		});

		this.textarea.addEventListener('mouseout', () => {
			this.textarea.style.cursor = 'default'
			this.textarea_is_hovered = false;
		});

		this.textarea.addEventListener('wheel', (event) => {
			event.preventDefault();

			let scrollable_area = this.getScrollableArea(this.textarea);

			if (scrollable_area > 0) {
				let amt = 0;
	      if (event.wheelDelta > 0) {
	        amt -= this.global_styles['scroll_amt'];
	      } else {
	        amt += this.global_styles['scroll_amt'];
	    	}

				let new_top = this.textarea.scrollTop + amt;

				if (new_top > scrollable_area) {
					new_top = scrollable_area
				}
				else if (new_top < 0) {
					new_top = 0;
				}

				this.textarea.scrollTop = new_top;
			}
		});
	}


	getCaretIndex = () => {
		let selection = window.getSelection();
		if (selection.rangeCount > 0) {
			let range = selection.getRangeAt(0);
			let leading = range.cloneRange();

			leading.selectNodeContents(this.textarea);
			leading.setEnd(range.endContainer, range.endOffset);

			return leading.toString().length;
		} 
		return null;
	}


	setText = (text) => {
		this.textarea.innerText = text;
	}


	getText = () => {
		return this.textarea.innerText;
	}


	setContStyle = (style_arr) => {
		style_arr.forEach(style => {
			this.cont.style[style[0]] = style[1];
		});
	}


	getScrollableArea = (ele) => {
		if (ele.scrollHeight > ele.clientHeight) {
			return ele.scrollHeight - ele.clientHeight;
		}

		return 0;
	}


	setCursor = (event, ele) => {
		let rect = ele.getBoundingClientRect();

		let scroll = ele.scrollHeight > ele.clientHeight;

		if (scroll) {
			if (event.offsetX < rect.width - 20) {
				ele.style.cursor = 'text'
			} else {
				ele.style.cursor = 'default'
			}
		} else {
			ele.style.cursor = 'text'	
		}
	}
}