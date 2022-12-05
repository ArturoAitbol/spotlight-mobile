export const MODAL_CONTROLLER_MOCK = {
    create:(params: any)=>{
        return { 
            present:()=>{},
            onWillDismiss:async()=>{
                return {data: "some data", role:"confirm"}
            }
        }
    },
    dismiss:(data?: any, role?: string, id?: string)=>{

    },
    getTop:()=>{
        return new Promise((resolve)=>{
            resolve({});
        })
    }

}