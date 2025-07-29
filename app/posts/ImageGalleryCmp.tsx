"use client";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ImageGalleryCmp({
  images,
}: {
  images: { thumbnail: string; original: string }[];
}) {
  return <ImageGallery items={images} />;
}
