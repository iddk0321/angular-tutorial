import {Component, OnInit, Input} from '@angular/core';
import {Hero} from '../Hero';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  // 외부 컴포넌트인 HerosComponent에서 값을 전달받기 위해 @Input 데코레이터 사용
  @Input() hero?: Hero;

  constructor(
    // ActivatedRoute는 HeroDetailComponent의 인스턴스를 생성하면서 적용한 라우팅 규칙에 대한 정보가 담겨있음.
    // Location은 브라우저를 제어하기 위해 Angular에서 제공하는 서비스.
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    // 라우터에서 설정한 :id값 참조하기. 참조는 ActivatedRoute를 사용하여 할 수 있음.
    // route.snapshot은 컴포넌트가 생성된 직후에 존재하는 라우팅 규칙에 대한 정보가 담겨 있는 객체.
    // 라우팅 변수는 항상 string 타입이므로, 숫자라면 Number 함수를 사용해서 숫자로 변환해야 함.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }
}
