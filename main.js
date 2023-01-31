// nw.Window.get().showDevTools();
const openpgp = require('openpgp');

import { initGlobals, appendAnimStyles, createAppData, APP_SETTINGS_DEFAULT } from './components/utils.js';
import { TitleBar } from './components/TitleBar.js';
import { PagesCont } from './components/PagesCont.js';
import { TextInput } from './components/TextInput.js';
import { IncomingPage } from './components/IncomingPage.js';
import { OutgoingPage } from './components/OutgoingPage.js';
import { TextButton } from './components/TextButton.js';
import { TooltipLabel } from './components/TooltipLabel.js';
import { ImageButton } from './components/ImageButton.js';
import { generateKeys, encryptMessage, decryptMessage } from './engine/openpgp.js';
const getAppDataPath = require('appdata-path');

const globals = initGlobals();

// set class styles for every class used in app
TitleBar.setClassStyle(globals);
TextButton.setClassStyle(globals);
TextInput.setClassStyle(globals);
ImageButton.setClassStyle(globals);

let anim_styles = 
`* {
  margin:  0;
  padding:  0;
  box-sizing: border-box;
}

body {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: ${globals['global_styles']['colors']['body_bg']};

  font-family: Arial;
  font-size: ${globals['global_styles']['font_size_1']}px;
  color: ${globals['global_styles']['colors']['font_1']};
}

.border_cont {
  border: 2px solid ${globals['global_styles']['colors']['body_bg']};
  padding: ${globals['global_styles']['panel_margins']/2}px;
  display: flex;
  justify-content: center;
}

.top_labels {
  margin-bottom: ${globals['global_styles']['panel_margins']/4}px;
  user-select: none;
}

.inputs_zero {
  border: none;
}

.inputs_zero:focus {
  outline: none;
}

.scrollbar::-webkit-scrollbar {
  width: 20px;             
}

.scrollbar::-webkit-scrollbar-track {
  background: ${globals['global_styles']['colors']['btn1_normal']};       
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: ${globals['global_styles']['colors']['panel_bg']};   
  border: ${globals['global_styles']['panel_margins']/2}px solid ${globals['global_styles']['colors']['btn1_normal']};
}

.delete_btn_warning {
  background: ${globals['global_styles']['colors']['btn_warning_normal']};
}

.delete_btn_warning:hover {
  background: ${globals['global_styles']['colors']['btn_warning_hover']};
}

.grayed_btn, .grayed_btn:active, .grayed_btn:hover {
  background: ${globals['global_styles']['colors']['btn1_grayed']};
}

*::selection {
  background: ${globals['global_styles']['colors']['selected_text']}};
}`;


appendAnimStyles('style_globals', anim_styles);


globals['is_mac'] = false;
globals['appdata_path'] = getAppDataPath('OfflineOpenPgp').replaceAll('\\', '/');
// console.log('appdata',globals['appdata_path']);
createAppData(globals, 'self_keys.json', '[]');
createAppData(globals, 'contacts.json', '[]');
createAppData(globals, 'position.json', '{}');
createAppData(globals, 'app_settings.json', JSON.stringify(APP_SETTINGS_DEFAULT(globals)));

// create title bar
globals['title_bar'] = new TitleBar({globals:globals, append_to:document.body});
globals['title_bar'].append();
globals['title_bar'].appLoadMaximizedCheck();

// pages cont
globals['pages_cont'] = new PagesCont({globals:globals, append_to:document.body});
globals['pages_cont'].append();

// 
globals['incoming_page'] = await IncomingPage.construct({globals:globals, append_to:globals['pages_cont'].cont});
globals['incoming_page'].append();

globals['outgoing_page'] = await OutgoingPage.construct({globals:globals, append_to:globals['pages_cont'].cont});

////////////
globals['global_screen_resize'].update();

///////////////








