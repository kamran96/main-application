import { Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import axios from 'axios';
import { IRequest } from '@invyce/interfaces';
import { ItemLedgerDetailDto } from '../dto/ItemLedger.dto';
import { ItemLedgerRepository } from '../repositories/itemLedger.repository';

@Injectable()
export class InventoryService {
  async ManageInventory(data: ItemLedgerDetailDto, req: IRequest) {
    let token;
    if (process.env.NODE_ENV === 'development') {
      const header = req.headers?.authorization?.split(' ')[1];
      token = header;
    } else {
      if (!req || !req.cookies) return null;
      token = req.cookies['access_token'];
    }

    const tokenType =
      process.env.NODE_ENV === 'development' ? 'Authorization' : 'cookie';
    const value =
      process.env.NODE_ENV === 'development'
        ? `Bearer ${token}`
        : `access_token=${token}`;

    const http = axios.create({
      baseURL: 'http://localhost',
      headers: {
        [tokenType]: value,
      },
    });

    for (const i of data.payload) {
      const details = {
        type: i.type,
        targetId: i.targetId,
        value: i.value,
      };
      await getCustomRepository(ItemLedgerRepository).save({
        itemId: i.itemId,
        details: JSON.stringify(details),
        branchId: req.user.branchId,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
        updatedById: req.user.id,
        status: 1,
      });
    }

    await http.post(`items/item/manage-stock`, {
      payload: data.payload,
    });
  }
}
