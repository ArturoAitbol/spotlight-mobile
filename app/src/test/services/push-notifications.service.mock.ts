export const PUSH_NOTIFICATIONS_SERVICE_MOCK = {
    initPush: ()=> {},
    unregisterDevice: (callback)=> { return callback(true); }
}