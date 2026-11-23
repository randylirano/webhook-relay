import { createHash, timingSafeEqual } from 'node:crypto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { env } from '../config/env';
import { ProblemError } from './problem';

const digest = (s: string): Buffer => createHash('sha256').update(s).digest();

/** Static bearer key for write routes (docs/SPEC.md: API_KEY env var). */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly expected = digest(env().API_KEY);

  canActivate(context: ExecutionContext): boolean {
    const header = context.switchToHttp().getRequest<Request>().headers.authorization ?? '';
    const [scheme, token] = header.split(' ');
    // Hashing both sides gives equal-length buffers, so the comparison is constant-time.
    if (scheme === 'Bearer' && token && timingSafeEqual(digest(token), this.expected)) return true;
    throw new ProblemError('unauthorized', 401, 'missing or invalid API key');
  }
}
