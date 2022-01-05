import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";
import {Hero} from "../Hero";
import {HeroService} from "../hero.service";


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  // 프로퍼티가 Observable 타입일 경우, $를 붙여줘야함.
  heroes$!: Observable<Hero[]>;
  // Subject는 Observable을 상속받고 있는 클래스.
  // 따라서 Subject는 Observable처럼 subscribe가 가능하다.
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // 사용자가 입력한 검색어를 옵저버블 스트림으로 보낸다.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 연속적인 키입력을 처리하기 위해 키입력 후 300ms를 대기한다.
      debounceTime(300),
      // 이전에 입력한 검색어와 같으면 무시한다.
      distinctUntilChanged(),
      // 검색어가 변경되면 새로운 옵저버블을 생성한다.
      // debounceTime을 통해 요청을 300ms당 한번으로 제한하더라도 동작중인 HTTP 요청은 여러개가 될 수 있고, 응답이 돌아오는 순서도 예측할 수 없다.
      // switchMap을 사용하면 이전에 보낸 HTTP 요청을 취소하고 제일 마지막에 보낸 HTTP 요청만 남겨둘 수 있다.
      // HTTP 요청을 취소한다는 것은 실제 HTTP 요청을 취소한다는것 (서버에 요청을 취소한다는 것)이 아니라, 이전에 보낸 HTTP 요청에 대한 응답을 사용하지 않게 되는 것
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  }
}
