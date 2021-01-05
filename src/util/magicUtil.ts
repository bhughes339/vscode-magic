export namespace constants {
    export const wordRange = /[A-Za-z\d.]+/;

    export const macroPrefix = /^(?:#|\[\d+]::)?/;
    export const macroRange = /[A-Z\d.]+/;
    export const macroDefinitionRange = new RegExp(`${macroPrefix.source}(${macroRange.source})$`);

    export const epochDelta = 320731200;

    // Copied from $DATE and $TIME in MAGIC
    export function magicSecondsToDateTime(s: number): string {
        let f = Math.floor;
        let hour = f(s%86400/3600+100).toString().substr(1);
        let minutes = f(s%3600/60+100).toString().substr(1);
        let seconds = f(s%60+100).toString().substr(1);
        let s1 = (s >= 86400) ? f(s/86400) : s;
        let s2 = s1%1461*366/365&1463;
        let year = f(f(s1/1461)*4+(f((s2+60)/366))+180).toString().substr(1);
        year = (parseInt(year) < 60) ? `20${year}` : `19${year}`;
        s1 = f(s2%366);
        s2 = f(s1%153);
        let s3 = f(s2%61);
        let month = (((f(s1/153)*5)+(f(s2/61)*2)+(f(s3/31)+2))%12+101).toString().substr(1);
        let day = (f(s3%31)+101).toString().substr(1);
        return `S(0) Date: ${month}/${day}/${year} ${hour}:${minutes}:${seconds}`
    }
}
