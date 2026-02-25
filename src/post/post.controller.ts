import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import type { RequestWithUser } from 'src/auth/types/request-with-user';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: RequestWithUser,
  ) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Get()
  getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.postService.findAll(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getAllMe(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: RequestWithUser,
  ) {
    return this.postService.findAllFromUser(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.postService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:slug')
  getOneMe(@Param('slug') slug: string, @Request() req: RequestWithUser) {
    return this.postService.findOneFromUser(req.user.id, slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  update(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: RequestWithUser,
  ) {
    return this.postService.update(req.user.id, postId, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.postService.remove(req.user.id, id);
  }
}
