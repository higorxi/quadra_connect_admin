import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // 1. Defina aqui sua paleta de cores bruta
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#cce5ff" },
          500: { value: "#0078ff" }, // Sua cor principal
          600: { value: "#0062cc" }, // Hover da principal
          900: { value: "#001a33" },
        },
        accent: {
          500: { value: "#ffcc00" }, // Uma cor de destaque (ex: amarelo)
        }
      },
      fonts: {
        body: { value: "Inter, sans-serif" },
        heading: { value: "Montserrat, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        // 2. Mapeie os nomes que você usará no código para os tokens acima
        // Isso facilita se você quiser mudar a cor "primary" no futuro em um só lugar
        primary: {
          value: { base: "{colors.brand.500}", _dark: "{colors.brand.100}" }
        },
        "primary.hover": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.50}" }
        }
      }
    },
    recipes: {
      // 3. Customização global dos botões
      button: {
        variants: {
          visual: {
            // Criando a variante 'primary'
            primary: {
              bg: "primary",
              color: "white",
              _hover: { bg: "primary.hover" },
            },
            // Customizando a variante 'outline' que você mencionou
            outline: {
              border: "2px solid",
              borderColor: "accent.500",
              color: "accent.500",
              bg: "transparent",
              _hover: { bg: "accent.500", color: "white" },
            },
          },
        },
        defaultVariants: {
          visual: "primary",
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)