import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, id: string) {
    const baseSlug = slugify(createPostDto.title, {
      lower: true,
      strict: true,
    });

    let suffix = randomBytes(3).toString('hex');
    let slug = `${baseSlug}-${suffix}`;

    let isUnique = false;
    let attempts = 0;

    while (!isUnique) {
      const existing = await this.postRepository.findOne({ where: { slug } });

      if (!existing) {
        isUnique = true;
      } else {
        suffix = randomBytes(3).toString('hex');
        slug = `${baseSlug}-${suffix}`;
        attempts++;
      }

      if (attempts > 10) {
        throw new InternalServerErrorException(
          'Não foi possível gerar uma slug única',
        );
      }
    }

    const post = this.postRepository.create({
      ...createPostDto,
      slug,
      author: { id },
    });

    return await this.postRepository.save(post);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.postRepository.findAndCount({
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

  async findAllFromUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.postRepository.findAndCount({
      where: {
        author: { id: userId },
      },
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

  async findOne(slug: string) {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    return post;
  }

  async findOneFromUser(userId: string, slug: string) {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este post.',
      );
    }

    return post;
  }

  async update(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este post.',
      );
    }

    if (updatePostDto.title) {
      const baseSlug = slugify(updatePostDto.title, {
        lower: true,
        strict: true,
      });

      let suffix = randomBytes(3).toString('hex');
      let slug = `${baseSlug}-${suffix}`;

      let isUnique = false;
      let attempts = 0;

      while (!isUnique) {
        const existing = await this.postRepository.findOne({ where: { slug } });

        if (!existing) {
          isUnique = true;
        } else {
          suffix = randomBytes(3).toString('hex');
          slug = `${baseSlug}-${suffix}`;
          attempts++;
        }

        if (attempts > 10) {
          throw new InternalServerErrorException(
            'Não foi possível gerar uma slug única',
          );
        }
      }
      post.slug = slug;
    }

    this.postRepository.merge(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado.');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este post.',
      );
    }
    await this.postRepository.remove(post);

    return { message: 'Post apagado com sucesso.' };
  }
}
