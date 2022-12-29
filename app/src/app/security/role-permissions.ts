export const permissions = {
    'customer.SubaccountAdmin': {
        paths: [
            'tabs',
            'dashboard',
            'notes'
        ],
        elements: [ 'addNote',
                    'closeNote']
    },
    'customer.SubaccountStakeholder': {
        paths: [
            'tabs',
            'dashboard',
            'notes'
        ],
        elements: []
    }
};

