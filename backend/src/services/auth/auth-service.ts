import db from "../../db";
import bcrypt from "bcryptjs"

class AuthService {
  
  public async register(user: {
    email: string
    username: string,
    password: string,
  }): Promise<boolean> {

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
    return true
  }

  public async login() {}
  public async logout() {}
  public async verify() {}
  public async getUser() {}
  public async streamUsers() {}
  public async updateUser() {}
  public async updatePassword() {}
  public async forgotPassword() {}
  
}


export default AuthService;