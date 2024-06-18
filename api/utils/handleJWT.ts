import jwt, { Secret } from "jsonwebtoken"

type Customer = {
  customer_id: number
  first_name: string
  last_name: string
}

export const signAccessJWT = (customer: Customer) => {
  const accessToken = jwt.sign(
    {
      id: customer.customer_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
    },
    process.env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: "10m",
    }
  )

  return accessToken
}

export const signRefreshToken = (id: string | number) => {
  const refreshToken = jwt.sign(
    { sub: id },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: "30d",
    }
  )
}
