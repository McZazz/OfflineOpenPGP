import { makeElement, Component, createClassStyle } from "./utils.js";

export class TooltipLabel extends Component {
	constructor({globals=null, append_to=null, label_text=null, tooltip_text=null, label_width=null, parent_obj=null}={}) {
		super({globals:globals, append_to:append_to});

		this.label_text = label_text;
		this.tooltip_text = tooltip_text;
		this.label_width = label_width;
		this.parent_obj = parent_obj;

		this.tooltip_showing = false;

		this.cont = makeElement({
			type:'div',
			style:[
				['paddingBottom', `${this.global_styles['panel_margins']/4}px`],
				['width', '100%'],
				['display', 'flex'],
			]
		});

		this.label = makeElement({
			type:'div',
			attrs:[
				['innerText', this.label_text],
				['classList', 'clipboard_labels'],
			],
			style:[
				['position', 'relative'],
				['cursor', 'pointer'],
  			['userSelect', 'none'],
  			['width', this.label_width],
			]
		});
		this.label.addEventListener('click', () => {
			navigator.clipboard.writeText(this.parent_obj.getText());
		});
		this.cont.appendChild(this.label);

		this.tooltip = makeElement({
			type:'div',
			attrs:[
				['innerText', this.tooltip_text],
			],
			style:[
				['position', 'absolute'],
				['display', 'flex'],
				['paddingRight', `8px`],
				['justifyContent', 'flex-end'],
				['alignItems', 'center'],
				['background', `${this.global_styles['colors']['btn1_normal']}`],
				['height', '15px'],
				['fontSize', '11px'],
				['width', '60px'],
				['left', '100%'],
				['top', '2px'],
				['clipPath', 'polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)']
			]
		});

		this.label.addEventListener('mouseover', () => {
			this.tooltip_showing = true;
			this.label.appendChild(this.tooltip);
		});

		this.label.addEventListener('mouseout', () => {
			this.removeTooltip();
		});

		this.label.addEventListener('click', () => {
			this.removeTooltip();
		});

	}

	removeTooltip = () => {
		if (this.tooltip_showing) {
			this.tooltip_showing = false;
			this.label.removeChild(this.tooltip);
		}
	}
}