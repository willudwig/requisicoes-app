import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: string[] = [];

  constructor() { }

  public add(msg: string): void {
      this.messages.push(msg);
  }

  public clear () {
    this.messages = [];
  }

  public getMessages(): string[] {
    return this.messages;
  }
}
