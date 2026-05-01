import { Box, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";


const AuthCarousel = () => {
    const [index, setIndex] = useState(0);

    const images = [
        "https://playpiso.com.br/wp-content/uploads/2021/09/quadras-esportivas-1-playpiso.png",
        "https://www.jmarinhoprojetos.com.br/blog/doutor/uploads/0/blog/2024/12/blog-melhores-projetos-de-quadras-poliesportivas-5a9e1924f2.png",
    ] as const;

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <Box position="relative" overflow="hidden" display={{ base: 'none', lg: 'block' }}>
            {images.map((src, i) => (
                <Image
                    key={src}
                    src={src}
                    alt="Background"
                    objectFit="cover"
                    position="absolute"
                    w="full"
                    h="full"
                    transition="opacity 1s ease-in-out"
                    opacity={index === i ? 1 : 0}
                />
            ))}
            <Box position="absolute" inset="0" bg="blackAlpha.400" />
        </Box>
    );
};

export default AuthCarousel;