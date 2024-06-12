import { Image } from "expo-image";

Image.prefetch(require("../../assets/images/banner-ef27-narrow.png"), { cachePolicy: "memory" }).catch();
Image.prefetch(require("../../assets/images/banner-ef27.png"), { cachePolicy: "memory" }).catch();
Image.prefetch(require("../../assets/images/banner_2023_logo.png"), { cachePolicy: "memory" }).catch();
Image.prefetch(require("../../assets/images/dealer_black.png"), { cachePolicy: "memory" }).catch();
