export type BagType = "Suitcase" | "Hand luggage" | "Backpack" | "Toilet bag" | "Other";

export type BagImageId =
  | "backbag-2"
  | "backbag"
  | "case"
  | "handbag"
  | "suitcase-2"
  | "suitcase"
  | "tubebag";

export type Bag = {
  id: string;
  name: string;
  type: BagType;
  imageId: BagImageId;
};

export type BagImage = {
  id: BagImageId;
  label: string;
  src: any;
};

export const BAG_TYPES: { label: BagType; value: BagType }[] = [
  { label: "Suitcase", value: "Suitcase" },
  { label: "Hand luggage", value: "Hand luggage" },
  { label: "Backpack", value: "Backpack" },
  { label: "Toilet bag", value: "Toilet bag" },
  { label: "Other", value: "Other" },
];

// ✅ polku komponenttikansiosta -> assets
export const BAG_IMAGES: BagImage[] = [
  { id: "suitcase", label: "Suitcase", src: require("../../../assets/bags/suitcase.png") },
  { id: "suitcase-2", label: "Suitcase 2", src: require("../../../assets/bags/suitcase-2.png") },
  { id: "case", label: "Case", src: require("../../../assets/bags/case.png") },
  { id: "handbag", label: "Handbag", src: require("../../../assets/bags/handbag.png") },
  { id: "backbag", label: "Backbag", src: require("../../../assets/bags/backbag.png") },
  { id: "backbag-2", label: "Backbag 2", src: require("../../../assets/bags/backbag-2.png") },
  { id: "tubebag", label: "Tubebag", src: require("../../../assets/bags/tubebag.png") },
];

export function getBagImageSrc(imageId: BagImageId) {
  return BAG_IMAGES.find((x) => x.id === imageId)?.src ?? BAG_IMAGES[0].src;
}
