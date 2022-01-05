import {Component, OnInit} from '@angular/core';
import {MessageService} from "../message.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  // 템플릿에 데이터가 바인딩 되는 경우 public으로 선언해야 함.
  constructor(public messageService: MessageService) {
  }

  ngOnInit(): void {
  }
}
