import { animate, state, style, transition, trigger, keyframes } from '@angular/animations';

export function routerTransition() {
   /*  return trigger('EnterLeave', [
        state('flyIn', style({ transform: 'translateX(0)' })),
        transition(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('0.5s 300ms ease-in'),
        ]),
        transition(':leave', [
            animate('0.3s ease-out', style({ transform: 'translateX(100%)' })),
        ]),
    ]); */
    return trigger('slideToRight', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
        ])
    ]);
}