import e from "express";

import { ServiceContainer } from "src/container";
import { AuthService, WinstonLogger } from "src/services";



class AuthController {

  public authService: AuthService;
  public logger: WinstonLogger;


  constructor(container: ServiceContainer) {
    this.authService = container.getService("authService");
    this.logger = container.logger;
  }


  async signup(req: e.Request, res: e.Response) {
    try {
      const { username, email, password } = await req.body;

      const result = await this.authService.register({
        username,
        email,
        password
      })

      if(!result) throw new Error("Failed while creating user");

      res.status(201).json({
        success: true,
        message: "user created"
      })

    } catch (err:any) {
      this.logger.error(err.message);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }


  public login() {}
  public logout() {}
  public verify() {}
  public forgotPassword() {}
  public changePassword() {}
  public updateProfile() {}

}


export default AuthController;
