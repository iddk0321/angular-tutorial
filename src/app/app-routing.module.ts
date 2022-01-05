import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HeroesComponent} from './heroes/heroes.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HeroDetailComponent} from "./hero-detail/hero-detail.component";

// path : 브라우저의 주소창에 있는 URL과 매칭될 문자열
// component : 라우터가 생성되고 화면에 표시할 컴포넌트
// localhost:4200/heroes URL은 HeroesComponent를 표시한다.
const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'heroes', component: HeroesComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'detail/:id', component: HeroDetailComponent}
];

// 모듈 생성시 라우터를 초기화하면서 브라우저의 주소가 변화되는 것을 감지한다.
@NgModule({
  // 애플리케이션 최상위 계층에 존재하는 라우터를 설정할땐 forRoot() 메소드를 사용한다.
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
