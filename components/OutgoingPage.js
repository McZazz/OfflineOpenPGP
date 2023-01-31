import { 
	appendAnimStyles, 
	cleanOpenpgpPublic, 
	Component, 
	getContactsPositionFromFile, 
	makeElement, 
	openContactsFile, 
	updateContactsPositionFile,
	writeFile
} from "./utils.js";

import { Page } from "./Page.js";
import { TextButton } from "./TextButton.js";
import { BtnsAndLeftLabel } from './BtnsAndLeftLabel.js';
import { InputWithFind } from './InputWithFind.js';
import { Textarea } from './Textarea.js';
import { TextInput } from './TextInput.js';
import { TooltipLabel } from './TooltipLabel.js';
import { HorizontalTextInputWithTopLabel } from './HorizontalTextInputWithTopLabel.js';
import { encryptMessage } from '../engine/openpgp.js';
import { StatusBarManager } from '../engine/StatusBarManager.js';

export class OutgoingPage extends Page {
	constructor({globals=null, append_to=null,  position=null, display_contact=null}={}) {
		super({globals:globals, append_to:append_to});


		this.position = position;
		this.display_contact = display_contact;
		this.left_col.style.minWidth = '400px';

		this.delete_state = 'Delete';
		this.update_state = 'Update';
		this.new_state = 'New';

		//////////////

		this.mode_btn = new TextButton({globals:this.globals, append_to:this.mode_cont, text:'Current Mode: Outgoing', width:'190px', btn_click_cb:this.toggleModes});
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

		this.globals['status_outgoing'] = new StatusBarManager(globals, this.status);


		//////////////////////////////////////////////////////////
		let contact_btns = [
			['New', '100px', this.newPressed],
			['Update', '100px', this.updatePressed],
			['Delete', '100px', this.deletePressed]
		]
		this.contact_btns_row = new BtnsAndLeftLabel({
			globals:this.globals, 
			append_to:this.left_bot, 
			label_text:'Contact', 
			btns_arr:contact_btns
		});
		this.contact_btns_row.append();

		/////////////////////////////////////////////////////
		this.contact_name = new InputWithFind({
			globals:this.globals, 
			append_to:this.left_bot, 
			find_cb:this.findContact, 
			arrow_left_cb:this.arrowLeft, 
			arrow_right_cb:this.arrowRight,
			label_text:'Contact Name',
			label_width:'113px'
		});
		this.contact_name.append();

		this.public_key = new Textarea({
			globals:globals, 
			append_to:this.left_bot, 
			label_text:'Public Key', 
			flexgrow:'1',
			label_width:'87px',
			font_size:`${this.global_styles['keys_font_size']}px`
		});
		this.public_key.textarea.style.fontFamily = 'Monospace';
		this.public_key.append();

		if (this.display_contact) {
			this.displayContact(this.display_contact);
		}

		/////////////////////////////////////////////////////////////////////////////////////////////////
		// right
		////////////////////////////////////////////////////////////////////


		this.outgoing_message = new Textarea({
			globals:globals, 
			append_to:this.right_col, 
			label_text:'Outgoing Message', 
			label_width:'140px',
			flexgrow:'1'
		});
		this.outgoing_message.append();



		this.decrypt_row = makeElement({
			type:'div',
			style:[
				['width', '100%'],
				['display', 'flex'],
				['flexDirection', 'column'],
				['paddingTop', `${this.global_styles['panel_margins']}px`],
			]
		});
		this.right_col.appendChild(this.decrypt_row);




		this.encrypted_label = new TooltipLabel({
			globals:this.globals, 
			append_to:this.decrypt_row, 
			label_text:'Encrypted Outgoing Message', 
			tooltip_text:'Copy',
			label_width:'215px',
			parent_obj:this.encrypted_input // reset later
		});
		this.encrypted_label.append();



		this.decrypt_bottom_row = makeElement({
			type:'div',
			style:[
				['display', 'flex'],
				['justifyContent', 'flex-end'],
			]
		});
		this.decrypt_row.appendChild(this.decrypt_bottom_row);

		this.decrypt = new BtnsAndLeftLabel({
			globals:this.globals, 
			append_to:this.decrypt_bottom_row, 
			label_text:'Process', 
			btns_arr:[['Encrypt', '80px', this.encrypt]]
		});
		this.decrypt.setContStyle([
			['width', '175px'],
			['marginRight', `${this.global_styles['panel_margins']/2}px`],
		]);
		this.decrypt.append();


		this.input_border = makeElement({
			type:'div',
			attrs:[
				['classList', 'border_cont']
			],
			style:[
				['flexGrow', '1']
			]
		});
		this.decrypt_bottom_row.appendChild(this.input_border);

		///////////////
		this.encrypted_input = new TextInput({globals:globals, append_to:this.input_border});
		this.encrypted_input.cont.style.flexGrow = '1';
		/////////////////////////


		this.encrypted_input.append();

		this.encrypted_label.parent_obj = this.encrypted_input;

		/////////////////////////////////////////////

	}


