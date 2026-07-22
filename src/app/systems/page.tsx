import type { Metadata } from "next";
import { SystemsOverviewPage } from "@/components/site/reference-pages";
export const metadata:Metadata={title:"Инженерные системы",description:"Все инженерные системы в одном контуре управления."};
export default function Page(){return <SystemsOverviewPage/>;}
