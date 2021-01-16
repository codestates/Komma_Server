import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getManager } from "typeorm";
import User from "../../entity/User";

export default async (req: Request, res: Response) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(400).send({ "data": null, "message": "invalid access token" });
  } else {
    const token = authorization.split(' ')[1];// barer 빼고 토큰만 가져오기 
    const data: any = jwt.verify(token, process.env.ACCESS_SECRET);//토큰 유효한지 확인하는 작업 verify 토큰 내용 가져오기 

    const UserInfo = await getManager()
      .createQueryBuilder(User, "user")
      .innerJoinAndSelect("user.playlists", "playlist")
      .innerJoinAndSelect("playlist.savesongs", "savesong")
      .where("user.id = :id", { id: data.id})
      .getOne();

    res.status(200).send({
      "userInfo": {
        id: UserInfo.id,
        email: UserInfo.email,
        username: UserInfo.username,
        darkmode: UserInfo.darkMode,
        sitecolor: UserInfo.siteColor,
      },
      "playlists": UserInfo.playlists
    })
  }
}
