import { 
	makeElement, 
	appendAnimStyles, 
	Component, 
	readFile, 
	writeFile, 
	openSettingsJson, 
	getSelfKeysPositionFromFile, 
	openSelfKeysFile, 
	updateSelfKeysPositionFile,
	POSITION_DEFAULT,
	cleanOpenpgpPublic,
	cleanOpenpgpMessage
} from './utils.js';

import { Page } from './Page.js';
import { TextButton } from './TextButton.js';
// import { TextScroll } from "./TextScroll.js";
import { InputWithFind } from './InputWithFind.js';
// import { ScrollBar } from "./ScrollBar.js";
import { Textarea } from './Textarea.js';
import { HorizontalTextInputWithTopLabel } from './HorizontalTextInputWithTopLabel.js';
import { BtnsAndLeftLabel } from './BtnsAndLeftLabel.js';
import { Dialog } from './Dialog.js';
import { generateKeys, encryptMessage, decryptMessage } from '../engine/openpgp.js';
import { StatusBarManager } from '../engine/StatusBarManager.js';

export class IncomingPage extends Page {
	constructor({globals=null, append_to=null, position=null, display_keyset=null}={}) {
		super({globals:globals, append_to:append_to});

		this.mode_btn = new TextButton({globals:this.globals, append_to:this.mode_cont, text:'Current Mode: Incoming', width:'190px', btn_click_cb:this.toggleModes});
		this.mode_btn.append();

		this.mode_cont.style.flexDirection = 'column';
		this.mode_cont.style.alignItems = 'center';

		this.status = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['height', `${this.global_styles['btn_height'] - this.global_styles['panel_margins']}px`],
				['marginTop', `${this.global_styles['panel_margins']/2}px`],
				['display', 'flex'],
				['userSelect', 'none'],
				['alignItems', 'center'],
			],
			attrs:[
				['innerText', 'Status: Ready']
			]
		});
		this.mode_cont.appendChild(this.status);

		this.globals['status_incoming'] = new StatusBarManager(globals, this.status);

		////////////////////////////////////////////////////////////

		// console.log('position', position, 'displaykeyset', display_keyset);
		this.position = position;
		this.display_keyset = display_keyset;
		this.public_is_hover = false;
		this.new_dialog = null;

		this.delete_state = 'Delete'; // delete, delete!, cancel
		this.new_state = 'New'; // new, cancel

		//////////////////////////////////////////////////////////
		let keyset_btns_arr = [
			['New', '100px', this.newKeyset],
			['Delete', '100px', this.deletePressed]
			// ['Delete', '100px', this.deleteKeyset]
		]
		this.keyset_btns_row = new BtnsAndLeftLabel({
			globals:this.globals, 
			append_to:this.left_bot, 
			label_text:'Keyset', 
			btns_arr:keyset_btns_arr
		});
		this.keyset_btns_row.append();


		////////////////////////////////////////////////////////////
		this.keyset_name_row = new InputWithFind({
			globals:this.globals, 
			append_to:this.left_bot, 
			find_cb:this.findKeyset, 
			arrow_left_cb:this.arrowLeftSelfKeyset, 
			arrow_right_cb:this.arrowRightSelfKeyset,
			label_text:'Keyset Name',
			label_width:'106px'
		});
		this.keyset_name_row.append();


		////////////////////////////////


		this.public_text = new Textarea({
			globals:globals, 
			append_to:this.left_bot, 
			label_text:'Public Key', 
			flexgrow:'1',
			label_width:'87px',
			font_size:`${this.global_styles['keys_font_size']}px`
		});
		this.public_text.textarea.style.fontFamily = 'Monospace';
		this.public_text.append();

		this.private_text = new Textarea({
			globals:globals, 
			append_to:this.left_bot, 
			label_text:'Private Key', 
			flexgrow:'1',
			label_width:'92px',
			font_size:`${this.global_styles['keys_font_size']}px`
		});
		this.private_text.textarea.style.fontFamily = 'Monospace';
		this.private_text.append();

		if (this.display_keyset) {
			this.displaySelfKeys(this.display_keyset.name, this.display_keyset.public, this.display_keyset.private);
		}


		//////////////////////////////////////////
		this.encrypted_incoming = new HorizontalTextInputWithTopLabel({
			globals:this.globals, 
			append_to:this.right_col, 
			label_width:'213px',
			label_text:'Encrypted Incoming Message',
			label_is_copy_btn:true
		});
		this.encrypted_incoming.append();

		/////////////////////////////////////
		this.pass_row = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
			]
		});
		this.right_col.appendChild(this.pass_row);

		this.passphrase = new HorizontalTextInputWithTopLabel({
		 	globals:this.globals, 
		 	append_to:this.pass_row, 
		 	label_text:'Keyset Passphrase', 
		 	label_is_copy_btn:true, 
		 	label_width:'150px'
		 });
		this.passphrase.cont.style.flexGrow = '1';
		this.passphrase.append();

		this.decrypt_padding = makeElement({
			type:'div',
			style:[
				['display', 'flex'],
				['flexDirection', 'column'],
				['justifyContent', 'flex-end'],
			]
		});
		this.pass_row.appendChild(this.decrypt_padding);

		this.decrypt = new BtnsAndLeftLabel({
			globals:this.globals, 
			append_to:this.decrypt_padding, 
			label_text:'Process', 
			btns_arr:[['Decrypt', '100px', this.decrypt]]
		});
		this.decrypt.setContStyle([
			['width', '190px'],
			['marginLeft', `${this.global_styles['panel_margins']/2}px`],
		]);
		this.decrypt.append();

		/////////////////////////////////////////////////////

		this.decrypted_text = new Textarea({
			globals:globals, 
			append_to:this.right_col, 
			label_text:'Decrypted Incoming Message', 
			label_width:'215px',
			flexgrow:'1'
		});
		this.decrypted_text.append();
	}

	static construct = async ({globals=null, append_to=null}={}) => {
		let position = await getSelfKeysPositionFromFile(globals);
		let display_keyset = await openSelfKeysFile(globals);

		// console.log('aaaaaaaaaaaaaaaa', display_keyset);

		if (display_keyset['self_keys'].length > 0) {
			display_keyset = display_keyset['self_keys'][position];
		} else {
			display_keyset = null;
		}

		return new IncomingPage({globals:globals, append_to:append_to, position:position, display_keyset:display_keyset});
	}

	findKeyset = async () => {
		if (this.delete_state === 'Delete!') {
			this.setDeleteToInactive();
		}

		let find_name = this.keyset_name_row.getText();

		if (find_name !== this.display_keyset.name) {
			// console.log('looking...');

			let found = false;
			let cntr = 0;
			let {self_keys, path} = await openSelfKeysFile(this.globals);

			self_keys.every(obj => {
				if (find_name === obj.name) {
					// console.log('found it');
					this.position = cntr;
					this.display_keyset = obj;

					found = true;

					return false;
				}

				cntr++;
				return true;
			});

			if (found) {
				this.globals['status_incoming'].displayText('Status: Keyset found');
				await updateSelfKeysPositionFile(this.globals, this.position);
			} else {
				this.globals['status_incoming'].displayText('Status: Keyset not found');
			}
			// couldn't find it, reset, or, set to new one
			this.displaySelfKeys(this.display_keyset.name, this.display_keyset.public, this.display_keyset.private);
		} else {
			this.globals['status_incoming'].displayText('Status: Keyset currently displayed');
		} 

	}

	deletePressed = () => {
		if (this.delete_state === 'Delete') {

			window.requestAnimationFrame(() => {
				// set delete button to Delete! state
				this.delete_state = 'Delete!';
				this.keyset_btns_row.setBtnStyle({
					which:'Delete', 
					attr_arr:[['innerText', 'Delete!'], ['classList', 'btn delete_btn_warning']], 
					save_prev_style_name:'Delete'
				});

				// set new button to Cancel state
				this.new_state = 'Cancel';
				this.keyset_btns_row.setBtnStyle({
					which:'New', 
					attr_arr:[['innerText', 'Cancel'], ['classList', 'btn delete_btn_warning']], 
					save_prev_style_name:'New'
				});
			});
			
		} else {
			window.requestAnimationFrame(() => {
				this.setDeleteToInactive();
				this.deleteKeyset();
			});
		}
	}

	setDeleteToInactive = () => {
		// set delete btn to Delete state
		this.delete_state = 'Delete';
		this.keyset_btns_row.setPrevStyle({which:'Delete', prev_name:'Delete'});

		// set delete btn to Delete state
		this.new_state = 'New';
		this.keyset_btns_row.setPrevStyle({which:'New', prev_name:'New'});

		// reset data just in case
		this.displaySelfKeys(this.display_keyset.name, this.display_keyset.public, this.display_keyset.private);
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

	findSelfKeyset = () => {
		// console.log('find self keyset');
	}

	incrementLeftRight = async (direction) => {
		if (this.new_state === 'Cancel') {
			this.setDeleteToInactive();
		}
		// direction === 'l' or 'r'
		let {self_keys, path} = await openSelfKeysFile(this.globals);



		if (self_keys.length > 1) {
			if (direction === 'r') {
				if (this.position + 1 === self_keys.length) {
					this.position = 0;
				} else {
					this.position++;
				}
			} else {
				if (this.position - 1 === -1) {
					this.position = self_keys.length - 1;
				} else {
					this.position--;
				}
			}

			let new_keys = self_keys[this.position];
			this.display_keyset = new_keys;
			this.displaySelfKeys(new_keys.name, new_keys.public, new_keys.private);
			await updateSelfKeysPositionFile(this.globals, this.position);
		}
		else if (self_keys.length === 0) {
			this.position = 0;
			updateSelfKeysPositionFile(this.globals, this.position);
		}
	}

	arrowLeftSelfKeyset = () => {
		this.incrementLeftRight('l');
	}

	arrowRightSelfKeyset = async () => {
		this.incrementLeftRight('r');
	}

	toggleModes = () => {
		// console.log('toggle mode');
		if (this.new_state === 'Cancel') {
			this.setDeleteToInactive();
		}

		this.closeDialog();
		this.globals['outgoing_page'].append();
	}

	decrypt = async () => {
		if (this.new_state === 'Cancel') {
			this.setDeleteToInactive();
		}

		let passphrase = this.passphrase.getText();
		let encrypted_text = cleanOpenpgpMessage(this.encrypted_incoming.getText());

		// console.log(this.display_keyset.private);

		let decrypted = await decryptMessage({
			passphrase:passphrase, 
			privateKeyEncrypted:this.display_keyset.private, 
			encryptedMessage:encrypted_text,
			globals:this.globals
		});
		this.decrypted_text.setText(decrypted);
	}

	closeDialog = () => {
		if (this.new_dialog) {
			this.globals['pages_cont'].cont.removeChild(this.new_dialog.cont);
			this.new_dialog = null;
		}
	}

	newKeyset = () => {

		if (this.new_state === 'New') {
			if (this.new_dialog === null) {
				let width = 600;
				let height = 275;

				let center_coords = this.globals['pages_cont'].getCenterCoords();

				this.new_dialog = new Dialog({
					globals:this.globals, 
					append_to:this.globals['pages_cont'].cont, 
					width:`${width}px`, 
					height:`${height}px`, 
					top:center_coords.top - (height/2), 
					left:center_coords.left - (width/2),
					close_callback:this.closeDialog,
					create_keyset_cb:this.createKeyset
				});

				this.new_dialog.append();
			}
		}
		else if (this.new_state === 'Cancel') {
			this.setDeleteToInactive();
		}


	}

	displaySelfKeys = (name, public_key, private_key) => {
		this.keyset_name_row.setText(name);
		this.public_text.setText(public_key);
		this.private_text.setText(private_key);
	}



	createKeyset = async (user_data) => {
		try {

			/// get self_keys file
			let {self_keys, path} = await openSelfKeysFile(this.globals);

			let new_arr = [];
			let already_exists = false;

			let cntr = 0;
			let new_pos = 0;

			let keys = await generateKeys({passphrase:user_data.pass, name:user_data.name, email:user_data.email});
			// console.log('create keys', user_data, keys);

			let new_keyset = {
				email:user_data.email,
				name:user_data.name,
				private:keys.privateKey,
				public:keys.publicKey,
				revoke:keys.revocationCertificate
			}

			// check names for copy
			self_keys.every(obj => {
				if (obj.name === user_data.name) {
					already_exists = true;
					this.globals['status_incoming'].displayText('Status: Name already exists, new keyset not created');
					return false;
				}

				new_arr.push(obj);

				if (this.position === cntr) {	

					new_pos = cntr + 1;

					this.display_keyset = new_keyset;

					// add to it
					new_arr.push(this.display_keyset);
				}

				cntr++;
				return true;
			});


			if (!already_exists) {

				// in cases of first keyset
				if (cntr === 0) {
					new_arr.push(new_keyset);
					this.display_keyset = new_keyset;
				}

				// display it
				this.displaySelfKeys(user_data.name, keys.publicKey, keys.privateKey);
				this.globals['status_incoming'].displayText('Status: Keyset created');
				// save it
				this.position = new_pos;
				updateSelfKeysPositionFile(this.globals, this.position);
				await writeFile({path:path, json_str:JSON.stringify(new_arr)});
			}

		} catch(err) {
			this.globals['status_incoming'].displayText('Status: Error, keyset not created');
			// console.log('error in create keyset');
		}
	}

	saveKeyset = () => {
		// console.log('save keyset');
	}

	deleteKeyset = async () => {
		// console.log('delete keyset');
		let {self_keys, path} = await openSelfKeysFile(this.globals);


		if (self_keys.length > 0) {
			let new_arr = [];

			let cntr = 0;
			self_keys.forEach(item => {
				if (cntr !== this.position) {
					new_arr.push(item);
				}
				cntr++;
			});

			this.position--;

			if (new_arr.length > 0) {
				if (this.position === -1) {	
					this.position = new_arr.length-1;
				}
				if (this.position < 0) {
					this.position = 0;
				}
				// set prev
				let new_display = new_arr[this.position];
				this.display_keyset = new_display;
				// console.log('whaaaat', this.display_keyset);
				this.displaySelfKeys(new_display.name, new_display.public, new_display.private);
			} else {
				// delete all since nothng is left
				this.display_keyset = {
					email:'',
					name:'',
					private:'',
					public:'',
					revoke:''
				}
				this.displaySelfKeys('', '', '');
			}

			if (this.position < 0) {
				this.position = 0;
			}
			this.globals['status_incoming'].displayText('Status: Deleted keyset');
			updateSelfKeysPositionFile(this.globals, this.position);
			// save it
			await writeFile({path:path, json_str:JSON.stringify(new_arr)});
		} else {
			this.globals['status_incoming'].displayText('Status: Error, Nothing to delete');
			this.position = 0;
			updateSelfKeysPositionFile(this.globals, this.position);
		}
	}
}