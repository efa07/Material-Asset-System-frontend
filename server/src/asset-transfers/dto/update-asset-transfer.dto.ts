import { PartialType } from '@nestjs/swagger';
import { CreateAssetTransferDto } from './create-asset-transfer.dto';

export class UpdateAssetTransferDto extends PartialType(
  CreateAssetTransferDto,
) {}
