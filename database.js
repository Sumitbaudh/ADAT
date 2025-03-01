import mongoose from "mongoose"
export const connectDB = (uri) => mongoose
.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
