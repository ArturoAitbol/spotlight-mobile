export const permissions = {
    'tekvizion.FullAdmin': {
        paths: [
            'tabs',
            'dashboard',
            'notes'
        ],
        elements: ['tabBar',
                    'addNote',
                    'deleteNote']
    },
    'customer.SubaccountAdmin': {
        paths: [
            'tabs',
            'dashboard',
            'notes'
        ],
        elements: ['tabBar',
                    'addNote',
                    'deleteNote']
    },
    'customer.SubaccountStakeholder': {
        paths: [
            'tabs',
            'dashboard'
        ],
        elements: []
    }
};

