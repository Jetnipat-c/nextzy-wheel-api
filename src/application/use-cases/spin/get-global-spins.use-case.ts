import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions } from '@domain/common/pagination';
import { SPIN_RESULT_REPOSITORY } from '@domain/repositories/spin-result.repository';
import type { SpinResultRepository } from '@domain/repositories/spin-result.repository';

@Injectable()
export class GetGlobalSpinsUseCase {
  constructor(
    @Inject(SPIN_RESULT_REPOSITORY)
    private readonly spinResultRepository: SpinResultRepository,
  ) {}

  async execute(input: PaginationOptions) {
    return this.spinResultRepository.findAll({
      page: input.page,
      limit: input.limit,
    });
  }
}
