import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { type LoginFormInputs, loginSchema } from './schema';
import { 
  Box, 
  Grid, 
  VStack, 
  Heading, 
  Input, 
  Button, 
  Center 
} from '@chakra-ui/react';
import { Field } from "@/components/ui/field";
import AuthCarousel from './components/AuthCarousel';

export function Login() {
  const { signIn } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await signIn(data);
    } catch (error) {
      alert(`Erro ao entrar. ${error}`);
    }
  };

  return (
    <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} h='100vh' w="100vw">
      
      <AuthCarousel />

      <Center bg="bg.panel" p={8}>
        <VStack 
          as="form" 
          onSubmit={handleSubmit(onSubmit)} 
          gap="8" 
          w="full" 
          maxW="350px" 
          align="stretch"
        >
          <VStack align="start" gap="1">
            <Heading size="3xl">Admin Login</Heading>
            <Box color="fg.muted">Bem-vindo de volta!</Box>
          </VStack>

          <VStack gap="4">
            <Field 
              label="Email" 
              invalid={!!errors.email} 
              errorText={errors.email?.message}
            >
              <Input 
                {...register('email')} 
                placeholder="seu@email.com" 
                variant="outline"
              />
            </Field>

            <Field 
              label="Senha" 
              invalid={!!errors.password} 
              errorText={errors.password?.message}
            >
              <Input 
                type="password" 
                {...register('password')} 
                placeholder="******" 
                variant="outline"
              />
            </Field>
          </VStack>

          <Button 
            type="submit" 
            variant="outline"
            colorPalette="blue" 
            size="lg" 
            width="full"
            fontWeight="bold"
            loading={isSubmitting}
          >
            Entrar
          </Button>
        </VStack>
      </Center>
    </Grid>
  );
}