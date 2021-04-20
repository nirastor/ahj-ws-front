/* eslint-disable no-console */

import axios from 'axios';

class App {
  constructor() {
    this.appEl = document.querySelector('.app');
    this.registrationForm = document.querySelector('.registration-form');
    this.registrationInput = document.querySelector('.registration-input');
    this.sendInput = document.querySelector('.send-input');
    this.errorMessage = document.querySelector('.error');
    this.chatExitButton = document.querySelector('.chat-exit-button');
    this.sendForm = document.querySelector('.send-form');
    this.chat = document.querySelector('.chat');
    this.port = 7001;
    this.checkUserUrl = `http://localhost:${this.port}/check`;
    this.deleteUserUrl = `http://localhost:${this.port}/exit`;
    this.socket = undefined;
    this.displayNoneClass = 'display-none';
    this.currentUser = undefined;
  }

  submitHandler(e) {
    e.preventDefault();
    if (!this.registrationInput.value) return;
    axios.post(this.checkUserUrl, { userName: this.registrationInput.value })
      .then((res) => {
        const { access, userName } = res.data;
        if (access) {
          this.welcomeHandler(userName);
        } else {
          this.loginErrorHandler();
        }
      });
  }

  sendHandler(e) {
    e.preventDefault();
    if (this.sendInput.value) {
      console.log('from input', this.sendInput.value);
      console.log(this.socket.readyState);
    }
  }

  inputHandler() {
    this.errorMessage.classList.add(this.displayNoneClass);
  }

  loginErrorHandler() {
    this.errorMessage.classList.remove(this.displayNoneClass);
  }

  welcomeHandler(userName) {
    this.currentUser = userName;
    this.errorMessage.classList.add(this.displayNoneClass);
    this.registrationForm.classList.add(this.displayNoneClass);
    this.chat.classList.remove(this.displayNoneClass);
    this.registrationInput.value = '';
    this.initSocket();
  }

  backToLogin() {
    this.currentUser = undefined;
    this.registrationForm.classList.remove(this.displayNoneClass);
    this.chat.classList.add(this.displayNoneClass);
  }

  init() {
    this.registrationForm.addEventListener('submit', (e) => this.submitHandler(e));
    this.sendForm.addEventListener('submit', (e) => this.sendHandler(e));
    this.registrationInput.addEventListener('input', () => this.inputHandler());
    this.chatExitButton.addEventListener('click', () => this.chatExit());
  }

  initSocket() {
    this.socket = new WebSocket(`ws://localhost:${this.port}/ws`);
    this.socket.addEventListener('open', () => console.log('hello server', this.socket.readyState));
    this.socket.addEventListener('close', (e) => console.log('close', e));
    this.socket.addEventListener('message', (e) => console.log(e));
  }

  chatExit() {
    axios.post(this.deleteUserUrl, { userName: this.currentUser })
      .then(() => this.backToLogin());
  }
}

const app = new App();
app.init();
