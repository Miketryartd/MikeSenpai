import * as z from "zod";

 const CommentSchemaZod = z.object({
   comment: z.string().min(1),
   id: z.number(),
   finder: z.string().min(1),

})

export default CommentSchemaZod;