export const PUSH_NOTIFICATIONS_SERVICE_MOCK = {
    initPush: ()=> {},
    AddActionAndReceivedListeners: ()=> {},
    unregisterDevice: (callback)=> { return callback(true); }
}