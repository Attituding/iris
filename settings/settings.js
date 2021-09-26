errorEventCreate();

import * as storage from '../storage.js';

(async () => {
  let { userOptions } = await storage.getSyncStorage('userOptions').catch(errorHandler);
    
  if ((userOptions.paragraphOutput ?? false) === false) document.getElementById('authorNameOutputContainer').style.display = 'none';
  document.getElementById('typewriterOutput').checked = userOptions.typewriterOutput ?? true;
  document.getElementById('persistentLastPlayer').checked = userOptions.persistentLastPlayer ?? true;
  document.getElementById('paragraphOutput').checked = userOptions.paragraphOutput ?? false;
  document.getElementById('authorNameOutput').checked = userOptions.authorNameOutput ?? false;
  document.getElementById('gameStats').checked = userOptions.gameStats ?? true;
  document.getElementById('useHypixelAPI').checked = userOptions.useHypixelAPI ?? false;
  document.getElementById('apiKey').value = userOptions.apiKey.replace(/^[0-9a-fA-F]{8}/g, '########') ?? '';

  document.querySelectorAll("input[type=checkbox]").forEach(function(checkbox) {
    checkbox.addEventListener('change', async function() {
      try {
        if (this.id === 'paragraphOutput') this.checked === true ? 
        document.getElementById('authorNameOutputContainer').style.display = 'block' : 
        document.getElementById('authorNameOutputContainer').style.display = 'none';
        userOptions[this.id] = this.checked;
        this.disabled = true;
        setTimeout(() => {this.disabled = false}, 500);
        await storage.setSyncStorage({'userOptions': userOptions}).catch(errorHandler);
      } catch (err) {
        throw err;
      }
    })
  });

  let apiKeyInput = document.getElementById('apiKey');
  apiKeyInput.addEventListener('input', async function() {
    try {
      let regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[45][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/g
      if (regex.test(apiKeyInput.value) || apiKeyInput.value === '') {
        document.getElementById('apiKeyError').innerHTML = '';
        userOptions.apiKey = apiKeyInput.value;
        await storage.setSyncStorage({'userOptions': userOptions}).catch(errorHandler);
      } else {
        userOptions.apiKey = apiKeyInput.value;
        document.getElementById('apiKeyError').innerHTML = '&#9888; Invalid API key! Hypixel API keys will follow the UUID v4 format. Get an API key with <b>/api new</b> on Hypixel &#9888;';
      }
    } catch (err) {
      throw err;
    }
  });

  apiKeyInput.addEventListener('focus', function() {
    try {
      apiKeyInput.value = userOptions.apiKey ?? '';
      apiKeyInput.pattern = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[45][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}"
    } catch (err) {
      throw err;
    }
  });

  apiKeyInput.addEventListener('blur', function() {
    try {
      let regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[45][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/g
      if (regex.test(apiKeyInput.value)) apiKeyInput.pattern = "([#]{8}|[0-9a-fA-F]{8})-[0-9a-fA-F]{4}-[45][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}";
      else apiKeyInput.pattern = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[45][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}"; //Logic to filter out putting # as the first 8 values
      apiKeyInput.value = userOptions.apiKey.replace(/^[0-9a-fA-F]{8}/gi, '########');
    } catch (err) {
      throw err;
    }
  });

  let playerHistoryBytes = await storage.localStorageBytes('playerHistory').catch(errorHandler); //null returns the total storage
  let userOptionsBytes = await storage.syncStorageBytes('userOptions').catch(errorHandler);

  document.getElementById('playerHistoryBytes').innerHTML = `Search History: ${(playerHistoryBytes / 1024).toFixed(2)} Kilobytes`
  document.getElementById('userOptionsBytes').innerHTML = `Settings: ${(userOptionsBytes / 1024).toFixed(2)} Kilobytes`
})().catch(errorHandler);

function errorEventCreate() {
  window.addEventListener('error', x => errorHandler(x, x.constructor.name));
  window.addEventListener('unhandledrejection', x => errorHandler(x, x.constructor.name));
}

function errorHandler(event, errorType = 'caughtError', err =  event?.error ?? event?.reason ?? event) { //Default type is "caughtError"
  try {
    let errorOutput = document.getElementById('errorOutput');
    console.error(`${new Date().toLocaleTimeString('en-IN', { hour12: true })} | Error Source: ${errorType} |`, err?.stack ?? event);
    switch (err?.name) {
      case 'ChromeError':
        errorOutput.innerHTML = `An error occured. ${err?.message}`;
      break;
      case null:
      case undefined:
        errorOutput.innerHTML = `An error occured. No further information is available here; please check the dev console and contact Attituding#6517 if this error continues appearing.`;
      break;
      default:
        errorOutput.innerHTML = `An error occured. ${err?.name}: ${err?.message}. Please contact Attituding#6517 if this error continues appearing.`;
      break;
    }
  } catch (err) {
    console.error(`${new Date().toLocaleTimeString('en-IN', { hour12: true })} | Error-Handler Failure |`, err?.stack ?? event);
  }
}

//uuid for error tracing in the future - maybe.
//absolutely incredible
function b(a){return a?Math.random().toString(16)[2]:(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,b)}
//https://gist.github.com/jed/982883
let uuid = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c =>(c^(window.crypto||window.msCrypto).getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
//https://gist.github.com/jed/982883#gistcomment-3644691