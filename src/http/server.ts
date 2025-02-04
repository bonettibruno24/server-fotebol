import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createUserRoute } from "./routes/create-user";
import fastifyCors from '@fastify/cors'
import { loginUserRoute } from "./routes/create-auth-login";
import { recoveryPasswordRoute } from "./routes/recovery-passowrd";
import { resetPasswordRoute } from "./routes/reset-password-user";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createUserRoute)
app.register(loginUserRoute)
app.register(recoveryPasswordRoute)
app.register(resetPasswordRoute)

app.listen({
  port: 3333,
})
.then(() => {
  console.log("HTTP Server is running!");
})