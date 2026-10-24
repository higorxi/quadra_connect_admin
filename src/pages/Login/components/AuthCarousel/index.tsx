import { Box, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import wallpaper1 from "../../../../assets/images/login/login_wallpaper_1.png";
import wallpaper2 from "../../../../assets/images/login/login_wallpaper_2.png";
import wallpaper3 from "../../../../assets/images/login/login_wallpaper_3.png";
import wallpaper4 from "../../../../assets/images/login/login_wallpaper_4.png";

const AuthCarousel = () => {
    const [index, setIndex] = useState(0);

    const images = [wallpaper1, wallpaper2, wallpaper3, wallpaper4];

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