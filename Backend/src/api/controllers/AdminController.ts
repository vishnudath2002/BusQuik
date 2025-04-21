import { Request, Response } from "express";
import { IListOwner } from "../../core/iusecases/IAdminUseCase/IListOwner";
import { IListUser } from "../../core/iusecases/IAdminUseCase/IListUser";
import { ILoginAdmin } from "../../core/iusecases/IAdminUseCase/ILoginAdmin";
import { IToggleBlockStatus } from "../../core/iusecases/IAdminUseCase/IToggleBlockStatus";
import { HttpStatus } from "../constants/HttpStatus";







export class AdminController {

  constructor(
    private _loginAdmin:  ILoginAdmin,
    private _listUser: IListUser,
    private _listOwner: IListOwner,
    private _toggleBlockStatus: IToggleBlockStatus
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const admin = await this._loginAdmin.execute( email , password );
      res.cookie("refreshToken", admin.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(HttpStatus.OK).json(admin);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: "An unknown error occurred" });
      }
    }
  }

  

  async getUserList(req: Request, res: Response) {
    try {
      const role = req.query.role as string || '';
    const searchQuery = req.query.searchQuery as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

      const users = await this._listUser.execute(role, searchQuery, page, limit);
      res.status(HttpStatus.OK).json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: "An unknown error occurred" });
      }
    }
  }

  async getOwnerList(req: Request, res: Response) {
    try {
      const owners = await this._listOwner.execute();
      res.status(HttpStatus.OK).json(owners);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: "An unknown error occurred" });
      }
    }
  }

  async toggleBlock(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await this._toggleBlockStatus.execute(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: "An unknown error occurred" });
      }
    }
  }
}