	static construct = async ({globals=null, append_to=null}={}) => {

		let position = await getContactsPositionFromFile(globals);
		let {contacts, path} = await openContactsFile(globals);

		let display_contact = null;

		if (contacts.length > 0) {
			display_contact = contacts[position];
		}

		return new OutgoingPage({globals:globals, append_to:append_to, position:position, display_contact:display_contact});
	}

	displayContact = (display_contact) => {
		this.contact_name.setText(display_contact.name);
		this.public_key.setText(display_contact.public);
	}

	toggleModes = () => {
		if (this.delete_state === 'Delete!' || this.new_state === 'Save!') {
			this.setDeleteToInactive();
		}
		// console.log('toggle mode');
		// this.globals[]
		this.globals['incoming_page'].append();
	}

	findContact = async () => {
		// console.log('find contact');
		if (this.delete_state === 'Delete!') {
			this.setDeleteToInactive();
		}

		let find_name = this.contact_name.getText();

		if (find_name !== this.display_contact.name) {

			let found = false;
			let cntr = 0;
			let { contacts, path } = await openContactsFile(this.globals);

			contacts.every(contact => {
				if (find_name === contact.name) {
					// console.log('found it');
					this.position = cntr;
					this.display_contact = contact;

					found = true;

					return false;
				}

				cntr++;
				return true;
			});

			if (found) {
				this.globals['status_outgoing'].displayText('Status: Contact found');
				await updateContactsPositionFile(this.globals, this.position);
			} else {
				this.globals['status_outgoing'].displayText('Status: Contact not found');
			}
			// couldn't find it, reset, or, set to new one
			this.displayContact(this.display_contact);
		} else {
			this.globals['status_outgoing'].displayText('Status: Contact currently displayed');
		}

	}

	contactLeft = () => {
		// console.log('contact left');
	}

	contactRight = () => {
		// console.log('contact right');
	}

