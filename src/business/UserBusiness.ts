import { UserDataBase } from "../data/UserDataBase";
import { CustomError } from "../error/customError";
import { FriendInputDTO, UserInputDTO } from "../model/inputsDTO";
import { user, makeFriend, post } from "../model/types";
import { generateId } from "../services/idGenerator";

const userDatabase = new UserDataBase();

export class UserBusiness {

  async createUser(input: UserInputDTO): Promise<void> {
    try {
      const userDatabase = new UserDataBase();

      const { name, email, password } = input;

      if (!name || !email || !password) {
        let message = `"name", "email" e "password" deve ser fornecidos!'`;
        throw new Error(message);
      }
      if (email.indexOf("@") === -1) {
        throw new Error("email inválido!");
      }
      if (password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
      }
      if (name.length < 3) {
        throw new Error("O nome deve ter pelo menos 3 caracteres.");
      }

      const id: string = generateId();

      const user: user = { id, name, email, password };

      await userDatabase.createUser(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async makeFriends(input: FriendInputDTO): Promise<void> {
    try {
      const { user_id, friend_id } = input;

      if (!user_id || !friend_id) {
        throw new Error("user_id e friend_id devem ser fornecidos.");
      }

      if (user_id === friend_id) {
        throw new Error("user_id e friend_id devem ser diferentes.");
      }

      if (user_id.length !== 36 || friend_id.length !== 36) {
        throw new Error("id inválido, forneça um que seja válido.");
      }

      const id: string = generateId();

      const makeFriend: makeFriend = {
        id,
        user_id,
        friend_id,
      };

      await userDatabase.makeFriends(makeFriend);
      
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  async unFriend(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Id deve ser fornecido.");
      }

      await userDatabase.unFriend(id);
      
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  async getFeedByFriends(id: string): Promise<post[]> {
    try {
      if (!id) {
        throw new Error("Id deve ser fornecido.");
      }

      if (id.length !== 36) {
        throw new Error("id inválido, forneça um que seja válido.");
      }

      return await userDatabase.getFeedByFriends(id);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }  

}
