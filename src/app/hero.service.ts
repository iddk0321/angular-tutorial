import {Injectable} from '@angular/core';
import {Hero} from "./Hero";
import {HEROES} from "./mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";

// HeroService를 HerosComponent에 의존성 주입을 하려면 이 서비스의 프로바이더가 Angular의 DI에 등록되어야 함.
// 프로바이더 : 서비스를 생성하고 전달하는 방식을 정으한 것
// 이 클래스에서는 서비스 클래스가 HeroService의 프로바이더임.

// 의존성 주입 시스템에 포함되는 클래스임을 선언
// 서비스는 데이터의 조회, 수정과 같은 작업을 수행한다.
// 컴포넌트는 데이터의 표시에 관련된 작업을 수행한다.
// Injecter : 의존성 주입 요청이 있는 객체를 적절하게 고르고 생성하는 역할
@Injectable({
  // 서비스의 프로바이더를 최상위 인젝터(root)에 등록
  // 인젝터에 등록되면 HeroService의 인스턴스를 하나만 생성하여 여러 곳에서 사용(싱글톤 느낌으로다가)
  // 만약 인젝터에 등록되었어도 사용하지 않으면 빌드에서 제거한다.
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
  }

  // 실제 사이트에서는 고정된 데이터가 아닌 api 요청으로 데이터를 조회해야 함.
  // 따라서 getHeros() 함수는 비동기적으로 처리되어야 한다.
  // 비동기 처리를 위해서는 콜백 함수, Promise, Observable을 사용하여 반환할 수 있음.
  // Angular에서 제공하는 HttpClient.get() 메소드는 Observable을 반환하기 때문에 Observable을 사용하는것이 좋다.
  getHeroes(): Observable<Hero[]> {
    // 로컬에 저장된 Hero 데이터를 Observable을 사용하여 조회하는 코드
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;

    // remote server에 저장된 데이터를 http client를 사용하여 조회하는 코드
    // HttpClient로 조회한 데이터는 한번만 반환된다.
    // 응답으로 받은 데이터는 body를 반환하기 때문에 타입이 지정되지 않은 JSON 객체로 처리된다.
    // 그래서 이 객체에 타입을 지정하려면 <Hero[]>와 같이 제네릭 타입을 지정한다.
    // GET : 서버에서 히어로 목록 가져오기
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    // put(url, 수정된 데이터, 옵션)
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim) { return of([]) }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? this.log(`found heroes matching ${term}`) : this.log(`no heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  // 물음표 : 해당 파라미터를 선택적으로 사용하고 싶을때 사용한다.
  // 느낌표 : 해당 파라미터가 null이 아니라는것을 명시할때 사용한다.
  // 함수명 옆에 <T>가 있다는 것은
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
