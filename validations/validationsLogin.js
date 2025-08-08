import z from 'zod'

const loginSchema = z.object({
  username: z.string().min(4, {
    message: 'Username must have at least 4 characters'
  }).max(15, {
    message: 'username must be shorter than 15'
  }),
  password: z.string().min(6, {
    message: 'password must have at least 6 characters'
  }).max(15, {
    message: 'password must be shorter than 15'
  })
})

export const validateLogin = (object) => {
  return loginSchema.safeParse(object)
}