import{t as e}from"./uid-CDzfGo1P-DTS57DVX.js";var t=`﻿import context from "./tw-extension-worker-context";
import jQuery from "./tw-jquery-shim";
import "./extension-worker";

declare global {
  interface Window {
    __WRAPPED_IFRAME_ID__: string;
  }
}

globalThis.$ = jQuery;
globalThis.jQuery = jQuery;

const id = window.__WRAPPED_IFRAME_ID__;

context.isWorker = false;
context.centralDispatchService = {
  postMessage(message: any, transfer?: any[]) {
    const data = {
      vmIframeId: id,
      message,
    };
    if (transfer) {
      window.parent.postMessage(data, { include: "*" } as any, transfer);
    } else {
      window.parent.postMessage(data, "*");
    }
  },
} as any;

window.parent.postMessage(
  {
    vmIframeId: id,
    ready: true,
  },
  "*",
);
`,n=`'none'`,r={accelerometer:n,"ambient-light-sensor":n,battery:n,camera:n,"display-capture":n,"document-domain":n,"encrypted-media":n,fullscreen:n,geolocation:n,gyroscope:n,magnetometer:n,microphone:n,midi:n,payment:n,"picture-in-picture":n,"publickey-credentials-get":n,"speaker-selection":n,usb:n,vibrate:n,vr:n,"screen-wake-lock":n,"web-share":n,"interest-cohort":n},i=()=>Object.entries(r).map(([e,t])=>`${e} ${t}`).join(`; `),a=class{id;isRemote;ready;queuedMessages;iframe;onmessage;constructor(){this.id=e(),this.isRemote=!0,this.ready=!1,this.queuedMessages=[],this.onmessage=()=>{},this.iframe=document.createElement(`iframe`),this.iframe.className=`tw-custom-extension-frame`,this.iframe.dataset.id=this.id,this.iframe.style.display=`none`,this.iframe.setAttribute(`aria-hidden`,`true`),this.iframe.sandbox=`allow-scripts`,this.iframe.allow=i(),document.body.appendChild(this.iframe),window.addEventListener(`message`,this._onWindowMessage.bind(this));let n=new Blob([`<!DOCTYPE html><body><script>window.__WRAPPED_IFRAME_ID__=${JSON.stringify(this.id)};${t}<\/script></body>`],{type:`text/html; charset=utf-8`});this.iframe.src=URL.createObjectURL(n)}_onWindowMessage(e){if(!(!e.data||e.data.vmIframeId!==this.id)){if(e.data.ready){this.ready=!0;for(let{data:e,transfer:t}of this.queuedMessages)this.postMessage(e,t);this.queuedMessages.length=0}e.data.message&&this.onmessage({data:e.data.message})}}postMessage(e,t){this.ready&&this.iframe.contentWindow?t?this.iframe.contentWindow.postMessage(e,`*`,t):this.iframe.contentWindow.postMessage(e,`*`):this.queuedMessages.push({data:e,transfer:t})}};export{a as default};