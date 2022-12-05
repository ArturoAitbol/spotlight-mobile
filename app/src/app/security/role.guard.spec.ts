import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { MSAL_SERVICE_MOCK } from "src/test/services/msal.service.mock";
import { ION_TOAST_SERVICE_MOCK } from "src/test/services/ion-toast.service.mock";
import { IonToastService } from "../services/ion-toast.service";
import { RoleGuard } from "./role.guard";

const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
};
let guard: RoleGuard

const msalServiceMock = jasmine.createSpyObj('MsalService', ['getActiveAccount']);
msalServiceMock.instance = msalServiceMock;

const beforeEachFunction = async () => {
    await TestBed.configureTestingModule({
        providers: [
            RoleGuard,
            {
                provide: Router,
                useValue: mockRouter
            },
            {
                provide: IonToastService,
                useValue: ION_TOAST_SERVICE_MOCK
            },
            {
                provide: MsalService,
                useValue: msalServiceMock
            },
        ]
    }).compileComponents().then(() => {
        guard = TestBed.inject(RoleGuard);
    });
};

describe('When roles are loaded for username@test.com the role', () => {
    beforeEach(beforeEachFunction);
    beforeEach(() => {
        msalServiceMock.getActiveAccount.and.returnValue(MSAL_SERVICE_MOCK.mockIdTokenClaims)
    });

    it('should grant access to existing parent route', () => {

        const protectedPartenRoute = 'tabs';
        expect(guard.canActivate({url: [{path: protectedPartenRoute, parameters: {}}]} as ActivatedRouteSnapshot)).toBeTrue();
    });

    it('should grant access to dashboard and settings routes', () => {

        const protectedRoutes = ['dashboard', 'settings'];
        protectedRoutes.forEach(route => {
            expect(guard.canActivate({url: [{path: route, parameters: {}}]} as ActivatedRouteSnapshot)).toBeTrue();
        });
    });

    it('should grant access when at least one of the user roles has permission', () => {
        msalServiceMock.getActiveAccount.and.returnValue({ idTokenClaims: {roles: ['tekvizion.ConfigTester','customer.SubaccountAdmin']}})
        const protectedRoute = 'settings';
        expect(guard.canActivate({url: [{path: protectedRoute, parameters: {}}]} as ActivatedRouteSnapshot)).toBeTrue();
    });

    it('should not grant access to nonexistent routes', () => {

        const invalidRoutes = ['nonexistentPathA', 'nonexistentPathB'];
        invalidRoutes.forEach(route => {
            expect(guard.canActivate({url: [{path: route, parameters: {}}]} as ActivatedRouteSnapshot)).toBeFalse();
        });
    });

    it('should block access to existing routes based on the user role(s)', () => {
        //info: stakeholder role does not have access to settings route
        msalServiceMock.getActiveAccount.and.returnValue({ idTokenClaims: {roles: ['customer.SubaccountStakeholder']}})
        const protectedRoute = 'settings';
        expect(guard.canActivate({url: [{path: protectedRoute, parameters: {}}]} as ActivatedRouteSnapshot)).toBeFalse();
    });
    
});

describe('When roles are not loaded for username@test.com', () => {
    beforeEach(beforeEachFunction);
    beforeEach(() => {
        msalServiceMock.getActiveAccount.and.returnValue(MSAL_SERVICE_MOCK.mockIdTokenClaimsWithoutRoles)
    });

    it('should block access to everything and show a message', () => {
        spyOn(ION_TOAST_SERVICE_MOCK,'presentToast');
        const routes = ['tabs', 'dashboard'];
        routes.forEach(route => {
            expect(guard.canActivate({url: [{path: route, parameters: {}}]} as ActivatedRouteSnapshot)).toBeFalse();
            expect(ION_TOAST_SERVICE_MOCK.presentToast).toHaveBeenCalledWith('Role is missing', 'NOT AUTHORIZED');
        });
    });
});
