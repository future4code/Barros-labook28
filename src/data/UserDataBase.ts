import { BaseDataBase } from "./BaseDataBase";
import { CustomError } from "../error/customError";
import { makeFriend, post, user } from "../model/types";

export class UserDataBase extends BaseDataBase {
  private TABLE_USERS = "labook_users";
  private TABLE_POSTS = "labook_posts";
  private TABLE_FRIENDS = "labook_friends";

  public createUser = async (user: user): Promise<void> => {
    try {
      BaseDataBase.connection.initialize();
      await BaseDataBase.connection
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into(this.TABLE_USERS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
      BaseDataBase.connection.destroy();
    }
  };

  public makeFriends = async (friends: makeFriend) => {
    try {
      BaseDataBase.connection.initialize();
      await BaseDataBase.connection
        .insert({
          id: friends.id,
          user_id: friends.user_id,
          friend_id: friends.friend_id,
        })
        .into(this.TABLE_FRIENDS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
      BaseDataBase.connection.destroy();
    }
  };

  public unFriend = async (id: string) => {
    try {
      BaseDataBase.connection.initialize();
      await BaseDataBase.connection(this.TABLE_FRIENDS).delete().where({ id });
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
      BaseDataBase.connection.destroy();
    }
  };

  public getFeedByFriends = async (id: string): Promise<post[]> => {
    try {
      BaseDataBase.connection.initialize();
      const result = await BaseDataBase.connection
        .select("*")
        .from(this.TABLE_POSTS)
        .join(
          this.TABLE_FRIENDS,
          `${this.TABLE_POSTS}.author_id`,
          `${this.TABLE_FRIENDS}.friend_id`
        )
        .where(`${this.TABLE_FRIENDS}.user_id`, id)
        .orderBy(`${this.TABLE_POSTS}.created_at`, "desc")
        .limit(5);
      return result;
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
      BaseDataBase.connection.destroy();
    }
  };
}
