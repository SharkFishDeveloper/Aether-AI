import prisma from "@/util/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        const {discordId,username}:
              {discordId:string,username:string} = await req.json();

              await prisma.user.update({
                where: { name: username },
                data: { discordId },
              });
          
        return NextResponse.json({message:"Added DiscordId successfully",status:200})
    } catch (error) {
        console.log(JSON.stringify(error))
        return NextResponse.json({message:"Try again later",status:400,error})
    }
}