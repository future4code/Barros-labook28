import { BaseDataBase } from "./BaseDataBase";
import { CustomError } from "../error/customError";
import { commentModel, like, post } from "../model/types";

export class PostDataBase extends BaseDataBase {
    private TABLE_POSTS = "labook_posts";
    private TABLE_LIKES = "labook_likes";
  private TABLE_COMMENTS = "labook_comments";

     public createPost = async (post: post): Promise<void> => {
    try {
      BaseDataBase.connection.initialize();
      await BaseDataBase.connection
        .insert({
          id: post.id,
          photo: post.photo,
          description: post.description,
          type: post.type,
          author_id: post.author_id,
        })
        .into(this.TABLE_POSTS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };

  public getPostById = async (id: string) => {
    try {
      
        BaseDataBase.connection.initialize();
      const result = await BaseDataBase.connection(this.TABLE_POSTS)
        .select("*")
        .where({ id });
      return result[0]
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };

  public getPostsByType = async (type: string): Promise<post[]> => {
    try {
        BaseDataBase.connection.initialize();
      const result = await BaseDataBase.connection
        .select("*")
        .from(this.TABLE_POSTS)
        .where({ type })
        .orderBy(`${this.TABLE_POSTS}.created_at`, "desc");
      return result;
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };

   public likePost = async (likes : like) => {
    try {
        BaseDataBase.connection.initialize();
      await BaseDataBase.connection
        .insert({
          id: likes.id,
          user_id: likes.user_id,
          post_id: likes.post_id,
        })
        .into(this.TABLE_LIKES);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };

  public unlikePost = async (id: string) => {
    try {
        BaseDataBase.connection.initialize();
      await BaseDataBase.connection(this.TABLE_LIKES).delete().where({ id });
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };

  public commentPost = async (comment: commentModel) => {
    try {
        BaseDataBase.connection.initialize();
      await BaseDataBase.connection
        .insert({
          id: comment.id,
          user_id: comment.user_id,
          post_id: comment.post_id,
          comment: comment.comment,
        })
        .into(this.TABLE_COMMENTS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    } finally {
        BaseDataBase.connection.destroy();
    }
  };
}