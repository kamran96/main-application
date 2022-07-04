import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { ISetting } from '../interfaces';
import { SettingRepository } from '../repositories';

@Injectable()
export class SettingService {
  async ListStorage(settingData) {
    const settingRepository = getCustomRepository(SettingRepository);
    const setting = await settingRepository.find({
      where: {
        status: 1,
        branchId: settingData.branchId,
      },
    });
    return setting;
  }

  async CreateStorage(settingDto, settingData): Promise<ISetting> {
    const settingRepository = getCustomRepository(SettingRepository);
    const setting = await settingRepository.save({
      name: settingDto.name,
      type: settingDto.type,
      branchId: settingData.branchId,
      status: 1,
      createdById: settingData.userId,
      updatedById: settingData.userId,
    });
    return setting;
  }
}
