import { global_styles } from './global_styles.js';
import { GlobalScreenResizeUpdater } from './global_screen_resize_updater.js';
import { GlobalDragListener } from './GlobalDragListener.js';
import { AnimLoop } from '../engine/AnimLoop.js';
import { StatusBarManager } from '../engine/StatusBarManager.js';

const existsSync = nw.require('fs').existsSync;
const mkdir = nw.require('fs').mkdir;

export const makeElement = ({
															type=''/*String of html tag type*/, 
															attrs=[]/*[['id', 'stuff'], ['classList', 'notbootstrap']]*/, 
															style=[]/*[['backgroundColor', '#334455'], ['fontFamily', 'Ariel']]*/
														}={}) => {

	let result = document.createElement(type);

	attrs.forEach((prop) => {
		result[prop[0]] = prop[1]; 
	});

	result = setPermStyles(result, style);

	return result; // Node
}


export const setPermStyles = (element/*Node*/, style/*[['backgroundColor', '#334455'], ['fontFamily', 'Ariel']]*/) => {

	style.forEach((item) => {
		element.style[item[0]] = item[1]; 
	});

	return element; // Node
}

export const appendAnimStyles = (id/*String*/, style/*'#stuff:hover {background-color: red;}'*/) => {

	let result = document.createElement('style');
	result.id = id;

	result.textContent = style;

	document.head.appendChild(result)
}

export const createClassStyle = ({globals=null, id=null/*String*/, style=null/*'#stuff:hover {background-color: red;}'*/}={}) => {

	let result = document.createElement('style');
	result.id = id;

	result.textContent = style;

	document.head.appendChild(result);
	globals['class_styles'][id] = result;
}

export const appendMultiple = (cont, children) => {
	children.forEach(child => {
		cont.appendChild(child);
	});
}

export const randRangeInc = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const hasKey = (key, obj) => {
	if (obj && key in obj) {
		return true;
	} else {
		return false;
	}
}

export const readFile = async (path) => {
  const readFile = nw.require('fs/promises').readFile;

  try {
    const result = await readFile(path, { encoding: 'utf8' });
    return result;
  } catch (err) {
    return null;
  }
}

export const writeFile = async ({path=null, json_str=null}={}) => {
	const writeFile = nw.require('fs/promises').writeFile;

	try {
		await writeFile(path, json_str);
		return true;
	} catch (err) {
		return false;
	}
}

// export const APP_SETTINGS_PATH = './app_settings.json';
export const APP_SETTINGS_PATH = (globals) => {
	return `${globals['appdata_path']}/app_settings.json`;
}
export const APP_SETTINGS_DEFAULT = (globals) => {
	let path = globals['appdata_path'];

	return {
		saveDataFolder:path,
		selfKeysFilename:'self_keys.json',
		contactsFilename:'contacts.json',
		positionFilename:'position.json'
	}
};

export const POSITION_DEFAULT = {
	currentSelfKeyset:0,
	currentContact:0
};

export const CONTACTS_DEFAULT = [];

export const SELF_KEYS_DEFAULT = [];

export const openSelfKeysFile = async (globals) => {
	// get save data folder
	let app_settings = await openSettingsJson(globals);
	/// get self_keys file
	let path = `${app_settings.saveDataFolder}/${app_settings.selfKeysFilename}`;
	let self_keys = await openOrCreateEmptyJsonFile(path, JSON.stringify(SELF_KEYS_DEFAULT));

	return {self_keys:self_keys, path:path};
}

export const openContactsFile = async (globals) => {
	// get save data folder
	let app_settings = await openSettingsJson(globals);
	/// get self_keys file
	let path = `${app_settings.saveDataFolder}/${app_settings.contactsFilename}`;
	let contacts = await openOrCreateEmptyJsonFile(path, JSON.stringify(CONTACTS_DEFAULT));

	return {contacts:contacts, path:path};
}

export const openPositionFile = async (globals) => {
	// get save data folder
	let app_settings = await openSettingsJson(globals);
	/// get self_keys file
	let path = `${app_settings.saveDataFolder}/${app_settings.positionFilename}`;
	let position = await openOrCreateEmptyJsonFile(path, JSON.stringify(POSITION_DEFAULT));

	return {position:position, path:path};
}


//////////////////////////////////////////////////////////

export const getSelfKeysPositionFromFile = async (globals) => {
	let position = await openPositionFile(globals);
	return position.position.currentSelfKeyset;
}

export const updateSelfKeysPositionFile = async (globals, new_pos) => {
	let position_file = await openPositionFile(globals);
	position_file['position']['currentSelfKeyset'] = new_pos;

	await writeFile({path:position_file['path'], json_str:JSON.stringify(position_file['position'])});
}

