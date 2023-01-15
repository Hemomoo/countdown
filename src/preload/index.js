import { contextBridge,ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  electronStoreGet:(key)=> ipcRenderer.invoke('electron-store-get',key),
  electronStorePath:()=>ipcRenderer.invoke('electron-store-path'),
  electronStoreEdite:(id,date)=> ipcRenderer.send('electron-store-edite',id,date), // 修改
  electronStoreGetAll:()=> ipcRenderer.invoke('electron-store-get-all'),
  electronStoreAdd:(id,date)=>ipcRenderer.invoke('electron-store-add',id,date),
  electronStoreDel:(id)=>ipcRenderer.invoke('electron-store-del',id)
}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
console.log('process.contextIsolated: ', process.contextIsolated);
if (process.contextIsolated) {

  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
