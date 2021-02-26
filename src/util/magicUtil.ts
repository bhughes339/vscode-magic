export namespace constants {
    export const wordRange = /[A-Za-z\d.]+/;

    export const macroPrefix = /^(?:#|\[\d+]::)?/;
    export const macroRange = /[A-Z\d.]+/;
    export const macroDefinitionRange = new RegExp(`${macroPrefix.source}(${macroRange.source})$`);

    export const epochDelta = 320734800;

    export function magicSecondsToDateTime(s: number): string | null {
        let epochSeconds = s + epochDelta;
        return (epochSeconds < 2147483647)
            ? new Date(epochSeconds * 1000).toLocaleString(undefined, {hour12: false})
            : null;
    }
}
