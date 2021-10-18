import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema()
export class Permission {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  module: string;
  @Prop()
  status: number;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.plugin(mongoosePaginate);

PermissionSchema.set('toObject', { virtuals: true });
PermissionSchema.set('toJSON', { virtuals: true });
