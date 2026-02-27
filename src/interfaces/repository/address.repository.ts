import { type IAddress } from "../../interfaces/model/addressModel.interface.js";

export interface IAddressRepository {
  upsertProviderAddress(
    providerId: string,
    addressData: Partial<IAddress>,
  ): Promise<IAddress>;
}
