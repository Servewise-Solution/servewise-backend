import type { IAddress } from "../../models/address.model.js";

export interface IAddressRepository{
    upsertProviderAddress(
        providerId: string,
        addressData: Partial<IAddress>
      ): Promise<IAddress>
}