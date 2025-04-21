import { Request, Response } from 'express';
import { IAddRoute } from '../../core/iusecases/IOwnerUseCase/IAddRoute';
import { IAddBus } from '../../core/iusecases/IOwnerUseCase/IAddBus';
import { IAddSchedule } from '../../core/iusecases/IOwnerUseCase/IAddSchedule';
import { GetBuses } from "../../core/usecases/OwnerUseCases/GetBuses";
import { GetRoutes } from "../../core/usecases/OwnerUseCases/GetRoutes";
import { GetSchedule } from "../../core/usecases/OwnerUseCases/GetSchedule";
import { IAddSeats } from '../../core/iusecases/IOwnerUseCase/IAddSeats';
import { SetSeats } from '../../core/usecases/OwnerUseCases/setSeats';
import { IEditBus } from '../../core/iusecases/IOwnerUseCase/IEditBus';
import { IDeleteBus } from '../../core/iusecases/IOwnerUseCase/IDeleteBus';
import { EditRoute } from '../../core/usecases/OwnerUseCases/EditRoute';
import { IDeleteRoute } from '../../core/iusecases/IOwnerUseCase/IDeleteRoute';
import { EditSchedule } from '../../core/usecases/OwnerUseCases/EditSchedule';
import { IDeleteSchedule } from '../../core/iusecases/IOwnerUseCase/IDeleteSchedule';
import { IGetBookings } from '../../core/iusecases/IOwnerUseCase/IGetBookings';
import { GetOperators } from '../../core/usecases/OwnerUseCases/GetOperators';
import { IAddRc } from '../../core/iusecases/IOwnerUseCase/IAddRc';
import { IAddDropStops } from '../../core/iusecases/IOwnerUseCase/IAddDropStops';
import { IAddPickupStops } from '../../core/iusecases/IOwnerUseCase/IAddPickupStops';
import { ICreateLayout } from '../../core/iusecases/IOwnerUseCase/ICreateLayout';
import { UpdateLayout } from '../../core/usecases/OwnerUseCases/UpdateLayout ';
import { IDeleteLayout } from '../../core/iusecases/IOwnerUseCase/IDeleteLayout';
import { GetLayout } from '../../core/usecases/OwnerUseCases/GetLayout';
import { HttpStatus } from '../constants/HttpStatus';



export class OwnerController {
  constructor(
    private _addBus: IAddBus,
    private _addRoute: IAddRoute,
    private _addSchedule: IAddSchedule,
    private _getBuses: GetBuses,
    private _getRoutes: GetRoutes,
    private _getSchedule: GetSchedule,
    private _addSeats: IAddSeats,
    private _setSeats: SetSeats,
    private _editBus: IEditBus,
    private _deleteBus: IDeleteBus,
    private _editRoute: EditRoute,
    private _deleteRoute: IDeleteRoute,
    private _editSchedule: EditSchedule,
    private _deleteSchedule: IDeleteSchedule,
    private _getBookings: IGetBookings,
    private _getOperator: GetOperators,
    private _addRc: IAddRc,
    private _addDropStops: IAddDropStops,
    private _addPickupStops: IAddPickupStops,
    private _createLayout: ICreateLayout,
    private _updateLayout: UpdateLayout,
    private _deleteLayout: IDeleteLayout,
    private _getLayout: GetLayout
  ) {}

  async createBus(req: Request, res: Response) {
    const { bus } = req.body;
    const result = await this._addBus.execute(bus);
    res.status(HttpStatus.OK).json(result);
  }

