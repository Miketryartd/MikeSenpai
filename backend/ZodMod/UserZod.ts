import * as z from "zod";

 const UserSchemaZOD = z.object({
    email: z.string().min(11),
    password: z.string().min(8)
})

export default UserSchemaZOD;