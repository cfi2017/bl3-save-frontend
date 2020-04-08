import { OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export function componentDestroyed<T extends OnDestroy>(component: T): Observable<true> {
  const modifiedComponent = component as {
    __componentDestroyed$?: Observable<true>,
    ngOnDestroy(): void
  };

  if (modifiedComponent.__componentDestroyed$) {
    return modifiedComponent.__componentDestroyed$;
  }

  const oldNgOnDestroy = component.ngOnDestroy;
  const stop$ = new ReplaySubject<true>();
  modifiedComponent.ngOnDestroy = () => {
    oldNgOnDestroy.apply(component);
    stop$.next(true);
    stop$.complete();
  };
  return modifiedComponent.__componentDestroyed$ = stop$.asObservable();

}

export function untilComponentDestroyed<T, C extends OnDestroy>(component: C): (source: Observable<T>) => Observable<T> {
  return source => source.pipe(takeUntil(componentDestroyed(component)));
}
