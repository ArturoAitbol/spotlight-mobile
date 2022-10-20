import { Observable, throwError } from 'rxjs';

export const EXAMPLE_SERVICE_MOCK = {
  createAdminEmail: (details: any) => new Observable((observer) => {
    observer.next(null);
    observer.complete();
    return {
      unsubscribe: () => {
      }
    };
  }),
  deleteAdminEmail: (adminEmail: string) => new Observable((observer) => {
    observer.next({res: {}});
    observer.complete();
    return {
      unsubscribe: () => {
      }
    };
  }),
  apiErrorResponse: () => new Observable((observer) => {
    observer.next({
      error: 'Expected create subaccount admin email error'
    });
    observer.complete();
    return {
      unsubscribe: () => {
      }
    };
  }),
  errorResponse: () => throwError({
    error: 'Expected subaccount admin emails response error'
  })
};