  async getBusByOwnerId(req: Request, res: Response) {
    try {
      const { ownerId } = req.params;
      const { search = '', page = '1', limit = '10', ...filters } = req.query;
  
      const result = await this._getBuses.execute(
        ownerId,
        search as string,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        filters
      );
  
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred while fetching buses',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  

  async createRoute(req: Request, res: Response) {
    const { route } = req.body;
    const result = await this._addRoute.execute(route);
    res.status(HttpStatus.OK).json(result);
  }

  async getRouteByOwnerId(req: Request, res: Response) {
    try {
      const { ownerId } = req.params;
      const {
        searchQuery = '',
        page = '1',
        limit = '10',
        ...filters
      } = req.query;
  
      const result = await this._getRoutes.execute(
        ownerId,
        searchQuery as string,
        parseInt(page as string),
        parseInt(limit as string),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters as Record<string, any>
      );
  
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
  

  async createSchedule(req: Request, res: Response) {
    const { schedule } = req.body;
    const result = await this._addSchedule.execute(schedule);
    res.status(HttpStatus.OK).json(result);
  }

  async getScheduleByOwnerId(req: Request, res: Response) {
    const { ownerId } = req.params;
    const result = await this._getSchedule.execute(ownerId);
    res.status(HttpStatus.OK).json(result);
  }

  async createSeats(req: Request, res: Response) {
    const { busId, seatCount, rowLabel } = req.body;
    const result = await this._addSeats.execute(busId, seatCount, rowLabel);
    res.status(HttpStatus.OK).json(result);
  }

  async setupSeats(req: Request, res: Response) {

    const { busId, scheduleId, availability } = req.body;
    const result = await this._setSeats.execute(busId, scheduleId, availability);
    res.status(HttpStatus.OK).json(result);

  }

  async updateBus(req: Request, res: Response){
    const { busId , updateData } = req.body;
    const result = await this._editBus.execute(busId,updateData);
    res.status(HttpStatus.OK).json(result);
  }

  async removeBus(req: Request, res: Response){
    const { busId } = req.body;
    const result = await this._deleteBus.execute(busId);
    res.status(HttpStatus.OK).json(result);
  }

  async updateRoute(req: Request,res: Response){
    const { routeId , updateData } = req.body;
    const result = await this._editRoute.execute(routeId,updateData);
    res.status(HttpStatus.OK).json(result);
  }
  
  async removeRoute(req: Request, res: Response){
    const { routeId } = req.body;
    const result = await this._deleteRoute.execute(routeId);
    res.status(HttpStatus.OK).json(result);
  }


  async updateSchedule(req: Request,res: Response){
    const { scheduleId , updateData } = req.body;
    const result = await this._editSchedule.execute(scheduleId,updateData);
    res.status(HttpStatus.OK).json(result);
  }

  
  async removeSchedule(req: Request, res: Response){
    const { scheduleId } = req.body;
    const result = await this._deleteSchedule.execute(scheduleId);
    res.status(HttpStatus.OK).json(result);
  }

  async fetchBookings(req: Request, res: Response) {
    const { ownerId } = req.params;
    const result = await this._getBookings.execute(ownerId);
    res.status(HttpStatus.OK).json(result);
  }

  async fetchOperators(req: Request, res: Response){
    const result = await this._getOperator.execute();
    res.status(HttpStatus.OK).json(result)
  }

  async uploadPhoto(req: Request, res: Response): Promise<void> {

    if (!req.file) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "File not found" });
        return;
    }

    const { busId } = req.body;

    try {
        const fileBuffer = req.file?.buffer; // Extract buffer from Multer's file object

        console.log("Received File Buffer:", fileBuffer); // Debugging output

        if (!fileBuffer) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid file buffer" });
            return;
        }

        const result = await this._addRc.execute(busId, fileBuffer);
        res.status(HttpStatus.OK).json(result);
    } catch (error) {
        console.error("Error uploading RC:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }


   async  moreDropStops(req: Request, res: Response) {
    try {
      const { routeId, dropStops } = req.body;
  
      if (!routeId) {
        res.status(400).json({ success: false, message: "Route ID is required." });
      }
      if (!Array.isArray(dropStops) || dropStops.length === 0) {
         res.status(400).json({ success: false, message: "Drop stops array cannot be empty." });
      }
  
      const success = await this._addDropStops.execute(routeId, dropStops);
  
      if (success) {
         res.status(200).json({ success: true, message: "Drop stops added successfully." });
      } else {
         res.status(500).json({ success: false, message: "Failed to add drop stops." });
      }
    } catch (error) {
      console.error("Error adding drop stops:", error);
       res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  async  morePickupStops(req: Request, res: Response) {
    try {
      const { routeId, pickupStops } = req.body;
  
      if (!routeId) {
        res.status(400).json({ success: false, message: "Route ID is required." });
      }
      if (!Array.isArray(pickupStops) || pickupStops.length === 0) {
         res.status(400).json({ success: false, message: "pickup Stops array cannot be empty." });
      }
  
      const success = await this._addPickupStops.execute(routeId, pickupStops);
  
      if (success) {
         res.status(200).json({ success: true, message: "pickup Stops added successfully." });
      } else {
         res.status(500).json({ success: false, message: "Failed to add pickup Stops." });
      }
    } catch (error) {
      console.error("Error adding drop stops:", error);
       res.status(500).json({ success: false, message: "Internal server error." });
    }
  }

  async generateLayout (req: Request, res: Response){
    try {
      const { rows, columnConfig, busId } = req.body;
      const layout = await this._createLayout.execute({ rows, columnConfig,  busId });
      res.status(201).json(layout);
    }catch (error) {
      console.error("Error while create layout:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
  };




  async editLayout(req: Request, res: Response) {
    try {
      const { layoutId, updateData } = req.body;
      const result = await this._updateLayout.execute(layoutId, updateData);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating layout:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }


  async removeLayout(req: Request, res: Response) {
    try {
      const { busId } = req.body;
      const result = await this._deleteLayout.execute(busId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting layout:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async showLayout(req: Request, res: Response) {
    try {
      const { busId } = req.params;
      const result = await this._getLayout.execute(busId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching layout:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  

}
