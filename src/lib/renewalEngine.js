import { appToday, parseDate, daysBetween } from "./eventEngine";
export function daysUntil(expiry){ return daysBetween(appToday, parseDate(expiry)); }
export function renewalStatus(expiry){
  const days=daysUntil(expiry);
  if(days<0) return {tone:"red",label:"Expired"};
  if(days<=14) return {tone:"red",label:"Act now"};
  if(days<=30) return {tone:"amber",label:"Review now"};
  if(days<=60) return {tone:"amber",label:"Plan"};
  return {tone:"green",label:"On track"};
}
export function sortedRenewals(items){ return [...items].sort((a,b)=>parseDate(a.expiry)-parseDate(b.expiry)); }
