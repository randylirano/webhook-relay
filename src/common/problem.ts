import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { Response } from 'express';

/** Stable error codes from docs/SPEC.md "Error model". Tests assert these, never messages. */
export type ProblemCode = 'validation_error' | 'unauthorized' | 'not_found' | 'internal_error';

/** Throw from anywhere; ProblemFilter renders it as application/problem+json. */
export class ProblemError extends Error {
  constructor(
    readonly code: ProblemCode,
    readonly status: number,
    readonly detail?: string,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(detail ?? code);
  }
}

const CODE_BY_STATUS: Record<number, ProblemCode> = {
  400: 'validation_error',
  401: 'unauthorized',
  404: 'not_found',
};

/** Maps every error to RFC 9457 problem+json with a `code` field. */
@Catch()
export class ProblemFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemFilter.name);

  catch(error: unknown, host: ArgumentsHost): void {
    const problem = this.toProblem(error);
    if (problem.status >= 500) this.logger.error(error);

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(problem.status)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title: problem.code,
        status: problem.status,
        code: problem.code,
        ...(problem.detail && { detail: problem.detail }),
        ...problem.extra,
      });
  }

  private toProblem(error: unknown): ProblemError {
    if (error instanceof ProblemError) return error;
    if (error instanceof HttpException) {
      const status = error.getStatus();
      const code =
        CODE_BY_STATUS[status] ?? (status >= 500 ? 'internal_error' : 'validation_error');
      return new ProblemError(code, status, error.message);
    }
    return new ProblemError('internal_error', 500);
  }
}
