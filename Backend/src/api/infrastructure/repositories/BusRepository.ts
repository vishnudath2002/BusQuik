import { IBusRepository } from "../../../core/interfaces/IBusRepository";
import { Bus } from "../../../core/entities/Bus";
import Buses from "../db/models/Buses";
import { Types } from "mongoose";

export class BusRepository implements IBusRepository {
 

 

  async findById(busId: string): Promise<Bus | null> {
    const busDoc = await Buses.findById(busId).exec();
    if (!busDoc) return null;
    
    return new Bus(
      busDoc._id.toString(),
      busDoc.OwnerId.toString(),

      busDoc.Name,
      busDoc.Status !== null ? busDoc.Status : "Inactive",

      busDoc.Type,
      busDoc.SeatsAvailable !== null ? busDoc.SeatsAvailable.toString() : "0",
      // busDoc.Amenities,
      busDoc.CreatedAt,
      busDoc.UpdatedAt,
      busDoc.SeatsTotal !== null ? busDoc.SeatsTotal : 0 ,
      busDoc.BusDoc !== null ? busDoc.BusDoc : null,
      busDoc.Ac !== null ? busDoc.Ac : null,
      
    );
  }


   async addBus(bus: Bus): Promise<Bus | null> {
    const existingBus = await Buses.findOne({ 
      OwnerId: bus.ownerId,
      Name: bus.name 
    });
    if (existingBus) {
      return null;  
    }
    const busToSave = new Buses({
      OwnerId: bus.ownerId,
      Name: bus.name,
      Status: bus.status,
      Type: bus.type,
      SeatsAvailable: bus.seatsAvailable,
      SeatsTotal: bus.seatsTotal,
      CreatedAt: bus.createdAt,
      UpdatedAt: bus.updatedAt,
      Ac:bus.ac,

    });
    const data = await busToSave.save();
    return {
        id: data._id.toString(),
        ownerId: data.OwnerId.toString(),
        name: data.Name,
        status: data.Status ?? "Inactive",
        type: data.Type,
        seatsAvailable: data.SeatsAvailable?.toString() ?? "0",
        seatsTotal: data.SeatsTotal ?? 0,
        createdAt: data.CreatedAt,
        updatedAt: data.UpdatedAt,
        busDoc: data.BusDoc,
        ac: data.Ac,
       
    };
   }

   async getBusByOwnerId(
    ownerId: Types.ObjectId,
    searchQuery: string = '',
    page: number = 1,
    limit: number = 10,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any> = {}
  ): Promise<Bus[]> {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(searchQuery, 'i'); // case-insensitive
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      OwnerId: ownerId,
      ...filters,
      $or: [
        { Name: searchRegex },
        { Type: searchRegex },
        { Status: searchRegex }
      ]
    };
  
    const busDocs = await Buses.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ CreatedAt: -1 });
  
    return busDocs.map(bus => new Bus(
      bus._id.toString(),
      bus.OwnerId.toString(),
      bus.Name,
      bus.Status !== null ? bus.Status : "Inactive",
      bus.Type,
      bus.SeatsAvailable !== null ? bus.SeatsAvailable.toString() : "0",
      bus.CreatedAt,
      bus.UpdatedAt,
      bus.SeatsTotal !== null ? bus.SeatsTotal : 0,
      bus.BusDoc !== null ? bus.BusDoc : null,
      bus.Ac !== null ? bus.Ac : null
    ));
  }
  


  async updateBus(busId: string, updateData: Partial<Bus>): Promise<Bus | null> {
    const updatedBus = await Buses.findByIdAndUpdate(busId,  { $set: updateData }, 
      { new: true, runValidators: true }).exec();
    if (!updatedBus) return null;

    return new Bus(
      updatedBus._id.toString(),
      updatedBus.OwnerId.toString(),
      updatedBus.Name,
      updatedBus.Status ?? "Inactive",
      updatedBus.Type,
      updatedBus.SeatsAvailable?.toString() ?? "0",
      updatedBus.CreatedAt,
      updatedBus.UpdatedAt,
      updatedBus.SeatsTotal ?? 0,
      updatedBus.BusDoc ?? null,
      updatedBus.Ac ?? null,
    );
  }

  async deleteBus(busId: string): Promise<boolean> {
    const result = await Buses.findByIdAndDelete(busId).exec();
    return result !== null;
  }

  

 
}
