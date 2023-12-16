import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

prismaClientSingleton().$use(async (params, next) => {
  if (
    params.model === "User" &&
    (params.action === "create" || params.action === "update")
  ) {
    let password = params.args.data.password;

    if (password) {
      bcrypt.genSalt(10, async function (_, salt) {
        bcrypt.hash(password, salt, function (_, hash) {
          params.args.data.password = hash;
        });
      });
    }
  }

  // Manipulate user password
  const result = await next(params);

  return result;
});

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
