export class User {
  username: string;
  password: string;

  constructor(username?, password?) {
    this.username = username || null;
    this.password = password || null;
  }
}