export const permissions = {
    'tekvizion.FullAdmin': {
        paths: [
            'tabs',
            'dashboard',
            'settings'
        ],
        elements: ['tabBar',
                    'addNote',
                    'deleteNote']
    },
    'customer.SubaccountAdmin': {
        paths: [
            'tabs',
            'dashboard',
            'settings'
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

