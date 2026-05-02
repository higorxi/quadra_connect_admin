import type { ReactNode } from "react";
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { VStack, Button, Box } from "@chakra-ui/react";

interface FormWrapperProps<T extends FieldValues> {
  schema: ZodType<T, any, any>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => ReactNode;
  isLoading?: boolean;
  buttonLabel?: string;
}

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  isLoading,
  buttonLabel = "Salvar",
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema), 
    defaultValues,
  });

  return (
    <Box as="form" onSubmit={methods.handleSubmit(onSubmit)} width="full">
      <VStack gap={5} align="stretch">
        {children(methods)}

        <Button
          type="submit"
          loading={isLoading}
          colorPalette="primary"
          width="full"
          mt={2}
        >
          {buttonLabel}
        </Button>
      </VStack>
    </Box>
  );
}