	deletePressed = () => {
		if (this.delete_state === 'Delete') {

			// set delete button to Delete! state
			this.delete_state = 'Delete!';
			this.contact_btns_row.setBtnStyle({
				which:'Delete', 
				attr_arr:[['innerText', 'Delete!'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'Delete'
			});

			// set Update button to Cancel state
			this.update_state = 'Cancel';
			this.contact_btns_row.setBtnStyle({
				which:'Update', 
				attr_arr:[['innerText', 'Cancel'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'Update'
			});

			// set new button to grayed state
			this.new_state = 'grayed';
			// console.log('waht', this.contact_btns_row.btns_map);
			this.contact_btns_row.setBtnStyle({
				which:'New', 
				attr_arr:[['classList', 'btn grayed_btn']],
				save_prev_style_name:'New'
			});

		} else {
			if (this.delete_state !== 'grayed') {
				
				this.setDeleteToInactive();
				this.deleteContact();
			}
		}
	}

	setDeleteToInactive = ({reset_fields=true}={}) => {
		// set delete btn to Delete state
		this.delete_state = 'Delete';
		this.contact_btns_row.setPrevStyle({which:'Delete', prev_name:'Delete'});

		// set delete btn to Delete state
		this.new_state = 'New';
		this.contact_btns_row.setPrevStyle({which:'New', prev_name:'New'});

		// set delete btn to Delete state
		this.update_state = 'Update';
		this.contact_btns_row.setPrevStyle({which:'Update', prev_name:'Update'});

		// reset data just in case
		if (reset_fields) {
			this.displayContact(this.display_contact);
		}
	}

	deleteContact = async () => {


		let name = this.display_contact.name;
		// console.log(0, 'whats a name', name);

		if (name !== '') {
			// console.log(1);

			// console.log('delete contact');

			let { contacts, path } = await openContactsFile(this.globals);
			let new_arr = [];

			contacts.forEach(obj => {
				if (obj.name !== name) {
					new_arr.push(obj);
				}
			});

			// console.log('after removal', new_arr);

			this.position--;

			if (this.position === -1) {	
				this.position = new_arr.length - 1;
				if (this.position === -1) {
					this.position = 0;
				}
			}

			// console.log(this.position, new_arr);

			if (new_arr.length > 0) {
				// console.log(2);
				this.display_contact = new_arr[this.position];
				this.displayContact(this.display_contact);
			} else {
				// console.log(3);
				this.display_contact = {name:'', public:''};
				this.displayContact(this.display_contact);
			}



			this.globals['status_outgoing'].displayText('Status: Contact deleted');
			await updateContactsPositionFile(this.globals, this.position);
			await writeFile({path:path, json_str:JSON.stringify(new_arr)});

			

		} else {
			this.globals['status_outgoing'].displayText('Status: Nothing to delete');
			this.position = 0;
			await updateContactsPositionFile(this.globals, this.position);

		}

		// if (name !== '') {
		// 	delete contacts[name];
		// 	this.display_contact = null;

		// }
	}

	updatePressed = () => {
		// console.log('update contact');
		if (this.update_state === 'Update') {

			// set delete button to Delete! state
			this.new_state = 'Cancel';
			this.contact_btns_row.setBtnStyle({
				which:'New', 
				attr_arr:[['innerText', 'Cancel'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'New'
			});

			// set delete button to Delete! state
			this.update_state = 'Update!';
			this.contact_btns_row.setBtnStyle({
				which:'Update', 
				attr_arr:[['innerText', 'Update!'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'Update'
			});

			// set new button to grayed state
			this.delete_state = 'grayed';
			this.contact_btns_row.setBtnStyle({
				which:'Delete', 
				attr_arr:[['classList', 'btn grayed_btn']],
				save_prev_style_name:'Delete'
			});

		} 
		else if (this.update_state === 'Update!') {
			this.globals['status_outgoing'].displayText('Status: Contact updated');
			this.newContact({is_update:true});
			this.setDeleteToInactive({reset_fields:false});
		}	else {
			this.setDeleteToInactive();
		}
	}

	newPressed = () => {

		if (this.new_state === 'New') {

			// set delete button to Delete! state
			this.new_state = 'Save';
			this.contact_btns_row.setBtnStyle({
				which:'New', 
				attr_arr:[['innerText', 'Save!'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'New'
			});

			// set delete button to Delete! state
			this.update_state = 'Cancel';
			this.contact_btns_row.setBtnStyle({
				which:'Update', 
				attr_arr:[['innerText', 'Cancel'], ['classList', 'btn delete_btn_warning']], 
				save_prev_style_name:'Update'
			});

			// set new button to grayed state
			this.delete_state = 'grayed';
			this.contact_btns_row.setBtnStyle({
				which:'Delete', 
				attr_arr:[['classList', 'btn grayed_btn']],
				save_prev_style_name:'Delete'
			});

			// empty out
			this.contact_name.setText('');
			this.public_key.setText('');
		}
		else if (this.new_state === 'Save') {
			let name = this.contact_name.getText();
			let public_key = this.public_key.getText();

			if (name !== '' && public_key !== '') {
				
				this.newContact();
				this.setDeleteToInactive({reset_fields:false});
			} else {
				this.globals['status_outgoing'].displayText('Status: Missing info, contact not created');
			}
		}
		else if (this.new_state === 'Cancel') {
			this.setDeleteToInactive();	
		}

	}

	newContact = async ({is_update=false}={}) => {
		// console.log('new contact');

		let name = this.contact_name.getText();
		let public_key = this.public_key.getText();

		// console.log('this.position', this.position);

		if (name !== '' && public_key !== '') {
			let { contacts, path } = await openContactsFile(this.globals);
			// console.log('getting contacts', contacts);

			public_key = cleanOpenpgpPublic(public_key);

			let update_arr = [];
			let new_contact_arr = [];

			// make sure we aren't overwriting
			let name_already_exists = false;

			let cntr = 0;
			contacts.every(obj => {
				let curr_name = obj.name;

				if (is_update) {
					if (this.display_contact.name === curr_name) {
						name_already_exists = true;
						update_arr.push({name:name, public:public_key});
					} else {
						update_arr.push(obj);
					}
				} else {
					if (name === curr_name) {
						name_already_exists = true;
						return false;
					} 

					new_contact_arr.push(obj);

					if (cntr === this.position) {

						// add the new one after the curr one
						new_contact_arr.push({name:name, public:public_key});
					}

					cntr++;
				}

				return true;
			});

			// console.log('update arr', update_arr);
			// console.log('new contact arr', new_contact_arr);

			if (!name_already_exists && !is_update) {
				// adding new
				this.display_contact = {
					name:name,
					public:public_key
				}

				// just in case it's the first one
				if (cntr === 0) {
					new_contact_arr.push(this.display_contact);
					this.position = 0;
				} else {
					this.position++;
				}

				// console.log(this.display_contact);

				// save data

				this.globals['status_outgoing'].displayText('Status: Contact saved');

				await updateContactsPositionFile(this.globals, this.position);
				await writeFile({path:path, json_str:JSON.stringify(new_contact_arr)});

			} 

			if (name_already_exists && !is_update) {
				this.globals['status_outgoing'].displayText('Status: Contact already exists, make new name');
			}

			if (is_update && name_already_exists) {

				this.display_contact = {
					name:name,
					public:public_key
				}
				// console.log('going into dsplay', this.display_contact);
				// adding updated one
				await writeFile({path:path, json_str:JSON.stringify(update_arr)});
			}

		} else {
			// console.log('doing nothing with new');
		}

	}

	incrementLeftRight = async (direction) => {
		if (this.delete_state === 'Delete!' || this.new_state === 'Save!') {
			this.setDeleteToInactive();
		}
		// direction === 'l' or 'r'
		let {contacts, path} = await openContactsFile(this.globals);

		if (contacts.length > 1) {
			if (direction === 'r') {
				if (this.position + 1 === contacts.length) {
					this.position = 0;
				} else {
					this.position++;
				}
			} else {
				if (this.position - 1 === -1) {
					this.position = contacts.length - 1;
				} else {
					this.position--;
				}
			}

			let new_contact = contacts[this.position];
			this.display_contact = new_contact;
			this.displayContact(new_contact);
			await updateContactsPositionFile(this.globals, this.position);
		}
		else if (contacts.length === 0) {
			this.position = 0;
			updateContactsPositionFile(this.globals, this.position);
		}
	}

	arrowLeft = () => {
		this.incrementLeftRight('l');
	}

	arrowRight = async () => {
		this.incrementLeftRight('r');
	}

	encrypt = async () => {
		// this.globals['statusbar_outgoing'].displayText(`Status: Password incorrect`);
		if (this.delete_state === 'Delete!' || this.new_state === 'Save!') {
			this.setDeleteToInactive();
		}
		let text = this.outgoing_message.getText();

		if (text !== '') {
			let key = this.display_contact.public
			let encrypted = await encryptMessage({message:text, publicKey:key});

			if (encrypted !== null) {
				encrypted = encrypted.replaceAll('\n', ' ');
				this.encrypted_input.setText(encrypted);
				this.globals['status_outgoing'].displayText('Status: Encryption success');
			} else {
				this.globals['status_outgoing'].displayText('Status: Encryption error, public key is malformed');
				this.encrypted_input.setText('');
			}
		} else {
			this.globals['status_outgoing'].displayText('Status: Nothing to encrypt');
			this.encrypted_input.setText('');
		}
	}
}
