import { User } from "../../generated/prisma";
import db from "../../db";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import env from "../../env";
import { authConfig } from "../../config";

class AuthService {
  
  public async register(user: {
    email: string
    username: string,
    password: string,
  }): Promise<User> {

    const oldUser = await db.user.findFirst({
      where: {email: user.email}
    })

    if(oldUser) throw new Error("user already exits");

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await db.user.create({data: {
      username: user.username,
      email: user.email,
      password: hashedPassword
    }})

    if(!newUser) throw new Error("Failed while creating user");
    return newUser;
  }

  public async login(credentials: {
    email: string,
    password: string
  }): Promise<User> {

    const existingUser = await db.user.findFirst({
      where: {email: credentials.email}
    })

    if(!existingUser) throw new Error("user not found");
    const isMatch = await bcrypt.compare(
      credentials.password, existingUser.password);

    if(!isMatch) throw new Error("invalid credentials");
    return existingUser;
  }
  
  public async getUser(id: string)
    : Promise<User | false> {
      const user = await db.user.findUnique({
        where: {id}
      })
      
      return user ?? false;
  }
  
  public async streamUsers(){
    const users = await db.user.findMany({});
    return users 
  }
  
  public async generateToken(user:User)
    : Promise<string> {
    const token = await jwt.sign(
      { 
        id: user.id,
        email: user.email,
        image: user.image 
      },
      env.JWT_SECRET || authConfig.JWT_SECRET,
      { "expiresIn": "7d" } 
    )
    
    return token;
  }

  public async updateUser() {}
  public async updatePassword() {}
  public async forgotPassword() {}
  public async logout() {


  }
  public async verify() {}
}


export default AuthService;