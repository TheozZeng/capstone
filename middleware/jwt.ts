import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

export interface TokenUser {
  username: string
  _id: string
}
export interface AuthNextApiRequest extends NextApiRequest {
  auth: TokenUser
}

export const useJwt =
  (handler) => async (req: AuthNextApiRequest, res: NextApiResponse) => {
    const header = req.headers['authorization']
    if (header) {
      const encoded = header.slice('Bearer '.length)
      if (encoded) {
        try {
          const user = jwt.verify(encoded, process.env.JWT_SECRET)
          const { iat, exp, ...userInfo } = user as {
            exp: number
            iat: number
          } & TokenUser
          req.auth = userInfo
        } catch (err) {
          return res
            .status(401)
            .json({ message: `Unauthorized. Token is invalid. ${err.message}` })
        }
      } else {
        return res
          .status(401)
          .json({ message: 'Unauthorized. Token is empty.' })
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return handler(req, res)
  }
