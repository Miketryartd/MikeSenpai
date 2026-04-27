import * as z from "zod";

 const CommentSchemaZod = z.object({
   comment: z.string()
})

export default CommentSchemaZod;