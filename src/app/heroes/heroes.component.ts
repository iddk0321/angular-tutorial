import {Component, OnInit} from '@angular/core';
import {Hero} from "../Hero";
import {HeroService} from "../hero.service";
import {MessageService} from "../message.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  // 생성자에 HeroService 타입의 heroService 인자를 선언
  // heroService를 클래스의 프로퍼티로 선언하면서, HeroService 타입의 의존성 객체가 주입되기를 요청하는 것을 의미함.
  constructor(private heroService: HeroService,
              private messageService: MessageService) {
  }

  // Angular가 HeroesComponent의 인스턴스를 생성한 직후에 실행되는 함수.
  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    // 기존에 사용하던 코드
    // this.heroes = this.heroService.getHeroes();

    // Observable을 사용하는 코드
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes)
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({name} as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h != hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
