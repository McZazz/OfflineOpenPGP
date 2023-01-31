const openpgp = require('openpgp');

export const generateKeys = async ({passphrase=null, name=null, email=null}={}) => {

	let user_id_info = {
		name:name,
		email:email
	}

  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
    type: 'ecc',
    curve: 'curve25519',
    userIDs: [user_id_info],
    passphrase: passphrase,
    format: 'armored'
  });

  return {
  	privateKey:privateKey,
  	publicKey:publicKey,
  	revocationCertificate:revocationCertificate
  }
}

export const encryptMessage = async ({message=null, publicKey=null}={}) => {
    
  try {
    // someone else has our public key, they want to encrypt a message to send to us
    const publicKeyPrepped = await openpgp.readKey({ armoredKey: publicKey });
    // they encrypt their message to our public key
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text:message }), // input as Message object
      encryptionKeys: publicKeyPrepped
    });

    return encrypted;
    
  } catch(err) {
    
    return null;
  }
}

export const decryptMessage = async ({passphrase=null, privateKeyEncrypted=null, encryptedMessage=null, globals=null}={}) => {

  let privateKey = null;

  try {
    // use your own passphrase to decrypt your private key 
    privateKey = await openpgp.decryptKey({
      privateKey:await openpgp.readPrivateKey({ armoredKey:privateKeyEncrypted }),
      passphrase:passphrase
    });
  } catch(err) {
    // console.log([err]);
    if (err.message.toLowerCase().includes('incorrect key passphrase')) {
      globals['status_incoming'].displayText('Status: Error, incorrect passphrase');
    } else {
      globals['status_incoming'].displayText('Status: Error, malformed private key');
    }

    return null;
  }

  try {   
    // take their encrypted message and prepare for decryption
    const message = await openpgp.readMessage({
      armoredMessage:encryptedMessage
    });
    // descrpyt their message
    const decrypted = await openpgp.decrypt({
      message:message,
      decryptionKeys:privateKey
    });

    globals['status_incoming'].displayText('Status: Success, message decrypted');
    return decrypted.data;

  } catch(err) {
    // console.log(err);
    if (err.message.toLowerCase().includes('unknown ascii armor')) {
      globals['status_incoming'].displayText('Status: Error, malformed encrypted message');
    } else {
      globals['status_incoming'].displayText('Status: Error, message was made for other keyset');
    }
    return null;
  }
}


