import { ComponentRef } from '@angular/core';
export declare function waitRouter(compRef: ComponentRef<any>): Promise<ComponentRef<any>>;
export declare function waitRender(compRef: ComponentRef, waitMs?: number): Promise<any>;
