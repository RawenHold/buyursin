import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SystemDetailPage } from "@/components/site/reference-pages";

const slugs=["energy","climate","leak","access","fire"];
export function generateStaticParams(){return slugs.map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const names:Record<string,string>={energy:"Энергия",climate:"Климат",leak:"Протечка",access:"Контроль доступа",fire:"Пожарная безопасность"};return {title:names[slug]??"Инженерная система"};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!slugs.includes(slug))notFound();return <SystemDetailPage slug={slug}/>;}
