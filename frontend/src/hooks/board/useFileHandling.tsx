// import { fabric } from "fabric";
// import { loadImagesFromJSON, fitImageByShrinking, addImage, saveImagesToLocalFile } from "@/utils/fabricCanvasUtils";
//
// const useFileHandling = (canvas: fabric.Canvas | null, saveState: () => void) => {
//   const handleLoadImagesFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && canvas) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result;
//         if (result) {
//           loadImagesFromJSON(canvas, result as string);
//           saveState();
//         }
//       };
//       reader.readAsText(file);
//     }
//   };
//
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && canvas) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result;
//         if (result) {
//           fitImageByShrinking(result as string, 800, 600, (resizedImage) => {
//             addImage(canvas, resizedImage);
//             saveState();
//           });
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//
//   const handleAddImageByUrl = (url: string) => {
//     if (canvas) {
//       addImage(canvas, url);
//       saveState();
//     }
//   };
//
//   const handleSaveImages = () => {
//     saveImagesToLocalFile(canvas);
//   };
//
//   return { handleLoadImagesFromJson, handleFileChange, handleAddImageByUrl, handleSaveImages };
// };
//
// export default useFileHandling;