export const getContactsPositionFromFile = async (globals) => {
	let position = await openPositionFile(globals);
	return position.position.currentContact;
} 

export const updateContactsPositionFile = async (globals, new_pos) => {
	let position_file = await openPositionFile(globals);
	position_file['position']['currentContact'] = new_pos;

	await writeFile({path:position_file['path'], json_str:JSON.stringify(position_file['position'])});
}

////////////////////////////////////////////////////////////////////

export const createEmptyJSONFile = async (path, filename, json_str) => {
	path = `${path}/${filename}`;
	if (!existsSync(path)) {
		await writeFile({path:path, json_str:json_str});
	}
}

export const createAppData = async (globals, file_name, json_str) => {

	let path = globals['appdata_path'];

	if (existsSync(path)) {
		createEmptyJSONFile(path, file_name, json_str);
	} else {
		mkdir(path, (er) => {
			if (er) {
				// console.log(er);
			} else {
				createEmptyJSONFile(path, file_name, json_str);
			}
		});
	}
}

////////////////////////////////////////////////////////////////////

export const openOrCreateEmptyJsonFile = async (path, json_type) => {
	let file = null;
	try {
		file = await readFile(path);
	} catch(err) {
		//
	}

	if (!file) {
		file = await writeFile({path:path, json_str:json_type});
		// console.log('returned new');
		return JSON.parse(json_type);
	}

	// console.log('opend and returnd without saving');
	return JSON.parse(file);
}

export const openSettingsJson = async (globals) => {
	/// save in file
	let settings = await readFile(APP_SETTINGS_PATH(globals));
	try {
		settings = JSON.parse(settings);
	} catch(err) {
		settings = null;
	}

	if (!settings) {
		// settings is missing, make off of the defaults obj
		await writeFile({path:APP_SETTINGS_PATH(globals), json_str:JSON.stringify(APP_SETTINGS_DEFAULT(globals))});

		return APP_SETTINGS_DEFAULT(globals);
	} else {
		// settings file exists, check for values, save the ones taht exist, and insert the missing ones
		let app_settings_default = APP_SETTINGS_DEFAULT(globals);
		Object.keys(app_settings_default).forEach(key => {

			let keycheck = settings[key];

			if (!keycheck || keycheck === '') {
				let value = app_settings_default[key];
				settings[key] = value;
			}
		});

		// save the corrected settings file
		await writeFile({path:APP_SETTINGS_PATH(globals), json_str:JSON.stringify(settings)});

		return settings;
	}
}

export const initGlobals = () => {
	const globals = new Map();
	globals['global_styles'] = global_styles;
	globals['id_manager'] = new RandIdManager({id_len:4});
	globals['global_screen_resize'] = new GlobalScreenResizeUpdater();
	globals['class_styles'] = new Map();
	globals['global_drag'] = new GlobalDragListener(globals);
	globals['dragables'] = new Map();
	globals['anim_loop'] = new AnimLoop(globals);

	return globals;
}

export class BoundingRectsmanager {
	constructor(ele) {
		this.ele = ele;
		this.rect = this.ele.getBoundingClientRect();
	}

	updateRectFromDom = () => {
		this.rect = this.ele.getBoundingClientRect();
	}

	
}

export class Component {
	constructor({globals=null, append_to=null}) {
		this.globals = globals;
		this.append_to = append_to;

		this.global_styles = this.globals['global_styles'];
		// this.dragables = this.globals['dragables'];
		// this.window = this.globals['window'];
		// this.pages = this.globals['pages'];
		// this.pages_cont = this.globals['pages_cont'];
		// this.active_page = this.globals['active_page'];

		this.focus = false;
	}

	makeDragable = (elementToDragable) => {
		let dragable_id = this.globals['id_manager'].createId();
		elementToDragable.setAttribute('_dragable', dragable_id);
		this.globals['dragables'][dragable_id] = this;
	}

	startDragEvent = (event) => {
		console.log('default fn, start drag:', event);
	}

	moveDragEvent = (event) => {
		console.log('default fn, move drag', event);;
	}

	stopDragEvent = (event) => {
		console.log('default fn, stop drag', event);
	}

	otherIsNotDragging = () => {
		return this.globals['other_is_dragging'] === this || this.globals['other_is_dragging'] === null;
	}

	append = () => {
		this.append_to.appendChild(this.cont);
	}

	remove = () => {
		this.append_to.removeChild(this.cont);
	}

	static setClassStyle = (globals) => {

		// let style = ``;

		// createClassStyle({globals:globals, id:'', style:style})
	}
} 

export const roundToTwo = (num) => {
	return Number.parseInt(num * 100) / 100;
}	

