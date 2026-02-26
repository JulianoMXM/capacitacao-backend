import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { RequestWithUser } from 'src/auth/types/request-with-user';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('comment/me')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(
    @Request() req: RequestWithUser,
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(req.user.id, postId, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Param('id') postId: string,
  ) {
    return this.commentService.findAllFromPost(
      postId,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.update(req.user.id, id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.commentService.remove(req.user.id, id);
  }
}
