import { PostDataBase } from "../data/PostDataBase";
import { CustomError } from "../error/customError";
import { CommentInputDTO, LikeInputDTO, PostInputDTO } from "../model/inputsDTO";
import { post, like, commentModel } from "../model/types";
import { generateId } from "../services/idGenerator";

const postDatabase = new PostDataBase();

export class PostBusiness {
    async createPost(input: PostInputDTO): Promise<void> { 
    try {
      const { photo, description, type, author_id } = input;

      if (!photo || !description || !type || !author_id) {
        throw new Error(
          `"photo", "description", "type", e "author_id" devem ser fornecidos'`
        );
      }
      
      if (type !== "normal" && type !== "event") {
        throw new Error("O tipo deve ser 'normal' ou 'event'");
      }

      const id: string = generateId();

      const post: post = {
        id,
        photo,
        description,
        type,
        author_id: author_id,
      };

        await postDatabase.createPost(post);
        
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  async getPostById(id: string) {
    try {

      const posts = await postDatabase.getPostById(id)

      if (!posts) {
        throw new Error("Postagem não encontrada.");
      }

      return posts
      
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
 }

 async getPostsByType(type: string): Promise<post[]> {
  try {
    if (!type) {
      throw new Error("O tipo deve ser fornecido!");
    }

    if (type !== "normal" && type !== "event") {
      throw new Error("O tipo deve ser 'normal' ou 'event'");
    }

    return await postDatabase.getPostsByType(type);
  } catch (error: any) {
    throw new CustomError(error.statusCode, error.message);
  }
}

async likePost(input: LikeInputDTO): Promise<any> {
    try {
      const { user_id, post_id } = input;

      if (!user_id || !post_id) {
        throw new Error("user_id e post_id devem ser fornecidos!");
      }

      if (user_id.length !== 36 || post_id.length !== 36) {
        throw new Error("id inválido, forneça um que seja válido.");
      }

      const id: string = generateId();

      const like: like = {
        id,
        user_id,
        post_id,
      };

      return await postDatabase.likePost(like);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  async unlikePost(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Id deve ser fornecido!");
      }

      await postDatabase.unlikePost(id);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  async commentPost(input: CommentInputDTO): Promise<void> {
    try {
      const { user_id, post_id, comment } = input;

      if (!user_id || !post_id || !comment) {
        throw new Error("user_id, post_id e comment devem ser fornecidos.");
      }

      if (user_id.length !== 36 || post_id.length !== 36) {
        throw new Error("id inválido, forneça um que seja válido.");
      }

      const id: string = generateId();

      const commentRespost: commentModel = {
        id,
        user_id,
        post_id,
        comment,
      };

      await postDatabase.commentPost(commentRespost);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
  
}