export const getPosSizeData = (element) => {
	let pos = element.getBoundingClientRect();
	let width = pos.right - pos.left;
	let height = pos.bottom - pos.top;
	let top = pos.top;
	let bottom = pos.bottom;
	let left = pos.left;
	let right = pos.right;

	return {width, height, top, bottom, left, right};
}

export const plusSign = ({width=null, border_radius=null, center_on_parent=null, hover_col=null, normal_col=null}={}) => {
	let cont_styles = [
		['height', '100%'],
		['width', '100%'],
		['position', 'relative']
	];
	let cont = makeElement({type:'div', style:cont_styles});

	let horiz_styles = [
		['height', width],
		['width', '100%'],	
		['position', 'absolute'],
		['top', center_on_parent],
		['borderRadius', border_radius]
	];
	let horizontal = makeElement({type:'div', style:horiz_styles, attrs:[['classList', class_list]]});
	cont.appendChild(horizontal);

	let vert_styles = [
		['height', '100%'],
		['width', width],	
		['position', 'absolute'],
		['left', center_on_parent],
		['borderRadius', border_radius]
	];
	let vertical = makeElement({type:'div', style:vert_styles, attrs:[['classList', class_list]]});

	cont.appendChild(vertical);

	return cont;
}

export class LoopedList {
	constructor({data=null}={}) {
		this.root = new Node({data:data});
		this.curr = this.root;
		this.length = 1;
	}

	add = (data) => {
		let new_node = new Node({prev:this.root.prev, next:this.root, data:data});
		this.root.prev.next = new_node;
		this.root.prev = new_node;
		this.length++;
	}

	remove = (name) => {
		if (this.length > 0) {
			let curr = this.root;

		}

	}
}

export class Node {
	constructor({next=null, prev=null, data=null}={}) {
		this.prev = prev;
		this.data = data;
		this.next = next;
	}
}


export const spacesAndNewlinesToN = (text) => {
	text = text.replaceAll('\\n', '\n');
	text = text.replaceAll('\\\n', '\n');
	text = text.replaceAll('\\r', '\n');
	text = text.replaceAll('\\\r', '\n');
	text = text.replaceAll('\r', '\n');
	text = text.replaceAll('\\r', '\n');
	text = text.replaceAll('\\\r', '\n');
	text = text.replaceAll('\r\n', '\n');
	text = text.replaceAll('\\r\\n', '\n');
	text = text.replaceAll('\\\r\\\n', '\n');
	text = text.replaceAll(' ', '\n');

	return text;
}


export const cleanOpenpgpMessage = (encrypted) => {
	encrypted = spacesAndNewlinesToN(encrypted);

	encrypted = encrypted.replaceAll('BEGIN\nPGP\nMESSAGE', 'BEGIN PGP MESSAGE');
	encrypted = encrypted.replaceAll('END\nPGP\nMESSAGE', 'END PGP MESSAGE');

	return encrypted;
}


export const cleanOpenpgpPrivate = (text) => {
	text = spacesAndNewlinesToN(text);

	text = text.replaceAll('BEGIN\nPGP\nPRIVATE\nKEY\nBLOCK', 'BEGIN PGP PRIVATE KEY BLOCK');
	text = text.replaceAll('END\nPGP\nPRIVATE\nKEY\nBLOCK', 'END PGP PRIVATE KEY BLOCK');

	return text;
}


export const cleanOpenpgpPublic = (text) => {
	text = spacesAndNewlinesToN(text);

	text = text.replaceAll('BEGIN\nPGP\nPUBLIC\nKEY\nBLOCK', 'BEGIN PGP PUBLIC KEY BLOCK');
	text = text.replaceAll('END\nPGP\nPUBLIC\nKEY\nBLOCK', 'END PGP PUBLIC KEY BLOCK');

	return text;
}


export class RandIdManager {
	constructor({id_len=null, existing_ids=null}={}) {
		this.id_len = id_len;
		this.existing_ids = new Set();

		if (existing_ids) {
			existing_ids.forEach(id => {
				this.existing_ids.add(id);
			});
		}
	}

	add = (id) => {
		this.existing_ids.add(id);
	}

	createId = ({id_type=''/*String*/}={}) => {
	  // let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789012345678901234567890123456789012345678901!@#$%&*?!@#$%&*?!@#$%&*?';
	  let chars = 'abcdefghijklmnopqrstuvwxyz';
	  let result = id_type;
	  let cntr = 0;

	  while (true) {
	    for (let i=0; i<this.id_len; i++) {
	      result += chars.charAt(Math.floor(Math.random() * chars.length));
	    }

      if (this.existing_ids.has(result)) {
        cntr++;
      } else {
      	this.existing_ids.add(result);
      	return result;
      }

	    if (cntr >= 10) {
	    	this.id_len++;
	    }
	  }
	}
}

