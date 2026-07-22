import type { Metadata } from "next";
import { ServicesReferencePage } from "@/components/site/reference-pages";
export const metadata:Metadata={title:"Сервисы",description:"Аудит, проектирование, монтаж и техническое сопровождение 24/7."};
export default function Page(){return <ServicesReferencePage/>;}
