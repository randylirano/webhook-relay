import { PipeTransform } from '@nestjs/common';
import { z } from 'zod';
import { ProblemError } from './problem';

/** Validates a request part against a Zod schema; failures become 400 validation_error. */
export class ZodPipe<S extends z.ZodType> implements PipeTransform<unknown, z.output<S>> {
  constructor(private readonly schema: S) {}

  transform(value: unknown): z.output<S> {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    throw new ProblemError('validation_error', 400, 'request failed validation', {
      errors: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
}
