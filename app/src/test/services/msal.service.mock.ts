const TEST_ID_TOKEN_CLAIMS = {
    idTokenClaims: {
        'aud': '11111111-1111-1111-1111-111111111111',
            'iss': 'https://login.microsoftonline.com/11111111-1111-1111-1111-111111111111/v2.0',
            'iat': 1234567890,
            'nbf': 1234567891,
            'exp': 1234567892,
            'name': 'Test User',
            'nonce': '11111111-1111-1111-1111-111111111111',
            'oid': '11111111-1111-1111-1111-111111111111',
            'preferred_username': 'username@test.com',
            'rh': '',
            roles: [
                'customer.SubaccountAdmin'
            ],
            'sub': 'sub',
            'tid': '11111111-1111-1111-1111-111111111111',
            'uti': 'uti',
            'ver': 'ver'
    }
}

const TEST_ID_TOKEN_CLAIMS_WITHOUT_ROLES = {
    idTokenClaims: {
        'aud': '11111111-1111-1111-1111-111111111111',
            'iss': 'https://login.microsoftonline.com/11111111-1111-1111-1111-111111111111/v2.0',
            'iat': 1234567890,
            'nbf': 1234567891,
            'exp': 1234567892,
            'name': 'Test User',
            'nonce': '11111111-1111-1111-1111-111111111111',
            'oid': '11111111-1111-1111-1111-111111111111',
            'preferred_username': 'preferred_username',
            'rh': '',
            roles: [],
            'sub': 'sub',
            'tid': '11111111-1111-1111-1111-111111111111',
            'uti': 'uti',
            'ver': 'ver'
    }
}


export const MSAL_SERVICE_MOCK = {
    mockIdTokenClaims: TEST_ID_TOKEN_CLAIMS,
    mockIdTokenClaimsWithoutRoles: TEST_ID_TOKEN_CLAIMS_WITHOUT_ROLES,
    instance: {
        getActiveAccount: () => {
            return {
                homeAccountId: '12341234-1234-1234-1234-123412341234.12341234-1234-1234-1234-123412341234',
                environment: 'login.windows.net',
                tenantId: '12341234-1234-1234-1234-123412341234',
                username: 'username@test.com',
                localAccountId: '12341234-1234-1234-1234-123412341234',
                name: 'name',
                idTokenClaims: {
                    'aud': '12341234-1234-1234-1234-123412341234',
                    'iss': 'https://login.microsoftonline.com/12341234-1234-1234-1234-123412341234/v2.0',
                    'iat': 1234567890,
                    'nbf': 1234567891,
                    'exp': 1234567892,
                    'name': 'Leonardo Velarde',
                    'nonce': '12341234-1234-1234-1234-123412341234',
                    'oid': '12341234-1234-1234-1234-123412341234',
                    'preferred_username': 'preferred_username',
                    'rh': '',
                    roles: [
                        'tekvizion.FullAdmin'
                    ],
                    'sub': 'sub',
                    'tid': '12341234-1234-1234-1234-123412341234',
                    'uti': 'uti',
                    'ver': 'ver'
                }
            };
        },
        setActiveAccount: (activeAccount:any)=>{},
        setNavigationClient: (navigationClient:any)=>{}
    },
    loginRedirect: (authRequest?:any)=>{},
    logoutRedirect: ()=>{}
};


