import type { Metadata } from "next";
import { CompanyReferencePage } from "@/components/site/reference-pages";
export const metadata:Metadata={title:"О компании",description:"Инженерная экспертиза Buyursin Technics."};
export default function Page(){return <CompanyReferencePage/>;}
