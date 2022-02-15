import { client } from "../../prisma/client"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

interface IRequest{
    username: string
    password: string
}

class AuthenticateUserCase {

    async execute({username, password}: IRequest){
        // verificar se usuário existe

        const userAlreadyExists = await client.user.findFirst({
            where: {
                username
            }
        });
        if(!userAlreadyExists){
            throw new Error("User or password incorrect")
        }

        // verificar se a senha está correta

        const passwordMatch = await compare(password, userAlreadyExists.password)

        if(!passwordMatch){
            throw new Error("User or password incorrect")
        }

        // gerar token do usuario 
        const generateTokenProvider = new GenerateTokenProvider()
        const token = await generateTokenProvider.execute(userAlreadyExists.id);

        await client.refreshToken.deleteMany({
            where: {
                userId: userAlreadyExists.id
            }
        })

        const generateRefreshToken = new GenerateRefreshToken();
        const refreshToken = await generateRefreshToken.execute(userAlreadyExists.id)

        return { token, refreshToken }
    }

}

export { AuthenticateUserCase }