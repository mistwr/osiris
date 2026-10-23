/** Portugal source catalog for OSIRIS. Public endpoints only; verify provider terms. */
export type LuminSource = {id:string;name:string;homepage:string;endpoint?:string;category:'weather'|'seismic'|'fires'|'cameras'|'traffic';status:'ready'|'research'};
export const portugalSources: LuminSource[] = [
{id:'ipma-weather',name:'IPMA — previsão meteorológica',homepage:'https://api.ipma.pt/',endpoint:'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1131200.json',category:'weather',status:'ready'},
{id:'ipma-seismic',name:'IPMA — sismicidade',homepage:'https://www.ipma.pt/',category:'seismic',status:'research'},
{id:'portugal-cameras',name:'Câmaras públicas autorizadas',homepage:'https://dados.gov.pt/',category:'cameras',status:'research'},
{id:'portugal-fires',name:'Incêndios — fontes oficiais',homepage:'https://www.prociv.gov.pt/',category:'fires',status:'research'},
{id:'portugal-traffic',name:'Tráfego — fontes oficiais',homepage:'https://dados.gov.pt/',category:'traffic',status:'research'}
];
