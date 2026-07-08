import { CanActivateChildFn } from '@angular/router';

// Placeholder boundary for future authentication. Admin stays accessible until login is implemented.
export const adminGuard: CanActivateChildFn = () => true;
