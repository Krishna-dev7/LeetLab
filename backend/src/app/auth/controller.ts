import e from "express";

import { ServiceContainer } from "../../container";
import { loginSchema, signupSchema } from "../../schemas/auth.schema";
import { AuthService, WinstonLogger } from "../../services";


type Schemas = (
  typeof signupSchema 
  | typeof loginSchema )


class AuthController {

  public authService: AuthService;
  public logger: WinstonLogger;

  constructor(container: ServiceContainer) {
    this.authService = container.getService("authService");
    this.logger = container.logger;
  }

  public async signup(req: e.Request, res: e.Response) {
    try {

      const { username, email, password } = req.body;
      this.handleCredentials(
        signupSchema,
        { username, email, password },
        res
      )

      const result = await this.authService.register({
        username,
        email,
        password
      })

      if(!result) 
        throw new Error("Failed while creating user");

      res
        .status(201)
        .json({
          success: true,
          message: "user created"
        })

    } catch (err:any) {
      this.handleError(err, res)
    }
  }

  public async login(req: e.Request, res: e.Response) {
    try {

      const {email, password} = req.body;
      this.handleCredentials(
        loginSchema,
        { email, password },
        res
      )
      
      const credentials = {email, password};
      const user = await this.authService.login(credentials)
      const token = await this.authService.generateToken(user);

      res
        .status(200)
        .cookie("jwt", token)
        .json({
          success: true,
          message: "user logged in successfully" })
      
    } catch (err:any) {
      this.handleError(err, res);
    }
  }

  public async getUser(req: e.Request, res: e.Response) {
    try {
      const id  = req.query.id as string;

      if(!id) {
        res.status(401)
          .json({
            success: false,
            message: "credentials are missing"
          })
        return;
      }

      const user = await this.authService.getUser(id);
      if(!user) {
        res.status(404)
          .json({
            success: false,
            message: "no user found"
          })
        return;
      }

      res.status(200)
        .json({
          success: true,
          message: "user found",
          data: user
        })

    } catch (err:any) {
      this.handleError(err, res);
    }
  }
  
  public async streamUsers(_: e.Request, res: e.Response) {
    try {

      const users = await this.authService.streamUsers();
      res.status(200)
        .json({
          success: true,
          message: "data obtained",
          data: users
        })
      
    } catch (err:any) {
      this.handleError(err, res);
    }
  }
  
  
  public async logout(req: e.Request, res: e.Response) {
    try {
      
      
    } catch (err:any) {
      this.handleError(err, res);
    }
  }
  public async verify() {}
  public async forgotPassword() {}
  public async changePassword() {}
  public async updateProfile() {}


  private async handleCredentials(
    schema: Schemas,
    data: any,
    res: e.Response) {
    
      const checkResult = schema.safeParse(data)
      if(!checkResult.success) {
        res.status(401)
          .json({
            success: false,
            message: "Credentials are missing"
          })
        return;
      }
  }

  private handleError(err: any, res: e.Response) {
    this.logger.error(err.message || err);
    res
      .status(500)
      .json({
        success: false,
        message: err.message || err || "Something went wrong"
      })
  }
  
}


export default AuthController;
