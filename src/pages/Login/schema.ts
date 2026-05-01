import z from "zod";

const loginSchema = z.object({
    email: z.email('Digite um e-mail válido').min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export { loginSchema, type LoginFormInputs };