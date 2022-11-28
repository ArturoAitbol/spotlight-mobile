import { Observable } from "rxjs"

const TEST_SUBACCOUNT = {
    id: "fbb2d912-b202-432d-8c07-dce0dad51f7f",
    name: "testv2Demo",
    customerId: "157fdef0-c28e-4764-9023-75c06daad09d",
    services: "tokenConsumption,spotlight",
    testCustomer: false,
    companyName:"testComp"
}

export const SUBACCOUNT_SERVICE_MOCK = {
    testSubaccountString:JSON.stringify(TEST_SUBACCOUNT),
    setSubAccount:()=>{

    },
    getSubAccount:()=>{
        return JSON.parse(JSON.stringify(TEST_SUBACCOUNT));
    },
    getSubAccountList:()=>{
        return new Observable((observer)=>{
            observer.next(
                JSON.parse(JSON.stringify({subaccounts:[TEST_SUBACCOUNT]}))
                );
            observer.complete();
            return {
                unsubscribe(){ }
            }
        });
    }
}