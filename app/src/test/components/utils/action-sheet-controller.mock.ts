export const ACTION_SHEET_CONTROLLER_MOCK = {
    create: (input:any)=>{
        return {
            present:()=>{},
            onWillDismiss:()=>{ return new Promise<any>((resolve) => {
                resolve({role:'destructive'});
            })}
        }
    }
}