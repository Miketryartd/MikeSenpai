import * as z from "zod";

 const SearchSchema = z.object({
    query: z.string()
})

export default SearchSchema;