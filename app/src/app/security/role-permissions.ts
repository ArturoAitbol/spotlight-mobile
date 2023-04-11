export const permissions = {
    'customer.SubaccountAdmin': {
        paths: [
            'dashboard',
            'notes'
        ],
        elements: [ 'addNote',
                    'closeNote']
    },
    'customer.SubaccountStakeholder': {
        paths: [
            'dashboard',
            'notes'
        ],
        elements: []
    }
};

