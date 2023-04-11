import { Observable } from 'rxjs';

export const FEATURE_TOGGLE_SERVICE_MOCK = {
  refreshToggles: () => new Observable((observer) => {
    observer.next(void 0);
    observer.complete();
    return {
      unsubscribe: () => {
      }
    };
  }),
  isFeatureEnabled: () => {
    return true;
  }
};
