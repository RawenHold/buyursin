"use client";

import { toPng } from "html-to-image";

async function captureSlides(root: HTMLElement) {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-proposal-slide]"));
  if (!nodes.length) throw new Error("No proposal slides found");

  const images: string[] = [];
  for (const node of nodes) {
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#f7f8f5",
      filter: (element) => !(element instanceof HTMLElement && element.dataset.exportIgnore === "true"),
    });
    images.push(dataUrl);
  }
  return images;
}

export async function exportProposalPdf(root: HTMLElement, fileName: string) {
  const [{ jsPDF }, images] = await Promise.all([import("jspdf"), captureSlides(root)]);
  const width = 297;
  const height = 167.0625;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [width, height], compress: true });

  images.forEach((image, index) => {
    if (index > 0) pdf.addPage([width, height], "landscape");
    pdf.addImage(image, "PNG", 0, 0, width, height, undefined, "FAST");
  });
  pdf.save(`${fileName}.pdf`);
}

export async function exportProposalPptx(root: HTMLElement, fileName: string) {
  const [module, images] = await Promise.all([import("pptxgenjs"), captureSlides(root)]);
  const PptxGenJS = module.default;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Buyursin Technics";
  pptx.subject = "Commercial proposal";
  pptx.title = fileName;
  pptx.company = "Buyursin Technics";

  images.forEach((image) => {
    const slide = pptx.addSlide();
    slide.background = { color: "F7F8F5" };
    slide.addImage({ data: image, x: 0, y: 0, w: 13.333, h: 7.5 });
  });

  await pptx.writeFile({ fileName: `${fileName}.pptx` });
}
