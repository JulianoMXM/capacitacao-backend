import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRespository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const comment = this.commentRespository.create({
      ...createCommentDto,
      post: { id: postId },
      author: { id: userId },
    });

    return await this.commentRespository.save(comment);
  }

  async findAllFromPost(postId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    const [data, totalItems] = await this.commentRespository.findAndCount({
      where: { post: { id: postId } },
      take: limit,
      skip: skip,
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async update(
    userId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRespository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esse comentário.',
      );
    }

    this.commentRespository.merge(comment, updateCommentDto);
    return await this.commentRespository.save(comment);
  }

  async remove(userId: string, commentId: string) {
    const comment = await this.commentRespository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esse comentário.',
      );
    }

    await this.commentRespository.remove(comment);
    return { message: 'Comentário deletado com sucesso.' };
  }
}
