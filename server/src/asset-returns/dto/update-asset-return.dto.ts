import { PartialType } from '@nestjs/swagger';
import { CreateAssetReturnDto } from './create-asset-return.dto';

export class UpdateAssetReturnDto extends PartialType(CreateAssetReturnDto) {}
