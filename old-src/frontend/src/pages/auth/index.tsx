import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import AuthLayout from "./layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Typography, Box } from "@mui/material";
import styles from "@/../styles/auth.module.css";
import { useEffect } from "react";


export default function PageAuth() {
    const params = useSearchParams();
    const mode = params.get("mode")?.toLowerCase();
    const router = useRouter();
    
    const loginSchema = z.object({
        email: z.string().email({message: "E-mail inválido"}),
        password: z.string(),
    });
    
    const signUpSchema = z.object({
        email: z.string().email({message: "E-mail inválido"}),
        password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
        confirmPassword: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    });

    const { register, handleSubmit, formState : { errors }, clearErrors } = useForm({
        resolver: zodResolver(mode === "login" ? loginSchema : signUpSchema),
    });

    function handleLogin(data: any) {
        router.push('/crud-profissionais')
        console.log(data);
    }

    function handleSignUp(data: any) {
        console.log(data);
    }

    const toggleMode = () => {
        const newMode = mode === "login" ? "signup" : "login";
        clearErrors();
        router.push(`/auth?mode=${newMode}`);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit(mode === "login" ? handleLogin : handleSignUp)} className={styles.form}>
                <Typography variant="overline" fontSize={'1rem'}>{mode === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}</Typography>
                <TextField label="E-mail" variant="filled" type="email" fullWidth {...register("email")} error={!!errors.email} helperText={errors.email?.message as string} />
                <TextField label="Senha" variant="filled" type="password" fullWidth {...register("password")} error={!!errors.password} helperText={errors.password?.message as string} />
                <Button variant="contained" type="submit" fullWidth >{mode === "login" ? "Entrar" : "Cadastrar"}</Button>
                <Box>
                    <Typography variant="overline" fontSize={'0.8rem'}>{mode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}</Typography>
                    <Button variant="text" onClick={toggleMode}>{mode === "login" ? "Cadastre-se" : "Entrar"}</Button>
                </Box>
            </form>
        </AuthLayout>
    )
}