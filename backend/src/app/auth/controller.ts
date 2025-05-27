import { ServiceContainer } from "src/container";

class AuthController {
  public container: ServiceContainer;

  constructor(container: ServiceContainer) {
    this.container = container;
  }


  public signup() {}
  public login() {}
  public logout() {}
  public verify() {}
  public forgotPassword() {}
  public changePassword() {}
  public updateProfile() {}

}


export default AuthController;
