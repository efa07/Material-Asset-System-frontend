import { PartialType } from '@nestjs/swagger';
import { CreateAssetDisposalDto } from './create-asset-disposal.dto';

export class UpdateAssetDisposalDto extends PartialType(
  CreateAssetDisposalDto,
) {}
