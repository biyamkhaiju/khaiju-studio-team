import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ledgerSchema } from "./ledger-schema";
import type { Json } from "@/integrations/supabase/types";

export const fetchLedger = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).handler(async ({context})=>{
 const db=context.supabase;
 async function rows<T>(request:PromiseLike<{data:T[]|null;error:{message:string}|null}>) { const result=await request; if(result.error) throw new Error(result.error.message); return result.data??[]; }
 async function all<T>(query:(start:number)=>PromiseLike<{data:T[]|null;error:{message:string}|null}>) { const result:T[]=[]; for(let start=0;;start+=1000) { const page=await rows(query(start)); result.push(...page); if(page.length<1000)return result; } }
 const [clients,projects,payments,expenses,activity,invoices,items,assignments]=await Promise.all([
 all(s=>db.from("clients").select("*").order("id").range(s,s+999)),all(s=>db.from("projects").select("*").order("id").range(s,s+999)),all(s=>db.from("payments").select("*").order("id").range(s,s+999)),all(s=>db.from("expenses").select("*").order("id").range(s,s+999)),all(s=>db.from("activity").select("*").order("id").range(s,s+999)),all(s=>db.from("invoices").select("*").order("id").range(s,s+999)),all(s=>db.from("invoice_items").select("*").order("id").range(s,s+999)),all(s=>db.from("project_workers").select("*").order("id").range(s,s+999))]);
 return ledgerSchema.parse({clients:clients.map(x=>({id:x.id,name:x.name,kind:x.kind,email:x.email,phone:x.phone,location:x.location,createdAt:x.created_at})), projects:projects.map(x=>({id:x.id,name:x.name,division:x.division,clientId:x.client_id??"",status:x.status,budget:Number(x.budget),startDate:x.start_date,deadline:x.deadline??"",description:x.description,milestones:x.milestones,manualProgress:x.manual_progress})),payments:payments.map(x=>({id:x.id,projectId:x.project_id??"",invoiceId:x.invoice_id,amount:Number(x.amount),date:x.date,note:x.note})),expenses:expenses.map(x=>({id:x.id,projectId:x.project_id,category:x.category,amount:Number(x.amount),date:x.date,note:x.note})),activity:activity.map(x=>({id:x.id,text:x.text,date:x.created_at})).sort((a,b)=>b.date.localeCompare(a.date)),invoices:invoices.map(x=>({id:x.id,projectId:x.project_id,clientId:x.client_id,number:x.number,clientName:x.client_name,clientEmail:x.client_email,issueDate:x.issue_date,dueDate:x.due_date,notes:x.notes})),invoiceItems:items.map(x=>({id:x.id,invoiceId:x.invoice_id,description:x.description,quantity:Number(x.quantity),rate:Number(x.rate)})),assignments:assignments.map(x=>({id:x.id,projectId:x.project_id,workerId:x.worker_id}))});
});
const tableMap={clients:"clients",projects:"projects",payments:"payments",expenses:"expenses",activity:"activity",invoices:"invoices",invoiceItems:"invoice_items",assignments:"project_workers"} as const;
const snake:Record<string,string>={clientId:"client_id",projectId:"project_id",invoiceId:"invoice_id",workerId:"worker_id",startDate:"start_date",manualProgress:"manual_progress",clientName:"client_name",clientEmail:"client_email",issueDate:"issue_date",dueDate:"due_date",createdAt:"created_at",date:"date"};
export const saveLedger = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator((value:{before:unknown;after:unknown})=>({before:ledgerSchema.parse(value.before),after:ledgerSchema.parse(value.after)})).handler(async ({data,context})=>{
 const changes:Json[]=[];
 const keys=Object.keys(tableMap) as (keyof typeof tableMap)[];
 for(const key of [...keys].reverse()) for(const row of data.before[key]) if(!data.after[key].some(x=>x.id===row.id)) changes.push({table:tableMap[key],operation:"delete",id:row.id});
 for(const key of keys) for(const row of data.after[key]) {
 if(JSON.stringify(data.before[key].find(x=>x.id===row.id))===JSON.stringify(row))continue;
 const mapped:Record<string,Json>={};
 for(const [field,value] of Object.entries(row)) { if(field==="createdAt")continue; const target=key==="activity"&&field==="date"?"created_at":snake[field]??field; mapped[target]=(["clientId","projectId","invoiceId"].includes(field)&&value==="")?null:value as Json; }
 changes.push({table:tableMap[key],operation:"upsert",id:row.id,row:mapped});
 }
  // Persist retained rows and detached references before removing their former parents.
  const ordered=[...changes.filter(c=>typeof c==="object"&&c!==null&&!Array.isArray(c)&&c["operation"]==="upsert"),...changes.filter(c=>typeof c==="object"&&c!==null&&!Array.isArray(c)&&c["operation"]==="delete")];
  const {error}=await context.supabase.rpc("apply_ledger_changes",{changes:ordered}); if(error)throw new Error(error.message); return {ok:true};
});