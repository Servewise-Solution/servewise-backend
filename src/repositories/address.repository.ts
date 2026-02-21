import type { IAddressRepository } from "../interfaces/repository/address.repository.js";
import { Address, type IAddress } from "../models/address.model.js";
import { BaseRepository } from "./base.repository.js";
import { Types } from "mongoose";

export class AddressRepository
  extends BaseRepository<IAddress>
  implements IAddressRepository
{
  constructor() {
    super(Address);
  }

  async upsertProviderAddress(
    providerId: string,
    addressData: Partial<IAddress>
  ): Promise<IAddress> {
    const address = await this.model.findOneAndUpdate(
      { providerId: new Types.ObjectId(providerId) },
      {
        ...addressData,
        providerId: new Types.ObjectId(providerId),
      },
      {
        new: true,
        upsert: true,
      }
    );

    return address;
  }
}
